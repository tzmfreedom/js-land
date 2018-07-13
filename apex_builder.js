const Ast = require('./node/ast');
const ApexClassStore = require('./apexClass').ApexClassStore;
const methodSearcher = require('./methodSearcher');
const EnvManager = require('./envManager');
const Runtime = require('./runtime');

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

    let newObject = this.createObject(node.name);
    let instanceMethods = node.instanceMethods;
    Object.keys(node.instanceMethods).forEach((methodName) => {
      let methods = instanceMethods[methodName];
      Object.keys(methods).forEach((parameterHash) => {
        let methodNode = methods[parameterHash];
        let env = { this: newObject };
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
      const expressionType = staticField.expression.accept(this).type.classNode;
      if (staticField.type.classNode != expressionType) {
        throw `Invalid type ${expressionType.name} at line ${node.lineno}`;
      }
    });

    Object.keys(node.instanceFields).forEach((fieldName) => {
      const instanceField = node.instanceFields[fieldName];
      const expressionType = staticField.expression.accept(this).type.classNode;
      if (instanceField.type.classNode != expressionType) {
        throw `Invalid type ${expressionType.name} at line ${node.lineno}`;
      }
    });
  }

  visitMethodDeclaration(node) {
    this.validateModifierDuplication(node);
    this.validateParameter(node);

    // TODO: returnType Check
    node.statements.accept(this);
  }

  createObject(className) {
    let classInfo = ApexClassStore.get(className);
    let instanceFields = {};
    // console.log(classInfo)
    Object.keys(classInfo.instanceFields).forEach((fieldName) => {
      let field = classInfo.instanceFields[fieldName];
      if (field.expression) {
        instanceFields[fieldName] = {
          type: field.type,
          value: field.expression.accept(this),
        };
      } else {
        instanceFields[fieldName] = {
          type: field.type,
          value: new Ast.NullNode(),
          setter: field.setter,
          getter: field.getter,
        };
      }
    });
    const typeNode = new Ast.TypeNode([className], []);
    typeNode.classNode = ApexClassStore.get(className);
    return new Ast.ApexObjectNode(typeNode, instanceFields);
  }

  visitFieldDeclaration(node) {

  }

  visitFieldDeclarator(node) {

  }

  visitArrayAccess(node) {
  
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
    searchResult.methodNode = searchResult.methodNode[Object.keys(searchResult.methodNode)[0]];
    let env = { this: searchResult.receiverNode };
    for (let i = 0; i < searchResult.methodNode.parameters.length; i++) {
      let parameter = searchResult.methodNode.parameters[i];
      let value = node.parameters[i];
      env[parameter.name] = value;
    }
    let parameters = node.parameters.map((parameter) => { return parameter.accept(this); });

    if (searchResult.methodNode.nativeFunction) {
      return searchResult.methodNode.returnType;
    } else {
      EnvManager.pushScope(env, null);
      let returnValue = searchResult.methodNode.statements.accept(this);
      EnvManager.popScope();
    }
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
        instanceFields[fieldName] = {
          type: field.type,
          value: field.expression.accept(this),
        }
      } else {
        instanceFields[fieldName] = {
          type: field.type,
          value: new Ast.NullNode(),
          setter: field.setter,
          getter: field.getter,
        }
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
        if (!(leftType in [Runtime.Integer, Runtime.Double])) {
          throw `Must be integer or double, but ${leftType.name} at line ${node.lineno}`;
        }
        if (!(rightType in [Runtime.Integer, Runtime.Double])) {
          throw `Must be integer or double, but ${rightType.name} at line ${node.lineno}`;
        }
        break;
      case '&':
      case '|':
      case '^':
        if (leftType != Runtime.Integer) {
          throw `Must be integer, but ${leftType.name} at line ${node.lineno}`;
        }
        if (rightType != Runtime.Integer) {
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
        if (leftType != rightType) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        break;
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
        if (leftType != rightType) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        break;
      case '&=':
      case '|=':
      case '^=':
        if (leftType != Runtime.Integer) {
          throw `Must be integer, but ${leftType.name} at line ${node.lineno}`;
        }
        if (rightType != Runtime.Integer) {
          throw `Must be integer, but ${rightType.name} at line ${node.lineno}`;
        }
        if (leftType != rightType) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        break;
    }
  }

  visitSoql(node) {
    // TODO: parse node and extract object
    const listClassInfo = ApexClassStore.get('List');
    const objectClassInfo = ApexClassStore.get('Account');
    const obj = new Ast.ApexObjectNode();
    obj.classNode = listClassInfo;
    obj.genericType = objectClassInfo;
    return obj;
  }

  visitReturn(node) {}


  visitString(node) {
    return new Ast.StringNode();
  }

  visitSwitch(node) {
  
  }

  visitTrigger(node) {
  
  }

  visitTriggerTiming(node) {
  
  }

  visitVariableDeclaration(node) {
    let type = node.type;
    node.declarators.forEach((declarator) => {
      if (!declarator.expression) return;
      console.log(declarator.expression);
      const expressionType = declarator.expression.type().classNode;
      if (expressionType !== node.type.classNode) {
        throw `Type not matched : variable => ${node.type.classNode.name}, initializer => ${expressionType.classNode.name} at line ${node.lineno}`
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
        break;
      }
    }
  }

  // left => TypeNode
  // right => expression
  checkType(left, right) {
    if (right instanceof Ast.NullNode) return true;
    if (left.classNode !== right.type()) return false;
    if (!left.parameters || !right.genericType) return true;
    for (let i = 0; i < left.parameters.length; i++) {
      let leftParameter = left.parameters[i];
      let rightParameter = right.genericType[i];
      if (!this.checkType(leftParameter, rightParameter)) return false;
    }
    return true;
  }
}

module.exports = ApexBuilder;
