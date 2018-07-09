const Ast = require('./node/ast');
const ApexClassStore = require('./apexClass').ApexClassStore;
const methodSearcher = require('./methodSearcher');
const EnvManager = require('./envManager');
const TypeSearcher = require('./typeSearcher');

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
          throw `Compile Error: duplicate modifier ${name} at line : `
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
        throw `Compile Error: duplicate modifier ${name} at line : `
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
          env[parameter.name] = parameter.type;
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
          env[parameter.name] = parameter.type;
        });
        EnvManager.pushScope(env, null);
        methods[parameterHash].accept(this);
        EnvManager.popScope();
      });
    });

    Object.keys(node.staticFields).forEach((fieldName) => {
      const staticField = node.staticFields[fieldName];
      // staticField.type;
      // staticField.expression.accept(this);
    });

    Object.keys(node.instanceFields).forEach((fieldName) => {
      const instanceField = node.instanceFields[fieldName];
      // instanceField.type;
      // instanceField.expression.accept(this);
    });
  }

  visitMethodDeclaration(node) {
    this.validateModifierDuplication(node);
    // returnType Check
    if (node.returnType != 'void'){
      let returnType = ApexClassStore.get(node.returnType.name.join('.'));
      if (!returnType) {
        // TODO: lineno
        throw `Invalid return type ${node.returnType} at line`;
      }
    }
    this.validateParameter(node);

    node.statements.accept(this);
    return node;
  }

  createObject(className) {
    let classInfo = ApexClassStore.get(className);
    let instanceFields = {};
    Object.keys(classInfo.instanceFields).forEach((fieldName) => {
      instanceFields[fieldName] = classInfo.instanceFields[fieldName].expression.accept(this);
    });
    const classNode = ApexClassStore.get(className);
    return new Ast.ApexObjectNode(classNode, instanceFields);
  }

  visitFieldDeclaration(node) {

  }

  visitFieldDeclarator(node) {

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
  
  }

  visitApexObject(node) {
    return node;
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
  
  }

  visitDml(node) {
  
  }

  visitDouble(node) {
    return node;
  }

  visitFor(node) {
    EnvManager.pushScope({});

    let forControl = node.forControl;
    forControl.forInit.accept(this);
    forControl.forUpdate.forEach((statement) => { statement.accept(this) });

    let condition = forControl.expression.accept(this);
    if (!condition instanceof Ast.BooleanNode) {
      throw `Should be boolean expression`;
    }
    node.statements.forEach((statement) => {
      statement.accept(this);
    });

    EnvManager.popScope();
    return node;
  }

  visitIf(node) {
    let condition = node.condition.accept(this);
    if (!condition instanceof Ast.BooleanNode) {
      throw `Should be boolean expression`;
    }
    node.ifStatement.accept(this);
    if (node.elseStatement) node.elseStatement.accept(this);

    return node;
  }

  visitMethodInvocation(node) {
    let searchResult = methodSearcher.searchMethod(node);
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
    let values = methodSearcher.searchField(node);
    if (values) return values;
    throw `Variable not declaration : ${node.value.join('.')}`
  }

  visitNew(node) {
    const classNode = TypeSearcher.search(node.type);
    node.typeClassNode = classNode;

    const instanceFields = {};
    Object.keys(classNode.instanceFields).map((fieldName) => {
      const field = classNode.instanceFields[fieldName];
      instanceFields[fieldName] = {
        type: field.type,
        value: field.expression.accept(this),
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
    let left, right;
    switch(node.type) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
      case '<<<':
      case '<<':
      case '>>>':
      case '>>':
        left = node.left.accept(this);
        right = node.right.accept(this);
        let leftType = left.type();
        if (leftType != 'Integer' && leftType != 'Double') {
          throw `Must be integer or double, but ${leftType}`;
        }
        let rightType = right.type();
        if (rightType != 'Integer' && rightType != 'Double') {
          throw `Must be integer or double, but ${rightType}`;
        }
        return left;
      case '&':
      case '|':
      case '^':
        left = node.left.accept(this);
        right = node.right.accept(this);
        if (left.name != 'Integer') {
          throw `Must be integer, but ${left.name}`;
        }
        if (right != 'Integer') {
          throw `Must be integer, but ${right.name}`;
        }
        if (left.name != right.name) {
          throw `Type not matched : left => ${left.name}, right => ${right.name}`
        }
        return left;
      case '<':
      case '>':
      case '<=':
      case '>=':
      case '==':
      case '===':
      case '!=':
      case '!==':
        left = node.left.accept(this);
        right = node.right.accept(this);
        if (left.type() != right.type()) {
          throw `Type not matched : left => ${left.name}, right => ${right.name}`
        }
        return left;
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
        let searchResult = node.left.accept(this);
        if (searchResult.key) {
          left = searchResult.receiverNode.instanceFields[searchResult.key].type;
        } else {
          left = EnvManager.get(searchResult.receiverNode).type;
        }
        right = node.right.accept(this);
        if (!this.checkType(left, right)) {
          throw `Type not matched : left => ${left.name}, right => ${right.name}`
        }
        return left;
      case '&=':
      case '|=':
      case '^=':
        left = node.left.accept(this);
        right = node.right.accept(this);
        if (left.name != right.name) {
          throw `Type not matched : left => ${left.name}, right => ${right.name}`
        }
        return left;
    }
  }

  visitCastExpression(node) {
    // TODO: check extends or implementation
    const castType = TypeSearcher.search(node.type);
    const obj = new Ast.ApexObjectNode();
    obj.classNode = castType;
    return obj;
  }

  visitReturn(node) {
    return node
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

  visitString(node) {
    return new Ast.StringNode();
  }

  visitSwitch(node) {
  
  }

  visitTrigger(node) {
  
  }

  visitTriggerTiming(node) {
  
  }

  visitType(node) {
    return node;
  }

  visitVariableDeclaration(node) {
    let type = node.type;
    node.declarators.forEach((declarator) => {
      let decl = declarator.accept(this);

      if (decl.expression && !this.checkType(type, decl.expression)) {
        throw `Type not matched : variable => ${type.name.join('.')}, initializer => ${decl.expression.type()}`
      }
      let env = EnvManager.currentScope();
      env.define(type, declarator.name, decl.expression ? decl.expression.accept(this) : new Ast.NullNode());
    });
  }

  visitVariableDeclarator(node) {
    let name = node.name;
    let expression = node.expression ? node.expression.accept(this) : null;
    if (EnvManager.localIncludes(name)) {
      throw `duplicate variable name ${name}`;
    }
    return { name, expression };
  }

  visitWhen(node) {
  
  }

  visitWhile(node) {
  
  }

  visitBlock(node) {
    node.statements.forEach((statement) => {
      statement.accept(this);
    });
  }


  checkType(left, right) {
    if (right instanceof Ast.NullNode) return true;
    if (left.name.join('.') !== right.type()) return false;
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
