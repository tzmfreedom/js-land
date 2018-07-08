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

  visitFieldAccess(node) {
    console.log(node);
    return node;
  }

  visitFor(node) {
    this.pushScope({});

    let forControl = node.forControl;
    forControl.forInit.accept(this);

    let condition = forControl.expression.accept(this);
    while (condition.value = true) {
      node.statements.forEach((statement) => {
        statement.accept(this);
      });
      forControl.forUpdate.accept(this);
      condition = forControl.expression.accept(this);
    }
    this.popScope();
  }

  visitForControl(node) {
    return node;
  }

  visitIf(node) {
    let condition = node.condition.accept(this);
    if (condition.value == true) {
      node.ifStatement.accept(this);
    } else if (node.elseStatement) {
      node.elseStatement.accept(this);
    }
  }

  visitMethodInvocation(node) {
    let searchResult = methodSearcher.searchMethod(node);
    searchResult.methodNode = searchResult.methodNode[Object.keys(searchResult.methodNode)[0]];

    let env = { this: searchResult.receiverNode };
    for (let i = 0; i < searchResult.methodNode.parameters.length; i++) {
      let parameter = searchResult.methodNode.parameters[i];
      env[parameter.name] = node.parameters[i].accept(this);
    }
    let parameters = node.parameters.map((parameter) => { return parameter.accept(this); });

    this.pushScope(env);
    if (searchResult.methodNode.nativeFunction) {
      searchResult.methodNode.nativeFunction.call(this, parameters);
    } else {
      searchResult.methodNode.statements.accept(this);
    }
    this.popScope();
  }

  visitName(node) {
    let result = methodSearcher.searchField(node);
    if (result.key) {
      return result.receiverNode.instanceFields[result.key];
    } else {
      return this.getValue(result.receiverNode);
    }
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

  visitUnaryOperator(node) {
    switch(node.op) {
      case '++':
      case '--':
        break;
    }
  }

  visitBinaryOperator(node) {
    let left = node.left.accept(this);
    let right = node.right.accept(this);
    switch(node.type) {
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
        return new Ast.IntegerNode(node.left.accept(this) | node.right.accept(this));
      case '^':
        return new Ast.IntegerNode(left.value ^ right.value);
        return new Ast.IntegerNode(node.left.accept(this) ^ node.right.accept(this));
      case '<':
        return new Ast.IntegerNode(left.value < right.value);
        return new Ast.BooleanNode(node.left.accept(this) < node.right.accept(this));
      case '>':
        return new Ast.IntegerNode(left.value > right.value);
        return new Ast.BooleanNode(node.left.accept(this) > node.right.accept(this));
      case '<=':
        return new Ast.IntegerNode(left.value <= right.value);
        return new Ast.BooleanNode(node.left.accept(this) <= node.right.accept(this));
      case '>=':
        return new Ast.IntegerNode(left.value >= right.value);
        return new Ast.BooleanNode(node.left.accept(this) >= node.right.accept(this));
      case '==':
        return new Ast.IntegerNode(left.value == right.value);
        return new Ast.BooleanNode(node.left.accept(this) == node.right.accept(this));
      case '===':
        return new Ast.IntegerNode(left.value == right.value);
        return new Ast.BooleanNode(node.left.accept(this) == node.right.accept(this));
      case '!=':
        return new Ast.IntegerNode(left.value != right.value);
        return new Ast.BooleanNode(node.left.accept(this) != node.right.accept(this));
      case '!==':
        return new Ast.IntegerNode(left.value != right.value);
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
      case '&=':
      case '|=':
      case '^=':
        let result = methodSearcher.searchField(node.left);
        right = node.right.accept(this);
        if (result.key) {
          result.receiverNode.instanceFields[result.key] = right;
        } else {
          this.setValue(result.receiverNode, right);
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
    let type = node.type;
    node.declarators.forEach((declarator) => {
      let value = declarator.expression.accept(this);
      let env = this.currentScope();
      env.define(type, declarator.name, value);
    });
  }

  visitWhen(node) {

  }

  visitWhile(node) {
    let condition = node.condition.accept(this);
    while (condition.value == true) {
      node.statements.forEach((statement) => {
        statement.accept(this);
      });
      condition = node.condition.accept(this);
    }
  }

  visitBlock(node){
    node.statements.forEach((statement) => { statement.accept(this); });
  }

  currentScope() {
    return LocalEnvironment.currentScope();
  }

  pushScope(env) {
    LocalEnvironment.pushScope(env);
  }

  popScope() {
    LocalEnvironment.popScope();
  }

  getValue(key) {
    return LocalEnvironment.get(key).value;
  }

  setValue(key, value) {
    LocalEnvironment.set(key, value);
  }
}

module.exports = ApexInterpreter;
