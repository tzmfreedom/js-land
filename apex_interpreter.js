const Ast = require('./node/ast');
const methodSearcher = require('./methodSearcher');
const variableSearcher = require('./variableSearcher');
const EnvManager = require('./envManager');
const ApexClass = require('./apexClass').ApexClass;
const dataLoader = require('./data_loader');
const DebuggerPublisher = require('./debugger_publisher');
const Event = require('./event');
const rl = require('readline-sync');
const fs = require('fs');

class ApexInterpreter {
  visit(node) {
    EnvManager.pushScope({});
    node.accept(this);
    EnvManager.popScope();
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
    return receiver._records[key.value].value;
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
    let receiver, key;
    [receiver, key] = node.object.accept(this);
    dataManager[type](receiver);
  }

  visitDouble(node) {
    return node;
  }

  visitFieldAccess(node) {
    const receiverNode = node.expression.accept(this);
    return receiverNode.instanceFields[node.fieldName];
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
      env.set(forControl.variableDeclaratorId, object.value);
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
    const searchResult = methodSearcher.searchMethodByValue(node, this);

    let env = {};
    if (!(searchResult.receiverNode instanceof ApexClass)) {
      env.this = {
        type: searchResult.receiverNode,
        value: searchResult.receiverNode,
      };
    }

    for (let i = 0; i < searchResult.methodNode.parameters.length; i++) {
      let parameter = searchResult.methodNode.parameters[i];
      env[parameter.name] = {
        type: parameter.type,
        value: node.parameters[i].accept(this),
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
    let result = variableSearcher.searchFieldByValue(node);
    if (result.key) {
      return result.receiverNode.instanceFields[result.key];
    } else {
      return EnvManager.getValue(result.receiverNode);
    }
  }

  visitNew(node) {
    let newObject = new Ast.ApexObjectNode();
    newObject.classType = node.classType;
    newObject.instanceFields = {};
    const instanceFields = node.classType.classNode.instanceFields;
    Object.keys(instanceFields).forEach((fieldName) => {
      newObject.instanceFields[fieldName] = instanceFields[fieldName].expression.accept(this);
    });

    const constructor = node.classType.classNode.constructors[0];

    let env = {
      this: {
        type: node.classType,
        value: newObject,
      }
    };
    if (constructor) {
      for (let i = 0; i < constructor.parameters.length; i++) {
        let parameter = constructor.parameters[i];
        env[parameter.name] = {
          type: parameter.type,
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
    let result = variableSearcher.searchFieldByValue(node.expression);
    let prev, value;
    if (result.key) {
      prev = result.receiverNode.instanceFields[result.key];
      switch(node.op) {
        case '++':
          value = prev.value + 1;
        case '--':
          value = prev.value - 1;
      }
      result.receiverNode.instanceFields[result.key] = new Ast.IntegerNode(value);
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
    switch(node.op) {
      case '+':
        return new Ast.IntegerNode(left.value + right.value);
      case '-':
        return new Ast.IntegerNode(left.value - right.value);
      case '*':
        return new Ast.IntegerNode(left.value * right.value);
      case '/':
        return new Ast.IntegerNode(left.value / right.value);
      case '%':
        return new Ast.IntegerNode(left.value % right.value);
      case '<<<':
        return new Ast.IntegerNode(left.value << right.value);
      case '<<':
        return new Ast.IntegerNode(left.value << right.value);
      case '>>>':
        return new Ast.IntegerNode(left.value >> right.value);
      case '>>':
        return new Ast.IntegerNode(left.value >> right.value);
      case '&':
        return new Ast.IntegerNode(left.value & right.value);
      case '|':
        return new Ast.IntegerNode(left.value | right.value);
      case '^':
        return new Ast.IntegerNode(left.value ^ right.value);
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
        if (node.right instanceof Ast.ArrayAccessNode) {
          const receiver = node.left.receiverNode.accept(this);
          const key = node.left.key.accept(this);
          receiver._records[key.value] = right;
        } else {
          let result = variableSearcher.searchFieldByValue(node.left);
          right = node.right.accept(this);
          if (result.key) {
            result.receiverNode.instanceFields[result.key] = right;
          } else {
            EnvManager.setValue(result.receiverNode, right);
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
    return dataLoader();
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
    console.log(node);
  }

  visitTry(node) {
    console.log(node);
  }

  visitSpecialComment(node) {
    let step = 1;
    const subscriberId = DebuggerPublisher.addSubscriber('line', (event) => {
      if (step > 0) step -= 1;
      if (step == 0) {
        this.REPL();
      }
      DebuggerPublisher.unsubscribe('line', subscriberId);
    });
    return false;
  }

  REPL() {
    const visitor = this;
    let step = -1;
    let frame = -1;

    const showFile = (event) => {
      const start = event.lineno - 3;
      const end = event.lineno + 3;
      const filebody = fs.readFileSync('./examples/sample3.cls', 'utf8');
      const lines = filebody.split('\n');
      for (let i = start; i < end; i++) {
        if (i == event.lineno) {
          console.log(`=> ${i}: ${lines[i]}`);
        } else {
          console.log(`   ${i}: ${lines[i]}`);
        }
      }
    };
    const handler = {
      show: (args) => {
        try {
          console.log(EnvManager.get(args[0]).val());
        } catch (e) {
          console.error(e);
        }
        return true;
      },
      variables: (args) => {
        const showVariables = (scope) => {
          Object.keys(scope.env).forEach((key) => {
            console.log(`${key} => ${scope.env[key].val()}`);
          });
          if (scope.parent) showVariables(scope.parent);
        };
        showVariables(EnvManager.currentScope());
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
            showFile(event)
            visitor.REPL();
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
