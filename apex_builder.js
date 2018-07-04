let Ast = require('./node/ast');
let ApexClassStore = require('./apexClass').ApexClassStore;
let ApexClass = require('./apexClass').ApexClass;
let LocalEnvironment = require('./localEnv');
let ApexClassCreator = require('./apexClassCreator');
let methodSearcher = require('./methodSearcher');

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

  validateStatement(node) {
    node.statements.forEach((statement) => {
      // TypeCheck
      // Variable Type Check
      statement.accept(this);
    });
  }

  visitClass(node) {
    this.validateModifierDuplication(node);

    let staticMethods = {};
    node.staticMethods.forEach((method) => {
      let method_name = method.name;
      if (method_name in staticMethods) {
        // TODO: check argument
        // TODO: lineno
        throw `Compile Error: duplicate method name ${method_name} at line : `
      }
      staticMethods[method_name] = method.accept(this);
    });

    let instanceMethods = {};
    node.instanceMethods.forEach((method) => {
      let method_name = method.name;
      if (method_name in instanceMethods) {
        // TODO: check argument
        // TODO: lineno
        throw `Compile Error: duplicate method name ${method_name} at line : `
      }
      instanceMethods[method_name] = method.accept(this);
    });

    let staticFields = {};
    node.staticFields.forEach((field) => {
      let field_name = field.name;
      if (field_name in staticFields) {
        // TODO: lineno
        throw `Compile Error: duplicate static field name ${field_name} at line : `
      }
      staticFields[field_name] = field.accept(this);
    });

    let instanceFields = {};
    node.instanceFields.forEach((field) => {
      field.declarators.forEach((declarator) => {
        if (declarator.name in instanceFields) {
          // TODO: lineno
          throw `Compile Error: duplicate instance field name ${declarator.name} at line : `
        }
        instanceFields[declarator.name] = declarator.expression.accept(this);
      });
    });

    const classInfo = new ApexClass(
      node.name,
      node.superClass,
      node.implementClasses,
      instanceFields,
      staticFields,
      instanceMethods,
      staticMethods,
    );

    ApexClassStore.register(classInfo);
  }

  visitMethodDeclaration(node) {
    this.validateModifierDuplication(node);
    // returnType Check
    if (node.returnType != 'void'){
      let returnType = ApexClassStore.get(node.returnType);
      if (!returnType) {
        // TODO: lineno
        throw `Invalid return type ${node.returnType} at line`;
      }
    }
    this.validateParameter(node);
    let env = {};
    node.parameters.forEach((parameter) => {
      env[parameter.name] = parameter.type;
    });
    this.pushScope(env);
    this.validateStatement(node);
    this.popScope();
    return node;
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
    let condition = node.forControl.accept(this);
    if (!condition instanceof Ast.BooleanNode) {
      throw `Should be boolean expression`;
    }
    node.statements.forEach((statement) => {
      statement.accept(this);
    });
    return node;
  }

  visitIf(node) {
    let condition = node.condition.accept(this);
    if (!condition instanceof Ast.BooleanNode) {
      throw `Should be boolean expression`;
    }
    node.ifStatement.forEach((statement) => {
      statement.accept(this);
    });
    node.elseStatement.forEach((statement) => {
      statement.accept(this);
    });
    return node;
  }

  visitMethodInvocation(node) {
    let receiver, methodNode;
    [receiver, methodNode] = methodSearcher.searchMethod(node);
    let env = {
      this: receiver,
    };
    for (let i = 0; i < methodNode.parameters.length; i++) {
      let parameter = methodNode.parameters[i];
      let value = node.parameters[i];
      env[parameter.name] = value;
    }
    let parameters = node.parameters.map((parameter) => { return parameter.accept(this); });

    this.pushScope(env);
    let returnValue;
    if (methodNode.nativeFunction) {
      // methodNode.nativeFunction.call(this, parameters);
    } else {
      methodNode.statements.forEach((statement) => {
        returnValue = statement.accept(this);
        if (returnValue instanceof Ast.ReturnNode) {
          return null;
        }
      });
    }
    this.popScope();
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
    switch(node.op) {
      case '++':
      case '--':
        break;
    }
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
        if (!(left instanceof Ast.IntegerNode) && !(left instanceof Ast.DoubleNode)) {
          throw `Must be integer or double`;
        }
        if (!(right instanceof Ast.IntegerNode) && !(right instanceof Ast.DoubleNode)) {
          throw `Must be integer or double`;
        }
        return left;
      case '&':
      case '|':
      case '^':
        left = node.left.accept(this);
        right = node.right.accept(this);
        if (left.name != 'Integer') {
          throw `Must be integer`;
        }
        if (right != 'Integer') {
          throw `Must be integer`;
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
        if (left.name != right.name) {
          throw `Type not matched : left => ${left.name}, right => ${right.name}`
        }
        return left;
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
        let receiver, key;
        console.log(node.left);
        [receiver, key] = node.left.accept(this);
        if (key) {
          left = receiver.instanceFields[key].accept(this);
        } else {
          left = this.getValue(receiver);
        }
        right = node.right.accept(this);
        if (left.name != right.name) {
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
      let name, expression;
      [name, expression] = declarator.accept(this);

      if (expression && !this.checkType(type, expression)) {
        console.log(type);
        console.log(expression);
        throw `Type not matched : variable => ${type.name}, initializer => ${expression.name}`
      }
      let env = this.currentScope();
      env.set(declarator.name, type);
    });
  }

  visitVariableDeclarator(node) {
    let name = node.name;
    let expression = node.expression ? node.expression.accept(this) : null;
    if (this.localIncludes(name)) {
      throw `duplicate variable name ${name}`;
    }
    return [name, expression];
  }

  visitWhen(node) {
  
  }

  visitWhile(node) {
  
  }

  currentScope() {
    return LocalEnvironment.currentScope();
  }

  getValue(key) {
    return LocalEnvironment.get(key);
  }

  localIncludes(key) {
    return LocalEnvironment.includes(key);
  }

  pushScope(env) {
    LocalEnvironment.pushScope(env);
  }

  popScope() {
    LocalEnvironment.popScope();
  }

  checkType(left, right) {
    if (right instanceof Ast.NullNode) return true;
    if (left.name.join('.') != right.name.join('.')) return false;
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
