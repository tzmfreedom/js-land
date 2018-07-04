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
      let field_name = field.name;
      if (field_name in instanceFields) {
        // TODO: lineno
        throw `Compile Error: duplicate instance field name ${field_name} at line : `
      }
      instanceFields[field_name] = field.accept(this);
    });

    const classInfo = new ApexClass(
      node.name,
      instanceMethods,
      staticMethods,
      instanceFields,
      staticFields,
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
    this.validateStatement(node);
    return node;
  }

  visitFieldDeclaration(node) {

  }

  visitAnnotation(node) {
    return node;
  }

  visitInterger(node) {
    return node;
  }

  visitArgument(node) {
    return node;
  }

  visitArrayAccess(node) {
  
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
      methodNode.nativeFunction.call(this, parameters);
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
    return node;
  }

  visitNew(node) {

  }

  visitNull(node) {
    return node;
  }

  visitObject(node) {
    return node;
  }

  visitUnaryOperator(node) {
    switch(node.op) {
      case '++':
      case '--':
        break;
    }
  }

  visitBinaryOperator(node) {
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
        let left = node.left.accept(this);
        let right = node.right.accept(this);
        if (!(left instanceof Ast.IntegerNode) && !(left instanceof Ast.DoubleNode)) {
          throw `Must be integer or double`;
        }
        if (!(right instanceof Ast.IntegerNode) && !(right instanceof Ast.DoubleNode)) {
          throw `Must be integer or double`;
        }
        return new Ast.IntegerNode();
      case '&':
      case '|':
      case '^':
        let left = node.left.accept(this);
        let right = node.right.accept(this);
        if (!(left instanceof Ast.IntegerNode)) {
          throw `Must be integer`;
        }
        if (!(right instanceof Ast.IntegerNode)) {
          throw `Must be integer`;
        }
        return new Ast.IntegerNode();
      case '<':
      case '>':
      case '<=':
      case '>=':
      case '==':
      case '===':
      case '!=':
      case '!==':
        let left = node.left.accept(this);
        let right = node.right.accept(this);
        return new Ast.BooleanNode();
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
        let left = node.left.accept(this);
        let right = node.right.accept(this);
        return node;
      case '&=':
      case '|=':
      case '^=':
        let left = node.left.accept(this);
        let right = node.right.accept(this);
        break;
    }
  }

  visitReturn(node) {
    return node
  }

  visitSoql(node) {
    return node;
  }

  visitString(node) {
    return node;
  }

  visitSwitch(node) {
  
  }

  visitTrigger(node) {
  
  }

  visitTriggerTiming(node) {
  
  }

  visitVariableDeclaration(node) {
  
  }

  visitVariableDeclarator(node) {
  
  }

  visitWhen(node) {
  
  }

  visitWhile(node) {
  
  }

  pushScope(env) {
    LocalEnvironment.pushScope(env);
  }

  popScope() {
    LocalEnvironment.popScope();
  }
}

module.exports = ApexBuilder;
