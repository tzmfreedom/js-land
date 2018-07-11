var Ast = require('./node/ast');
let methodSearcher = require('./methodSearcher');
const EnvManager = require('./envManager');

class ApexInterpreter {
  visit(node) {
    EnvManager.pushScope({});
    node.accept(this);
    EnvManager.popScope();
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
    return node;
  }

  visitFor(node) {
    EnvManager.pushScope({});

    let forControl = node.forControl;
    forControl.forInit.accept(this);

    let condition = forControl.expression.accept(this);
    let returnNode;
    while (condition.value == true) {
      returnNode = node.statements.accept(this);
      if (
        returnNode instanceof Ast.ReturnNode ||
        returnNode instanceof Ast.BreakNode ||
        returnNode instanceof Ast.ContinueNode
      ) {
        break;
      }
      forControl.forUpdate.forEach((statement) => { statement.accept(this) });
      condition = forControl.expression.accept(this)
    }
    EnvManager.popScope();
    return returnNode;
  }

  visitForControl(node) {
    return node;
  }

  visitIf(node) {
    let condition = node.condition.accept(this);
    let returnNode;
    if (condition.value == true) {
      returnNode = node.ifStatement.accept(this);
    } else if (node.elseStatement) {
      returnNode = node.elseStatement.accept(this);
    }
    return returnNode;
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

    EnvManager.pushScope(env);
    let returnNode;
    if (searchResult.methodNode.nativeFunction) {
      returnNode = searchResult.methodNode.nativeFunction.call(this, parameters);
    } else {
      returnNode = searchResult.methodNode.statements.accept(this);
    }
    EnvManager.popScope();
    return returnNode;
  }

  visitName(node) {
    let result = methodSearcher.searchField(node);
    if (result.key) {
      return result.receiverNode.instanceFields[result.key];
    } else {
      return EnvManager.getValue(result.receiverNode);
    }
  }

  visitNew(node) {
    let newObject = new Ast.ApexObjectNode();
    newObject.classNode = node.classType.classNode;
    newObject.instanceFields = {};
    const instanceFields = node.type.classNode.instanceFields;
    Object.keys(instanceFields).forEach((fieldName) => {
      newObject.instanceFields[fieldName] = instanceFields[fieldName].expression.accept(this);
    });

    const parameterHash = methodSearcher.calculateMethodParameterHash(node);
    const constructor = node.type.classNode.constructors[parameterHash];

    let env = { this: newObject };
    for (let i = 0; i < constructor.parameters.length; i++) {
      let parameter = constructor.parameters[i];
      env[parameter.name] = node.parameters[i].accept(this);
    }
    EnvManager.pushScope(env);
    constructor.statements.accept(this);
    EnvManager.popScope();
    return newObject;
  }

  visitNull(node) {
    node.value = null;
    return node;
  }

  visitUnaryOperator(node) {
    let result = methodSearcher.searchField(node.expression);
    let prev, value;
    if (result.key) {
      prev = result.receiverNode.instanceFields[result.key];
      switch(node.type) {
        case '++':
          value = prev.value + 1;
        case '--':
          value = prev.value - 1;
      }
      result.receiverNode.instanceFields[result.key] = new Ast.IntegerNode(value);
    } else {
      prev = EnvManager.getValue(result.receiverNode);
      switch(node.op) {
        case '++':
          value = prev.value + 1;
          break;
        case '--':
          value = prev.value - 1;
          break;
      }
      EnvManager.setValue(result.receiverNode, new Ast.IntegerNode(value));
    }
    if (prev) {
      return new Ast.IntegerNode(value);
    } else {
      return prev;
    }
  }

  visitBinaryOperator(node) {
    let left = node.left.accept(this);
    let right = node.right.accept(this);
    switch(node.op) {
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
      case '^':
        return new Ast.IntegerNode(left.value ^ right.value);
      case '<':
        return new Ast.BooleanNode(left.value < right.value);
      case '>':
        return new Ast.BooleanNode(left.value > right.value);
      case '<=':
        return new Ast.BooleanNode(left.value <= right.value);
      case '>=':
        return new Ast.BooleanNode(left.value >= right.value);
      case '==':
        return new Ast.BooleanNode(left.value == right.value);
      case '===':
        return new Ast.BooleanNode(left.value == right.value);
      case '!=':
        return new Ast.BooleanNode(left.value != right.value);
      case '!==':
        return new Ast.BooleanNode(left.value != right.value);
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
          EnvManager.setValue(result.receiverNode, right);
        }
        return right;
    }
  }

  visitReturn(node) {
    node.value = node.expression.accept(this);
    return node;
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
      let env = EnvManager.currentScope();
      env.define(type, declarator.name, value);
    });
  }

  visitWhen(node) {

  }

  visitWhile(node) {
    EnvManager.pushScope({});
    let condition = node.condition.accept(this);
    let returnNode;
    while (condition.value == true) {
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
      if (
        returnNode instanceof Ast.ReturnNode ||
        returnNode instanceof Ast.BreakNode ||
        returnNode instanceof Ast.ContinueNode
      ) {
        break;
      }

      condition = node.condition.accept(this);
    }
    EnvManager.popScope();
    return returnNode;
  }

  visitBlock(node){
    let returnNode;
    for (let i = 0; i < node.statements.length; i++){
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
}

module.exports = ApexInterpreter;
