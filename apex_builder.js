let Ast = require('./node/ast');
let ApexClassStore = require('./apexClass').ApexClassStore;
let ApexClass = require('./apexClass').ApexClass;
let LocalEnvironment = require('./localEnv');
let methodSearcher = require('./methodSearcher');
let ApexObject = require('./apexClass').ApexObject;

class ApexBuilder {
  visit(node) {
    this.pushScope({});
    node.accept(this);
    this.popScope();
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
        this.pushScope(env, null);
        methods[parameterHash].accept(this);
        this.popScope();
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
        this.pushScope(env, null);
        methods[parameterHash].accept(this);
        this.popScope();
      });
    });

    Object.keys(node.staticFields).forEach((fieldName) => {
      node.staticFields[fieldName].accept(this);
    });

    Object.keys(node.instanceFields).forEach((fieldName) => {
      node.instanceFields[fieldName].accept(this);
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
    return new ApexObject(classNode, instanceFields);
  }

  visitFieldDeclaration(node) {

  }

  visitAnnotation(node) {
    return node;
  }

  visitInteger(node) {
    return new Ast.TypeNode(['Integer'], []);
  }

  visitParameter(node) {
    return node;
  }

  visitArrayAccess(node) {
  
  }

  visitBoolean(node) {
    return new Ast.TypeNode(['Boolean'], []);
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
    return new Ast.TypeNode(['Double'], []);
  }

  visitFieldDeclaration(node) {
  
  }

  visitFieldDeclarator(node) {
  
  }

  visitFor(node) {
    this.pushScope({});

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

    this.popScope();
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
      this.pushScope(env, null);
      let returnValue = searchResult.methodNode.statements.accept(this);
      this.popScope();
    }
  }

  visitName(node) {
    let values = methodSearcher.searchField(node);
    if (values) return values;
    throw `Variable not declaration : ${node.value.join('.')}`
  }

  visitNew(node) {

  }

  visitNull(node) {
    return node;
  }

  visitObject(node) {
    return new Ast.TypeNode([node.classNode.name], node.genericType);
  }

  visitUnaryOperator(node) {
    return new Ast.TypeNode(['Integer'], []);
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
        let leftName = left.name.join('.');
        if (leftName != 'Integer' && leftName != 'Double') {
          throw `Must be integer or double, but ${left.name}`;
        }
        let rightName = right.name.join('.');
        if (rightName != 'Integer' && rightName != 'Double') {
          throw `Must be integer or double, but ${right.name}`;
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
        if (!left.equals(right)) {
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
          left = searchResult.receiverNode.instanceFields[searchResult.key].accept(this);
        } else {
          left = this.getValue(searchResult.receiverNode);
        }
        right = node.right.accept(this);
        if (!left.equals(right)) {
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
    return node.type;
  }

  visitReturn(node) {
    return node
  }

  visitSoql(node) {
    // TODO: parse node and extract object
    let object = 'Account';
    return new Ast.TypeNode(['List'], [new Ast.TypeNode([object], [])]);
  }

  visitString(node) {
    return new Ast.TypeNode(['String'], []);
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
      let decl = declarator.accept(this);

      if (decl.expression && !this.checkType(type, decl.expression)) {
        throw `Type not matched : variable => ${type.name}, initializer => ${decl.expression.name}`
      }
      let env = this.currentScope();
      env.define(type, declarator.name, type);
    });
  }

  visitVariableDeclarator(node) {
    let name = node.name;
    let expression = node.expression ? node.expression.accept(this) : null;
    if (this.localIncludes(name)) {
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

  currentScope() {
    return LocalEnvironment.currentScope();
  }

  getValue(key) {
    return LocalEnvironment.get(key).value;
  }

  localIncludes(key) {
    return LocalEnvironment.includes(key);
  }

  pushScope(env, parent) {
    if (parent !== null) parent = LocalEnvironment.currentScope();
    LocalEnvironment.pushScope(env, parent);
  }

  popScope() {
    LocalEnvironment.popScope();
  }

  checkType(left, right) {
    if (right instanceof Ast.NullNode) return true;
    if (!left.equals(right)) return false;
    if (!left.parameters || !right.parameters) return true;
    for (let i = 0; i < left.parameters.length; i++) {
      let leftParameter = left.parameters[i];
      let rightParameter = right.parameters[i];
      if (!this.checkType(leftParameter, rightParameter)) return false;
    }
    return true;
  }
}

module.exports = ApexBuilder;
