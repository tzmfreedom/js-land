const Ast = require('./node/ast');

class ReturnChecker {
  visit(node) {
    node.accept(this);
  }

  visitClass(node) {
    Object.keys(node.instanceMethods).forEach((methodName) => {
      node.instanceMethods[methodName].forEach((methodNode) => {
        console.log(methodNode.name);
        console.log(methodNode.returnType);
      });
    });

    Object.keys(node.staticMethods).forEach((methodName) => {
      node.staticMethods[methodName].forEach((methodNode) => {
        console.log(methodNode.name);
        console.log(methodNode.returnType);
      });
    });
  }

  visitMethodDeclaration(node) {}

  visitInteger(node) {}

  visitArrayAccess(node) {}

  visitApexObject(node) {}

  visitBoolean(node) {}

  visitBreak(node) {}

  visitComment(node) {}

  visitContinue(node) {}

  visitDml(node) {}

  visitDouble(node) {}

  visitFor(node) {}

  visitForControl(node) {}

  visitEnhancedForControl(node) {}

  visitIf(node) {}

  visitMethodInvocation(node) {}

  visitFieldAccess(node) {}

  visitName(node) {}

  visitNew(node) {}

  visitNull(node) {}

  visitUnaryOperator(node) {}

  visitBinaryOperator(node) {}

  visitCastExpression(node) {}

  visitReturn(node) {}

  visitSoql(node) {}

  visitString(node) {}

  visitSwitch(node) {}

  visitTrigger(node) {}

  visitTriggerTiming(node) {}

  visitType(node) {}

  visitVariableDeclaration(node) {}

  visitVariableDeclarator(node) {}

  visitWhen(node) {}

  visitWhile(node) {}

  visitBlock(node) {}

  visitSpecialComment(node) {}
}

module.exports = ReturnChecker;
