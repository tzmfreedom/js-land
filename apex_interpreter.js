var Ast = require('./node/ast');
let methodSearcher = require('./methodSearcher');
let LocalEnvironment = require('./localEnv');
let ApexObject = require('./apexClass').ApexObject;
let ApexClassStore = require('./apexClass').ApexClassStore;

class ApexInterpreter {
  visit(node) {
    this.pushScope({});
    node.accept(this);
    this.popScope();
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

  visitFieldDeclaration(node) {
  
  }

  visitFieldDeclarator(node) {
  
  }

  visitFor(node) {
    this.pushScope({});
    let condition = node.forControl.accept(this);
    while (condition.value = true) {
      node.statements.accept(this);
      condition = node.forControl.accept(this);
    }
    this.popScope();
  }

  visitIf(node) {
    let condition = node.condition.accept(this);
    if (condition.value = true) {
      node.ifStatement.accept(this);
    } else {
      node.elseStatement.accept(this);
    }
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
    let classInfo = ApexClassStore.get(node.className);
    let newObject = new ApexObject();

    let env = { this: newObject };
    for (let i = 0; i < classInfo.parameters.length; i++) {
      let parameter = classInfo.parameters[i];
      env[parameter.name] = node.parameters[i].accept(this);
    }
    this.pushScope(env);
    classInfo.constructor.accept(this);
    this.popScope();
  }

  visitNull(node) {
    node.value = null;
    return node;
  }

  visitObject(node) {
    return node;
  }

  visitBinaryOperator(node) {
    let left, right;
    switch(node.type) {
      case '+':
        return new Ast.IntegerNode(node.left.accept(this) + node.right.accept(this));
      case '-':
        return new Ast.IntegerNode(node.left.accept(this) - node.right.accept(this));
      case '*':
        return new Ast.IntegerNode(node.left.accept(this) * node.right.accept(this));
      case '/':
        return new Ast.IntegerNode(node.left.accept(this) / node.right.accept(this));
      case '%':
        return new Ast.IntegerNode(node.left.accept(this) % node.right.accept(this));
      case '<<<':
        return new Ast.IntegerNode(node.left.accept(this) << node.right.accept(this));
      case '<<':
        return new Ast.IntegerNode(node.left.accept(this) << node.right.accept(this));
      case '>>>':
        return new Ast.IntegerNode(node.left.accept(this) >> node.right.accept(this));
      case '>>':
        return new Ast.IntegerNode(node.left.accept(this) >> node.right.accept(this));
      case '&':
        return new Ast.IntegerNode(node.left.accept(this) & node.right.accept(this));
      case '|':
        return new Ast.IntegerNode(node.left.accept(this) | node.right.accept(this));
      case '^':
        return new Ast.IntegerNode(node.left.accept(this) ^ node.right.accept(this));
      case '<':
        return new Ast.BooleanNode(node.left.accept(this) < node.right.accept(this));
      case '>':
        return new Ast.BooleanNode(node.left.accept(this) > node.right.accept(this));
      case '<=':
        return new Ast.BooleanNode(node.left.accept(this) <= node.right.accept(this));
      case '>=':
        return new Ast.BooleanNode(node.left.accept(this) >= node.right.accept(this));
      case '==':
        return new Ast.BooleanNode(node.left.accept(this) == node.right.accept(this));
      case '===':
        return new Ast.BooleanNode(node.left.accept(this) == node.right.accept(this));
      case '!=':
        return new Ast.BooleanNode(node.left.accept(this) != node.right.accept(this));
      case '!==':
        return new Ast.BooleanNode(node.left.accept(this) != node.right.accept(this));
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
      case '&=':
      case '|=':
      case '^=':
        let receiver, key;
        [receiver, key] = node.left.accept(this);
        right = node.right.accept(this);
        if (key) {
          receiver.instanceFields[key] = right;
        } else {
          this.setValue(receiver.value.join('.'), right);
        }
        return right;
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
    let condition = node.condition.accept(this);
    while (condition.value == true) {
      node.statement.accept(this);
      condition = node.condition.accept(this);
    }
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

  setValue(key) {
    LocalEnvironment.set(key);
  }
}

module.exports = ApexInterpreter;
