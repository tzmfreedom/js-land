const resolveType = require('../util/resolve-type')
const Runtime = require('../runtime/runtime')
const EnvManager = require('../env-manager')

class TypeBuilder {
  visit (node) {
    EnvManager.pushScope({})
    node.accept(this)
    EnvManager.popScope()
  }

  visitClass (node) {
    if (!(EnvManager.localIncludes('_class'))) {
      EnvManager.pushScope({
        _class: {
          type: null,
          value: node
        }
      })
    }

    if (node.superClass) node.superClass.accept(this)
    node.implementClasses.forEach((implementClass) => {
      implementClass.accept(this)
    })
    node.staticMethods.keys().forEach((methodName) => {
      const methods = node.staticMethods.get(methodName)
      methods.forEach((method) => {
        method.accept(this)
      })
    })

    node.instanceMethods.keys().forEach((methodName) => {
      const methods = node.instanceMethods.get(methodName)
      methods.forEach((method) => {
        method.accept(this)
      })
    })

    node.staticFields.keys().forEach((fieldName) => {
      const staticField = node.staticFields.get(fieldName)
      staticField.type.accept(this)
      staticField.expression.accept(this)
    })

    node.instanceFields.keys().forEach((fieldName) => {
      const instanceField = node.instanceFields.get(fieldName)
      instanceField.type.accept(this)
      instanceField.expression.accept(this)
    })

    if (node.innerClasses) {
      const innerClasses = node.innerClasses
      innerClasses.keys().forEach((className) => {
        const innerClass = innerClasses.get(className)
        innerClass.accept(this)
      })
    }
    if (!(EnvManager.localIncludes('_class'))) {
      EnvManager.popScope()
    }
  }

  visitMethodDeclaration (node) {
    node.parameters.forEach((parameter) => {
      parameter.type().accept(this)
    })

    if (node.returnType == 'void') {
      node.returnType = Runtime.NullType
    } else {
      node.returnType.accept(this)
    }
    if (node.statements) {
      node.statements.accept(this)
    }
  }

  visitInteger (node) {}

  visitArrayAccess (node) {}

  visitApexObject (node) {}

  visitBoolean (node) {}

  visitBreak (node) {}

  visitComment (node) {}

  visitContinue (node) {}

  visitDml (node) {
    node.expression.accept(this)
  }

  visitDouble (node) {}

  visitFor (node) {
    node.forControl.accept(this)
    node.statements.accept(this)
  }

  visitForControl (node) {
    if (node.forInit) {
      node.forInit.accept(this)
    }

    if (node.forUpdate) {
      node.forUpdate.forEach((statement) => { statement.accept(this) })
    }

    if (node.expression) {
      node.expression.accept(this)
    }
  }

  visitEnhancedForControl (node) {
    node.type.accept(this)
    node.expression.accept(this)
  }

  visitIf (node) {
    node.condition.accept(this)
    node.ifStatement.accept(this)
    if (node.elseStatement) node.elseStatement.accept(this)
  }

  visitMethodInvocation (node) {
    node.nameOrExpression.accept(this)
    node.parameters.forEach((parameter) => {
      parameter.accept(this)
    })
  }

  visitFieldAccess (node) {
    node.expression.accept(this)
  }

  visitName (node) {}

  visitNew (node) {
    node.classType.accept(this)
  }

  visitNull (node) {}

  visitUnaryOperator (node) {}

  visitBinaryOperator (node) {
    node.right.accept(this)
  }

  visitCastExpression (node) {
    node.castType.accept(this)
  }

  visitReturn (node) {
    node.expression.accept(this)
  }

  visitTernalyExpression (node) {
    node.condition.accept(this)
    node.trueExpression.accept(this)
    node.falseExpression.accept(this)
  }

  visitSoql (node) {}

  visitSosl (node) {}

  visitString (node) {}

  visitSwitch (node) {}

  visitTrigger (node) {}

  visitTriggerTiming (node) {}

  visitType (node) {
    node.classNode = resolveType(node)
    if (node.parameters) {
      node.parameters.forEach((parameter) => {
        parameter.accept(this)
      })
    }
  }

  visitVariableDeclaration (node) {
    node.type.accept(this)
    if (node.declarators) {
      node.declarators.forEach((declarator) => {
        declarator.accept(this)
      })
    }
  }

  visitVariableDeclarator (node) {
    node.expression.accept(this)
  }

  visitWhen (node) {

  }

  visitWhile (node) {
    node.condition.accept(this)
    for (let i = 0; i < node.statements.length; i++) {
      node.statements[i].accept(this)
    }
  }

  visitBlock (node) {
    for (let i = 0; i < node.statements.length; i++) {
      node.statements[i].accept(this)
    }
  }

  visitThrow (node) {
    node.expression.accept(this)
  }

  visitTry (node) {
    node.block.accept(this)
    if (node.finallyBlock) {
      node.finallyBlock.accept(this)
    }
    node.catchClause.forEach((catchClause) => {
      catchClause.accept(this)
    })
  }

  visitCatch (node) {
    node.type.forEach((type) => {
      type.accept(this)
    })
    node.block.accept(this)
  }

  visitSpecialComment (node) {}

  visitNothingStatement (node) {}

  visitInterface (node) {
    if (node.superClass) node.superClass.accept(this)
    node.staticMethods.keys().forEach((methodName) => {
      const methods = node.staticMethods.get(methodName)
      methods.forEach((method) => {
        method.accept(this)
      })
    })

    node.instanceMethods.keys().forEach((methodName) => {
      const methods = node.instanceMethods.get(methodName)
      methods.forEach((method) => {
        method.accept(this)
      })
    })
  }
}

module.exports = TypeBuilder
