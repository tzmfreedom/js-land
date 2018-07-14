const Ast = require('./node/ast');
const ApexClassStore = require('./apexClass').ApexClassStore;
const methodSearcher = require('./methodSearcher');
const EnvManager = require('./envManager');
const Runtime = require('./runtime');
const Variable = require('./variable');
const ApexClass = require('./apexClass').ApexClass;
const argumentChecker = require('./argumentChecker');

class ApexBuilder {
  visit(node) {
    EnvManager.pushScope({});
    node.accept(this);
    EnvManager.popScope();
  }

  validateModifierDuplication(node) {
    let modifiers = [];
    if (node.modifiers) {
      node.modifiers.map((modifier) => {
        if (modifiers.includes(modifier.name)) {
          // TODO: lineno
          throw `Compile Error: duplicate modifier ${name} at line ${node.lineno}`
        }
        modifiers.push(modifier.name);
      });
    }
  }

  validateParameter(node) {
    let parameters = [];
    node.parameters.map((parameter) => {
      if (parameters.includes(parameter.name)){
        // TODO: lineno
        throw `Compile Error: duplicate modifier ${name} at line ${node.lineno}`
      }
      parameters.push(parameter.name);
    });
  }

  visitClass(node) {
    this.validateModifierDuplication(node);

    let staticMethods = node.staticMethods;

    Object.keys(staticMethods).forEach((methodName) => {
      let methods = staticMethods[methodName];
      Object.keys(methods).forEach((parameterHash) => {
        let methodNode = methods[parameterHash];
        let env = {};
        methodNode.parameters.forEach((parameter) => {
          env[parameter.name] = { type: parameter.type };
        });
        EnvManager.pushScope(env, null);
        methods[parameterHash].accept(this);
        EnvManager.popScope();
      });
    });

    let newObject = this.createObject(node);
    let instanceMethods = node.instanceMethods;
    Object.keys(node.instanceMethods).forEach((methodName) => {
      let methods = instanceMethods[methodName];
      Object.keys(methods).forEach((parameterHash) => {
        let methodNode = methods[parameterHash];
        let env = {
          this: {
            type: newObject.type(),
            value: newObject,
          }
        };
        methodNode.parameters.forEach((parameter) => {
          env[parameter.name] = { type: parameter.type };
        });
        EnvManager.pushScope(env, null);
        methods[parameterHash].accept(this);
        EnvManager.popScope();
      });
    });

    Object.keys(node.staticFields).forEach((fieldName) => {
      const staticField = node.staticFields[fieldName];
      const expressionType = staticField.expression.type().classNode;
      if (expressionType && staticField.type.classNode != expressionType) {
        throw `Invalid type ${expressionType.name} at line ${node.lineno}`;
      }
    });

    Object.keys(node.instanceFields).forEach((fieldName) => {
      const instanceField = node.instanceFields[fieldName];
      const expressionType = instanceField.expression.type().classNode;
      if (expressionType && instanceField.type.classNode != expressionType) {
        throw `Invalid type ${expressionType.name} at line ${node.lineno}`;
      }
    });
  }

  visitMethodDeclaration(node) {
    this.validateModifierDuplication(node);
    this.validateParameter(node);

    // TODO: returnType Check
    if (node.statements) {
      node.statements.accept(this);
    }
  }

  createObject(classNode) {
    let instanceFields = {};
    // console.log(classInfo)
    Object.keys(classNode.instanceFields).forEach((fieldName) => {
      let field = classNode.instanceFields[fieldName];
      if (field.expression) {
        instanceFields[fieldName] = new Variable(
          field.type,
          field.expression.accept(this)
        );
      } else {
        instanceFields[fieldName] = new Variable(
          field.type,
          new Ast.NullNode(),
          field.setter,
          field.getter
        );
      }
    });
    const typeNode = new Ast.TypeNode([classNode.name], []);
    typeNode.classNode = ApexClassStore.get(classNode.name);
    return new Ast.ApexObjectNode(typeNode, instanceFields);
  }

  visitFieldDeclaration(node) {

  }

  visitFieldDeclarator(node) {

  }

  visitArrayAccess(node) {
    return node.receiver.accept(this);
  }

  visitBreak(node) {
    return node;
  }

  visitComment(node) {
  
  }

  visitContinue(node) {
  
  }

  visitDml(node) {
  
  }

  visitFor(node) {
    EnvManager.pushScope({});

    let forControl = node.forControl;
    forControl.forInit.accept(this);
    forControl.forUpdate.forEach((statement) => { statement.accept(this) });

    let condition = forControl.expression.type();
    if (!condition instanceof Ast.BooleanNode) {
      throw `Should be boolean expression at line ${condition.lineno}`;
    }
    node.statements.accept(this);

    EnvManager.popScope();
    return node;
  }

  visitIf(node) {
    let condition = node.condition.accept(this);
    if (!condition instanceof Ast.BooleanNode) {
      throw `Should be boolean expression at line ${condition.lineno}`;
    }
    node.ifStatement.accept(this);
    if (node.elseStatement) node.elseStatement.accept(this);

    return node;
  }

  visitMethodInvocation(node) {
    let searchResult = methodSearcher.searchMethod(node, 'type');
    const methodNode = argumentChecker(searchResult.methodNode, node.parameters);
    searchResult.methodNode = methodNode;
    let env = {};
    if (!(searchResult.receiverNode instanceof ApexClass)) {
      env.this = {
        type: searchResult.receiverNode,
        value: searchResult.receiverNode,
      };
    }
    for (let i = 0; i < searchResult.methodNode.parameters.length; i++) {
      let parameter = searchResult.methodNode.parameters[i];
      let value = node.parameters[i];
      env[parameter.name] = { type: parameter.type };
    }
    let parameters = node.parameters.map((parameter) => { return parameter.accept(this); });
  }

  visitName(node) {
    let values = methodSearcher.searchField(node, 'type');
    if (values) return values;
    throw `Variable not declaration : ${node.value.join('.')} at line ${node.lineno}`
  }

  visitNew(node) {
    const classNode = node.classType.classNode;
    const instanceFields = {};
    Object.keys(classNode.instanceFields).map((fieldName) => {
      const field = classNode.instanceFields[fieldName];
      if (field.expression) {
        instanceFields[fieldName] = new Variable(
          field.type,
          field.expression.accept(this)
        )
      } else {
        instanceFields[fieldName] = new Variable(
          field.type,
          new Ast.NullNode(),
          field.setter,
          field.getter
        )
      }
    });
    return new Ast.ApexObjectNode(classNode, instanceFields);
  }

  visitNull(node) {
    return node;
  }

  visitUnaryOperator(node) {
    return new Ast.IntegerNode();
  }

  visitBinaryOperator(node) {
    const leftType = node.left.type();
    const rightType = node.right.type();

    switch(node.op) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
      case '<<<':
      case '<<':
      case '>>>':
      case '>>':
        if (![Runtime.Integer, Runtime.Double].includes(leftType.classNode)) {
          throw `Must be integer or double, but ${leftType.name} at line ${node.lineno}`;
        }
        if (![Runtime.Integer, Runtime.Double].includes(rightType.classNode)) {
          throw `Must be integer or double, but ${rightType.name} at line ${node.lineno}`;
        }
        break;
      case '&':
      case '|':
      case '^':
        if (leftType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${leftType.name} at line ${node.lineno}`;
        }
        if (rightType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${rightType.name} at line ${node.lineno}`;
        }
        break;
      case '<':
      case '>':
      case '<=':
      case '>=':
      case '==':
      case '===':
      case '!=':
      case '!==':
        if (!this.checkType(leftType, rightType)) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        break;
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
        if (!this.checkType(leftType, rightType)) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        break;
      case '&=':
      case '|=':
      case '^=':
        if (leftType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${leftType.name} at line ${node.lineno}`;
        }
        if (rightType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${rightType.name} at line ${node.lineno}`;
        }
        if (!this.checkType(leftType, rightType)) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        break;
    }
  }

  visitSoql(node) {}

  visitReturn(node) {}


  visitString(node) {}

  visitInteger(node) {}

  visitDouble(node) {}

  visitBoolean(node) {}

  visitSwitch(node) {}

  visitTrigger(node) {}

  visitTriggerTiming(node) {}

  visitVariableDeclaration(node) {
    let type = node.type;
    node.declarators.forEach((declarator) => {
      if (!declarator.expression) return;
      const expressionType = declarator.expression.type().classNode;
      if (expressionType && expressionType !== node.type.classNode) {
        throw `Type not matched : variable => ${node.type.classNode.name}, initializer => ${expressionType.name} at line ${node.lineno}`
      }
      let env = EnvManager.currentScope();
      env.define(type, declarator.name, new Ast.NullNode());
    });
  }

  visitVariableDeclarator(node) {
    let name = node.name;
    let expression = node.expression ? node.expression.accept(this) : null;
    if (EnvManager.localIncludes(name)) {
      throw `duplicate variable name ${name} at line ${node.lineno}`;
    }
    return { name, expression };
  }

  visitWhen(node) {
  
  }

  visitWhile(node) {
  
  }

  visitBlock(node) {
    let returnNode;
    for (let i = 0; i < node.statements.length; i++) {
      returnNode = node.statements[i].accept(this);
      if (
        returnNode instanceof Ast.ReturnNode ||
        returnNode instanceof Ast.BreakNode ||
        returnNode instanceof Ast.ContinueNode
      ) {
        return returnNode;
      }
    }
  }

  checkType(leftType, rightType) {
    if (leftType.classNode !== rightType.classNode) return false;
    if (leftType.parameters.length === 0 && rightType.parameters.length === 0) return true;
    if (leftType.parameters.length !== rightType.parameters.length) return false;
    for (let i = 0; i < leftType.parameters.length; i++) {
      let leftTypeParameter = leftType.parameters[i];
      let rightTypeParameter = rightType.parameters[i];
      if (!this.checkType(leftTypeParameter, rightTypeParameter)) return false;
    }
    return true;
  }
}

module.exports = ApexBuilder;
