const Ast = require('./node/ast');
const typeSearch = require('./typeSearch');
const Runtime = require('./runtime');

class TypeBuilder {
  visit(node) {
    node.accept(this);
  }

  visitClass(node) {
    if (node.superClass) node.superClass.accept(this);
    node.implementClasses.forEach((implementClass) => {
      implementClass.accept(this);
    });
    Object.keys(node.staticMethods).forEach((methodName) => {
      let methods = node.staticMethods[methodName];
      Object.keys(methods).forEach((parameterHash) => {
        methods[parameterHash].accept(this);
      });
    });

    Object.keys(node.instanceMethods).forEach((methodName) => {
      let methods = node.instanceMethods[methodName];
      Object.keys(methods).forEach((parameterHash) => {
        methods[parameterHash].accept(this);
      });
    });

    Object.keys(node.staticFields).forEach((fieldName) => {
      const staticField = node.staticFields[fieldName];
      staticField.type.accept(this);
      if (staticField.declarators) {
        staticField.declarators.forEach((declarator) => {
          declarator.accept(this);
        });
      }
    });

    Object.keys(node.instanceFields).forEach((fieldName) => {
      const instanceField = node.instanceFields[fieldName];
      instanceField.type.accept(this);
      if (instanceField.declarators) {
        instanceField.declarators.forEach((declarator) => {
          declarator.accept(this);
        });
      }
    });

    if (node.innerClasses) {
      const innerClasses = node.innerClasses
      Object.keys(innerClasses).forEach((className) => {
        innerClasses[className].accept(this);
      });
    }
  }

  visitMethodDeclaration(node) {
    node.parameters.forEach((parameter) => {
      parameter.type.accept(this);
    });

    if (node.returnType == 'void'){
      node.returnType = Runtime.NullType;
    } else {
      node.returnType.accept(this);
    }
    if (node.statements) {
      node.statements.accept(this);
    }
  }

  visitInteger(node) {}

  visitArrayAccess(node) {}

  visitApexObject(node) {}

  visitBoolean(node) {}

  visitBreak(node) {}

  visitComment(node) {}

  visitContinue(node) {}

  visitDml(node) {}

  visitDouble(node) {}

  visitFor(node) {
    node.forControl.accept(this);
    node.statements.accept(this);
  }

  visitForControl(node) {
    node.forInit.accept(this);
    node.forUpdate.forEach((statement) => { statement.accept(this) });
    node.expression.accept(this);
  }

  visitEnhancedForControl(node) {
    node.type.accept(this);
  }

  visitIf(node) {
    node.condition.accept(this);
    node.ifStatement.accept(this);
    if (node.elseStatement) node.elseStatement.accept(this);
  }

  visitMethodInvocation(node) {
    node.nameOrExpression.accept(this);
    node.parameters.forEach((parameter) => {
      parameter.accept(this);
    });
  }

  visitFieldAccess(node) {
    node.expression.accept(this);
  }

  visitName(node) {}

  visitNew(node) {
    node.classType.accept(this);
  }

  visitNull(node) {}

  visitUnaryOperator(node) {}

  visitBinaryOperator(node) {}

  visitCastExpression(node) {
    node.castType.accept(this);
  }

  visitReturn(node) {
    node.expression.accept(this);
  }

  visitSoql(node) {}

  visitString(node) {}

  visitSwitch(node) {}

  visitTrigger(node) {}

  visitTriggerTiming(node) {}

  visitType(node) {
    node.classNode = typeSearch(node);
  }

  visitVariableDeclaration(node) {
    node.type.accept(this);
    if (node.declarators) {
      node.declarators.forEach((declarator) => {
        declarator.accept(this);
      });
    }
  }

  visitVariableDeclarator(node) {
    node.expression.accept(this);
  }

  visitWhen(node) {
  
  }

  visitWhile(node) {
    node.condition.accept(this);
    for (let i = 0; i < node.statements.length; i++) {
      node.statements[i].accept(this);
    }
  }

  visitBlock(node) {
    for (let i = 0; i < node.statements.length; i++) {
      node.statements[i].accept(this);
    }
  }

  visitSpecialComment(node) {}
}

module.exports = TypeBuilder;
