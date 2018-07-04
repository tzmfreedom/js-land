let Ast = require('./node/ast');
let ApexClassStore = require('./apexClass').ApexClassStore;
let NameSpaceStore = require('./apexClass').NameSpaceStore;
let ApexClass = require('./apexClass').ApexClass;

class ApexBuilder {
  visit(node) {
    node.accept(this);
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
      if (name in staticMethods) {
        // TODO: check argument
        // TODO: lineno
        throw `Compile Error: duplicate method name ${name} at line : `
      }
      staticMethods[name] = method.accept(this);
    });

    let instanceMethods = {};
    node.instanceMethods.forEach((method) => {
      if (name in instanceMethods) {
        // TODO: check argument
        // TODO: lineno
        throw `Compile Error: duplicate method name ${name} at line : `
      }
      instanceMethods[name] = method.accept(this);
    });

    let staticFields = {};
    node.staticFields.forEach((field) => {
      if (name in staticFields) {
        // TODO: lineno
        throw `Compile Error: duplicate static field name ${name} at line : `
      }
      staticFields[name] = field.accept(this);
    });

    let instanceFields = {};
    node.instanceFields.forEach((field) => {
      if (name in instanceFields) {
        // TODO: lineno
        throw `Compile Error: duplicate instance field name ${name} at line : `
      }
      instanceFields[name] = field.accept(this);
    });

    const classInfo = new ApexClass(
      node.name,
      instanceMethods,
      staticMethods,
      instanceFields,
      staticFields,
    );
    ApexClassStore.register(node.name, classInfo);
  }

  visitMethodDeclaration(node) {
    this.validateModifierDuplication(node);
    // returnType Check
    let returnType = ApexClassStore.get(node.returnType);
    if (!returnType) {
      // TODO: lineno
      throw `Invalid return type ${node.returnType} at line`;
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
    [receiver, methodNode] = this.searchMethod(node);
    let env = {
      this: receiver,
    };
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

  getValue(key) {
    return LocalEnvironment.get(key);
  }

  searchMethod(node) {
    let methodName = node.methodName;

    if (!(node.receiver instanceof Ast.NameNode)) {
      let receiverNode = node.receiver.accept(this);
      let classNode = receiverNode.class;
      let methodNode = classNode.searchInstanceMethod(methodName);
      return [receiverNode, methodNode];
    }

    let names = node.receiver.value;
    let name = names[0];

    if (this.getValue(name)) {
      let variable = this.getValue(name);
      let receiverNode = names.slice(1).reduce((receiver, name) => {
        if (!receiver) {
          return;
        }
        return receiver.instanceFields[name];
      }, variable);
      let methodNode = receiverNode.class.searchInstanceMethod(methodName);
      if (receiverNode && methodNode) {
        return [receiverNode, methodNode];
      }
    }

    if (this.getValue('this')) {
      let variable = this.getValue('this');
      let receiverNode = names.reduce((receiver, name) => {
        if (!receiver) {
          return;
        }
        return receiver.instanceFields[name];
      }, variable);
      let methodNode = receiverNode.class.searchInstanceMethod(methodName);
      if (receiverNode && methodNode) {
        return [receiverNode, methodNode];
      }
    }

    if (names.length == 1) {
      let classInfo = ApexClassStore.get(name);
      if (classInfo) {
        let methodNode = classInfo.searchStaticMethod(methodName);
        if (classInfo && methodNode) {
          return [classInfo, methodNode];
        }
      }
    }

    if (names.length >= 2) {
      let classInfo = ApexClassStore.get(name);
      if (classInfo) {
        let staticFieldName = names[1];
        let staticField = classInfo.staticFields[staticFieldName];
        let receiverNode = names.reduce((receiver, name) => {
          if (!receiver) {
            return;
          }
          return receiver.instanceFields[name];
        }, staticField);
        let methodNode = receiverNode.searchInstanceMethod(methodName);
        if (receiverNode && methodNode) {
          return [receiverNode, methodNode];
        }
      }
    }

    if (names.length >= 2) {
      let nameSpace = NameSpaceStore.get(name);
      let className = names[1];
      let staticFieldName = names[2];
      let classNode = nameSpace.classes[className];
      if (classNode) {
        let staticField = classNode.searchStaticField(staticFieldName);
        let receiverNode = names.reduce((receiver, name) => {
          if (!receiver) {
            return;
          }
          return receiver.instanceFields[name];
        }, staticField);
        let methodNode = receiverNode.searchInstanceMethod(methodName);
        if (receiverNode && methodNode) {
          return [receiverNode, methodNode];
        }
      }
    }
  }

  searchField(key) {

  }
}

module.exports = ApexBuilder;
