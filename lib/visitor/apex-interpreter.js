const Ast = require('../node/ast');
const methodResolver = require('../method-resolver');
const variableResolver = require('../variable-resolver');
const EnvManager = require('../env-manager');
const ApexClass = require('../node/apex-class');
const dataManager = require('../data-manager');
const DebuggerPublisher = require('../debugger-publisher');
const Event = require('../event');
const rl = require('readline-sync');
const fs = require('fs');
const Table = require('cli-table');
const CaseIgnoredStore = require('../store/case-ignored-store')

class ApexInterpreter {
  visit(node) {
    EnvManager.pushScope({
      _class: {
        type: null,
        value: require('../store/apex-class-store').get(node.nameOrExpression.value[0])
      }
    })
    const result = node.accept(this)
    EnvManager.popScope();
    return result
  }

  visitAnnotation(node) {
    return node;
  }

  visitInteger(node) {
    return node;
  }

  visitParameter(node) {
    return node;
  }

  visitArrayAccess(node) {
    const receiver = node.receiver.accept(this);
    const key = node.key.accept(this);
    return receiver._records[key.value];
  }

  visitBoolean(node) {
    return node;
  }

  visitBreak(node) {
    return node;
  }

  visitComment(node) {

  }

  visitContinue(node) {
    return node;
  }

  visitDml(node) {
    let type = node.type;
    const sobject = node.expression.accept(this);
    dataManager[type](sobject);
  }

  visitDouble(node) {
    return node;
  }

  visitFieldAccess(node) {
    const receiverNode = node.expression.accept(this);
    return receiverNode.instanceFields.get(node.fieldName);
  }

  visitFor(node) {
    EnvManager.pushScope({});

    if (node.forControl instanceof Ast.EnhancedForControlNode) {
      return this.visitEnhancedFor(node);
    }
    let forControl = node.forControl;
    forControl.forInit.accept(this);

    let condition = forControl.expression.accept(this);
    let returnNode;
    while (condition.value == true) {
      returnNode = node.statements.accept(this);
      if (
        returnNode instanceof Ast.ReturnNode ||
        returnNode instanceof Ast.BreakNode ||
        returnNode instanceof Ast.ContinueNode
      ) {
        break;
      }
      forControl.forUpdate.forEach((statement) => { statement.accept(this) });
      condition = forControl.expression.accept(this)
    }
    EnvManager.popScope();
    return returnNode;
  }

  visitEnhancedFor(node) {
    EnvManager.pushScope({});

    const forControl = node.forControl;
    const env = EnvManager.currentScope();
    env.define(forControl.type, forControl.variableDeclaratorId, new Ast.NullNode());

    const expression = forControl.expression.accept(this);
    expression._idx = 0;

    const hasNextInstanceMethod = expression.type().classNode.instanceMethods['hasNext'][0];
    const nextInstanceMethod = expression.type().classNode.instanceMethods['next'][0];
    let condition = this.invokeMethodByNoParameter(hasNextInstanceMethod, expression);

    let returnNode;
    while (condition.value == true) {
      const object = this.invokeMethodByNoParameter(nextInstanceMethod, expression);
      env.set(forControl.variableDeclaratorId, object);
      returnNode = node.statements.accept(this);
      if (
        returnNode instanceof Ast.ReturnNode ||
        returnNode instanceof Ast.BreakNode ||
        returnNode instanceof Ast.ContinueNode
      ) {
        break;
      }
      condition = this.invokeMethodByNoParameter(hasNextInstanceMethod, expression);
    }
    EnvManager.popScope();
    return returnNode;
  }

  invokeMethodByNoParameter(methodNode, expression) {
    EnvManager.pushScope({ this: { value: expression }});
    let returnNode;
    if (methodNode.nativeFunction) {
      returnNode = methodNode.nativeFunction.call(this);
    } else {
      returnNode = methodNode.statements.accept(this);
    }
    EnvManager.popScope();
    return returnNode;
  }

  visitForControl(node) {
    return node;
  }

  visitIf(node) {
    let condition = node.condition.accept(this);
    let returnNode;
    if (condition.value == true) {
      returnNode = node.ifStatement.accept(this);
    } else if (node.elseStatement) {
      returnNode = node.elseStatement.accept(this);
    }
    return returnNode;
  }

  visitMethodInvocation(node) {
    DebuggerPublisher.publish(new Event('method_invocation', node, node.lineno));
    const searchResult = methodResolver.searchMethodByValue(node, this);

    let env = {};
    if (!(searchResult.receiverNode instanceof ApexClass)) {
      env.this = {
        type: searchResult.receiverNode.classType,
        value: searchResult.receiverNode,
      };
    }

    for (let i = 0; i < searchResult.methodNode.parameters.length; i++) {
      let parameter = searchResult.methodNode.parameters[i];
      env[parameter.name] = {
        type: parameter.type(),
        value: node.parameters[i].accept(this),
      }
    }
    if (searchResult.methodNode.isStatic()) {
      env._class = {
        type: null,
        value: searchResult.receiverNode,
      }
    }

    EnvManager.pushScope(env);
    let returnNode;
    if (searchResult.methodNode.nativeFunction) {
      const value = searchResult.methodNode.nativeFunction.call(this);
      returnNode = { value };
    } else {
      returnNode = searchResult.methodNode.statements.accept(this);
    }
    EnvManager.popScope();
    DebuggerPublisher.publish(new Event('method_return', node, node.lineno));
    if (returnNode) return returnNode.value;
    return null;
  }

  visitName(node) {
    let result = variableResolver.searchFieldByValue(node, this);
    if (result.key) {
      return result.receiverNode.instanceFields.get(result.key);
    } else {
      return EnvManager.getValue(result.receiverNode);
    }
  }

  visitNew(node) {
    let newObject = new Ast.ApexObjectNode();
    newObject.classType = node.classType;
    newObject.instanceFields = new CaseIgnoredStore();
    const instanceFields = node.classType.classNode.instanceFields;
    instanceFields.keys().forEach((fieldName) => {
      newObject.instanceFields.set(fieldName, instanceFields.get(fieldName).expression.accept(this));
    });

    const constructor = node.classType.classNode.constructors[0];

    let env = {
      this: {
        type: node.classType,
        value: newObject,
      },
    };
    if (constructor) {
      for (let i = 0; i < constructor.parameters.length; i++) {
        let parameter = constructor.parameters[i];
        env[parameter.name] = {
          type: parameter.type(),
          value: node.parameters[i].accept(this),
        };
      }
      EnvManager.pushScope(env);
      if (constructor.nativeFunction) {
        constructor.nativeFunction.call(this);
      } else {
        constructor.statements.accept(this);
      }
      EnvManager.popScope();
    }
    return newObject;
  }

  visitNull(node) {
    node.value = null;
    return node;
  }

  visitUnaryOperator(node) {
    let result = variableResolver.searchFieldByValue(node.expression, this);
    let prev, value;
    if (result.key) {
      prev = result.receiverNode.instanceFields.get(result.key);
      switch(node.op) {
        case '++':
          value = prev.value + 1;
        case '--':
          value = prev.value - 1;
      }
      result.receiverNode.instanceFields.set(result.key, new Ast.IntegerNode(value));
    } else {
      prev = EnvManager.getValue(result.receiverNode);
      switch(node.op) {
        case '++':
          value = prev.value + 1;
          break;
        case '--':
          value = prev.value - 1;
          break;
      }
      EnvManager.setValue(result.receiverNode, new Ast.IntegerNode(value));
    }
    if (prev) {
      return new Ast.IntegerNode(value);
    } else {
      return prev;
    }
  }

  visitBinaryOperator(node) {
    let left = node.left.accept(this);
    let right = node.right.accept(this);
    let klassName = node.left.type().name.join('.')
    if (klassName == 'ID') klassName = 'String';
    const klass = Ast[`${klassName}Node`]
    switch(node.op) {
      case '+':
        return new klass(left.value + right.value);
      case '-':
        return new klass(left.value - right.value);
      case '*':
        return new klass(left.value * right.value);
      case '/':
        return new klass(left.value / right.value);
      case '%':
        return new klass(left.value % right.value);
      case '<<<':
        return new klass(left.value << right.value);
      case '<<':
        return new klass(left.value << right.value);
      case '>>>':
        return new klass(left.value >> right.value);
      case '>>':
        return new klass(left.value >> right.value);
      case '&':
        return new klass(left.value & right.value);
      case '|':
        return new klass(left.value | right.value);
      case '^':
        return new klass(left.value ^ right.value);
      case '<':
        return new Ast.BooleanNode(left.value < right.value);
      case '>':
        return new Ast.BooleanNode(left.value > right.value);
      case '<=':
        return new Ast.BooleanNode(left.value <= right.value);
      case '>=':
        return new Ast.BooleanNode(left.value >= right.value);
      case '==':
        return new Ast.BooleanNode(left.value == right.value);
      case '===':
        return new Ast.BooleanNode(left.value == right.value);
      case '!=':
        return new Ast.BooleanNode(left.value != right.value);
      case '!==':
        return new Ast.BooleanNode(left.value != right.value);
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
      case '&=':
      case '|=':
      case '^=':
        if (node.left instanceof Ast.ArrayAccessNode) {
          const receiver = node.left.receiver.accept(this);
          const key = node.left.key.accept(this);
          switch(node.op) {
            case '=':
              receiver._records[key.value] = right;
              break
            case '+=':
              receiver._records[key.value] = new klass(left.value + right.value);
              break
            case '-=':
              receiver._records[key.value] = new klass(left.value - right.value);
              break
            case '*=':
              receiver._records[key.value] = new klass(left.value * right.value);
              break
            case '/=':
              receiver._records[key.value] = new klass(left.value / right.value);
              break
            case '%=':
              receiver._records[key.value] = new klass(left.value % right.value);
              break
            case '&=':
              receiver._records[key.value] = new klass(left.value & right.value);
              break
            case '|=':
              receiver._records[key.value] = new klass(left.value | right.value);
              break
            case '^=':
              receiver._records[key.value] = new klass(left.value ** right.value);
              break
          }
        } else {
          let result = variableResolver.searchFieldByValue(node.left, this);
          right = node.right.accept(this);
          // FieldAccess
          if (result.key) {
            switch(node.op) {
              case '=':
                result.receiverNode.instanceFields.set(result.key, right);
                break
              case '+=':
                result.receiverNode.instanceFields.set(result.key, new klass(left.value + right.value));
                break
              case '-=':
                result.receiverNode.instanceFields.set(result.key, new klass(left.value - right.value));
                break
              case '*=':
                result.receiverNode.instanceFields.set(result.key, new klass(left.value * right.value));
                break
              case '/=':
                result.receiverNode.instanceFields.set(result.key, new klass(left.value / right.value));
                break
              case '%=':
                result.receiverNode.instanceFields.set(result.key, new klass(left.value % right.value));
                break
              case '&=':
                result.receiverNode.instanceFields.set(result.key, new klass(left.value & right.value));
                break
              case '|=':
                result.receiverNode.instanceFields.set(result.key, new klass(left.value | right.value));
                break
              case '^=':
                result.receiverNode.instanceFields.set(result.key, new klass(left.value ** right.value));
                break
            }
          } else {
            // LocalVariable
            switch(node.op) {
              case '=':
                EnvManager.setValue(result.receiverNode, new klass(right.value));
                break
              case '+=':
                EnvManager.setValue(result.receiverNode, new klass(left.value + right.value));
                break
              case '-=':
                EnvManager.setValue(result.receiverNode, new klass(left.value - right.value));
                break
              case '*=':
                EnvManager.setValue(result.receiverNode, new klass(left.value * right.value));
                break
              case '/=':
                EnvManager.setValue(result.receiverNode, new klass(left.value / right.value));
                break
              case '%=':
                EnvManager.setValue(result.receiverNode, new klass(left.value % right.value));
                break
              case '&=':
                EnvManager.setValue(result.receiverNode, new klass(left.value & right.value));
                break
              case '|=':
                EnvManager.setValue(result.receiverNode, new klass(left.value | right.value));
                break
              case '^=':
                EnvManager.setValue(result.receiverNode, new klass(left.value ** right.value));
                break
            }
          }
        }
        return right;
    }
  }

  visitReturn(node) {
    node.value = node.expression.accept(this);
    return node;
  }

  visitSoql(node) {
    return dataManager.load(node, this)
  }

  visitString(node) {
    return node;
  }

  visitSwitch(node) {
    const expression = node.expression.accept(this);
    const whenStatement = node.whenStatements.find((whenStatement) => {
      if (Array.isArray(whenStatement.condition)) {
        const match = whenStatement.condition.some((condition) => {
          return expression.value === condition.value;
        });
        if (match) return true;
      } else {
        const condition = whenStatement.condition.accept(this);
        return expression.value == condition.value;
      }
    });
    if (whenStatement) {
      whenStatement.statements.accept(this);
    } else if (node.elseStatement) {
      node.elseStatement.accept(this);
    }
  }

  visitTrigger(node) {
    node.statements.accept(this);
  }

  visitVariableDeclaration(node) {
    let type = node.type;
    node.declarators.forEach((declarator) => {
      let value = declarator.expression.accept(this);
      let env = EnvManager.currentScope();
      env.define(type, declarator.name, value);
    });
  }

  visitWhile(node) {
    EnvManager.pushScope({});
    let condition = node.condition.accept(this);
    let returnNode;
    while (condition.value == true) {
      for (let i = 0; i < node.statements.length; i++) {
        returnNode = node.statements[i].accept(this);
        if (
          returnNode instanceof Ast.ReturnNode ||
          returnNode instanceof Ast.BreakNode ||
          returnNode instanceof Ast.ContinueNode
        ) {
          break;
        }
      }
      if (
        returnNode instanceof Ast.ReturnNode ||
        returnNode instanceof Ast.BreakNode ||
        returnNode instanceof Ast.ContinueNode
      ) {
        break;
      }

      condition = node.condition.accept(this);
    }
    EnvManager.popScope();
    return returnNode;
  }

  visitBlock(node){
    let returnNode;
    for (let i = 0; i < node.statements.length; i++){
      const statement = node.statements[i];
      returnNode = statement.accept(this);

      DebuggerPublisher.publish(new Event('line', statement, statement.lineno));
      if (
        returnNode instanceof Ast.ReturnNode ||
        returnNode instanceof Ast.BreakNode ||
        returnNode instanceof Ast.ContinueNode
      ) {
        return returnNode;
      }
    }
  }

  visitThrow(node) {
    node.value = node.expression.accept(this)
    return node
  }

  visitTry(node) {
    const returnNode = node.block.accept(this);
    if (this.isReturn(returnNode)) {
      return returnNode;
    }
    if (this.isThrow(returnNode)) {
      for (let i = 0; i < node.catchClause.length; i++) {
        const catchClause = node.catchClause[i]
        if (returnNode.type() == catchClause.type) {
          const returnNode = catchClause.block.accept(this);
          if (this.isReturn(returnNode)) {
            return returnNode;
          }
          break;
        }
      }
    }

    if (node.finallyBlock) {
      const returnNode = node.finallyBlock.accept(this);
      if (this.isReturn(returnNode)) {
        return returnNode;
      }
    }
  }

  visitSpecialComment(node) {
    let step = 1;
    const subscriberId = DebuggerPublisher.addSubscriber('line', (event) => {
      if (step > 0) step -= 1;
      this.showFile({ filename: node.filename, lineno: node.lineno })
      if (step == 0) {
        this.REPL(node);
      }
      DebuggerPublisher.unsubscribe('line', subscriberId);
    });
    return false;
  }

  visitCastExpression(node) {
    return node.expression.accept(this)
  }

  visitTernalyExpression(node) {
    const condition = node.condition.accept(this)
    if (condition.value == true) {
      return node.trueExpression.accept(this)
    } else {
      return node.falseExpression.accept(this)
    }
  }

  isThrow(throwNode) {
    return throwNode instanceof Ast.ThrowNode;
  }

  isReturn(returnNode) {
    return returnNode instanceof Ast.ReturnNode ||
      returnNode instanceof Ast.BreakNode ||
      returnNode instanceof Ast.ContinueNode;
  }

  showFile(event) {
    const start = event.lineno - 3;
    const end = event.lineno + 3;
    const filebody = fs.readFileSync(event.filename, 'utf8');
    const lines = filebody.split('\n');
    for (let i = start; i < end; i++) {
      if (i == event.lineno) {
        console.log(`=> ${i}: ${lines[i]}`);
      } else {
        console.log(`   ${i}: ${lines[i]}`);
      }
    }
  }

  REPL(node) {
    const visitor = this;
    let step = -1;
    let frame = -1;
    const handler = {
      show: (args) => {
        try {
          const variable = EnvManager.get(args[0]).value;
          if (variable.value) {
            console.log(variable.value);
          } else {
            const table = new Table();
            table.push({ '_objectName': variable.classType.name.join('.') });
            variable.instanceFields.keys().sort().forEach((instanceFieldName) => {
              table.push({ [instanceFieldName]: variable.instanceFields.get(instanceFieldName) });
            });
            console.log(table.toString());
          }
        } catch (e) {
          console.error(e);
        }
        return true;
      },
      variables: (args) => {
        const fields = {};
        const showVariables = (scope) => {
          Object.keys(scope.env).forEach((key) => {
            fields[key] = scope.env[key].val();
          });
          if (scope.parent) showVariables(scope.parent);
        };
        showVariables(EnvManager.currentScope());

        const table = new Table();
        Object.keys(fields).sort().forEach((key) => {
          table.push({ [key]: fields[key] });
        });
        console.log(table.toString());
        return true;
      },
      scope: (args) => {
        console.log(EnvManager.currentScope());
        return true;
      },
      step: (args) => {
        step = 1;
        const subscriberId = DebuggerPublisher.addSubscriber('line', (event) => {
          if (step > 0) step--;
          if (step == 0) {
            DebuggerPublisher.unsubscribe('line', subscriberId);
            step = -1;

            visitor.REPL();
          }
        });
        return false;
      },
      next: (args) => {
        step = 1;
        frame = 0;
        const methodInvocationSubscriberId = DebuggerPublisher.addSubscriber('method_invocation', (event) => {
          if (frame >= 0) frame++;
        });
        const methodReturnSubscriberId = DebuggerPublisher.addSubscriber('method_return', (event) => {
          if (frame > 0) frame--;
        });
        const subscriberId = DebuggerPublisher.addSubscriber('line', (event) => {
          if (frame === 0 && step > 0) step--;
          if (step == 0) {
            DebuggerPublisher.unsubscribe('line', subscriberId);
            DebuggerPublisher.unsubscribe('method_invocation', methodInvocationSubscriberId);
            DebuggerPublisher.unsubscribe('method_return', methodReturnSubscriberId);
            step = -1;
            frame = -1;
            // TODO: あとで全nodeのfilenameをのせてコールバックイベントに含める
            event.filename = node.filename
            visitor.showFile(event)
            visitor.REPL(node);
          }
        });
        return false;
      },
      exit: (args) => {
        DebuggerPublisher.clearSubscriber('line');
        return false;
      }
    };

    while(true) {
      const words = rl.promptCL();
      const cmd = words.shift();
      if (cmd in handler) {
        const returnValue = handler[cmd].call(handler, words);
        if (!returnValue) break;
      }
    }
  }
}

module.exports = ApexInterpreter;
