let Ast = require('./node/ast');
let LocalEnvironment = require('./localEnv');
let ApexClassStore = require('./apexClass').ApexClassStore;
let NameSpaceStore = require('./apexClass').NameSpaceStore;

class ApexInterpreter {
  visit(node) {
    this.pushScope({});
    node.accept(this);
    this.popScope();
  }

  visitAnnotation(node) {
  
  }

  visitInterger(node) {
    return node;
  }

  visitArgument(node) {
  
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
  
  }

  visitForenum(node) {
  
  }

  visitIf(node) {
  
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

  visitBinaryOperator(node) {
  
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
        let classNode = classInfo._top;
        let methodNode = classNode.searchStaticMethod(methodName);
        if (classNode && methodNode) {
          return [classNode, methodNode];
        }
      }
    }

    if (names.length >= 2) {
      let classInfo = ApexClassStore.get(name);
      if (classInfo) {
        let classNode = classInfo._top;
        let staticFieldName = names[1];
        let staticField = classNode.staticFields[staticFieldName];
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

module.exports = ApexInterpreter;
