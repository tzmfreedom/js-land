var Apex = require('./apexClass');
var ApexVisitor = require('./apexVisitor');
var Ast = require('./node/ast');

class ApexInterpreter {
  visit(node) {
    this.pushScope({});
    node.accept(this);
    this.popScope();
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
  
  }

  visitForenum(node) {
  
  }

  visitIf(node) {
  
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
}

module.exports = ApexInterpreter;
