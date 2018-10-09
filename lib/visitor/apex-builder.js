const Ast = require('../node/ast')
const ApexClassStore = require('../store/apex-class-store')
const methodResolver = require('../build/method-resolver')
const variableResolver = require('../build/variable-resolver')
const EnvManager = require('../env-manager')
const Runtime = require('../runtime')
const Variable = require('../node/variable')
const ApexClass = require('../node/apex-class')
const CaseIgnoredStore = require('../store/case-ignored-store')
const argumentChecker = require('../argument-checker')

class ApexBuilder {
  visit (node) {
    EnvManager.pushScope({})
    node.accept(this)
    EnvManager.popScope()
  }

  validateModifierDuplication (node) {
    const modifiers = []
    if (node.modifiers) {
      node.modifiers.map((modifier) => {
        if (modifiers.includes(modifier.name)) {
          throw `Compile Error: duplicate modifier ${name} at line ${node.lineno}`
        }
        modifiers.push(modifier.name)
      })
    }
  }

  validateParameter (node) {
    const parameters = []
    node.parameters.map((parameter) => {
      if (parameters.includes(parameter.name)) {
        throw `Compile Error: duplicate modifier ${name} at line ${node.lineno}`
      }
      parameters.push(parameter.name)
    })
  }

  visitClass (node) {
    this.validateModifierDuplication(node)

    const staticMethods = node.staticMethods

    staticMethods.keys().forEach((methodName) => {
      const methods = staticMethods.get(methodName)
      methods.forEach((methodNode) => {
        const env = {
          _class: {
            type: null,
            value: node
          }
        }
        methodNode.parameters.forEach((parameter) => {
          env[parameter.name] = { type: parameter.type() }
        })
        EnvManager.pushScope(env, null)
        this.currentMethodNode = methodNode
        methodNode.accept(this)
        EnvManager.popScope()
      })
    })

    const newObject = this.createObject(node)
    const instanceMethods = node.instanceMethods
    node.instanceMethods.keys().forEach((methodName) => {
      const methods = instanceMethods.get(methodName)
      methods.forEach((methodNode) => {
        if (methodNode.isAbstract() && methodNode.statements) {
          this.throwError(node, methodNode, 'Abstract methods cannot have a body')
        }
        if (methodNode.isVirtual() && methodNode.statements == null) {
          this.throwError(node, methodNode, 'Method must have a body')
        }
        if (methodNode.isOverride()) {
          if (!node.superClass) {
            this.throwError(node, methodNode, '')
          }
          const superClassMethods = node.superClass.classNode.instanceMethods
          if (superClassMethods.includes(methodName)) {
            const superClassMethod = argumentChecker(node.superClass.classNode, superClassMethods.get(methodName), methodNode.parameters)
            if (!superClassMethod.isAbstract() && !superClassMethod.isVirtual()) {
              this.throwError(node, methodNode, `Non-virtual, non-abstract methods cannot be overridden`)
            }
          }
        }
        const env = {
          this: {
            type: newObject.type(),
            value: newObject
          }
        }
        methodNode.parameters.forEach((parameter) => {
          env[parameter.name] = { type: parameter.type() }
        })
        EnvManager.pushScope(env, null)
        this.currentMethodNode = methodNode
        methodNode.accept(this)
        EnvManager.popScope()
      })
    })

    node.staticFields.keys().forEach((fieldName) => {
      const staticField = node.staticFields.get(fieldName)
      const env = {
        _class: {
          type: null,
          value: node
        }
      }
      EnvManager.pushScope(env, null)
      const expressionType = staticField.expression.type().classNode
      EnvManager.popScope()
      if (expressionType && staticField.type.classNode != expressionType) {
        throw `Invalid type ${expressionType.name} at line ${node.lineno}`
      }
    })

    node.instanceFields.keys().forEach((fieldName) => {
      const instanceField = node.instanceFields.get(fieldName)
      const env = {
        this: {
          type: newObject.type(),
          value: newObject
        }
      }
      EnvManager.pushScope(env, null)
      const expressionType = instanceField.expression.type().classNode
      if (expressionType && instanceField.type.classNode != expressionType) {
        throw `Invalid type ${expressionType.name} at line ${node.lineno}`
      }
      EnvManager.popScope()
    })

    node.implementClasses.forEach((interfaceClass) => {
      const methods = interfaceClass.classNode.instanceMethods
      methods.keys().forEach((methodName) => {
        methods.get(methodName).forEach((method) => {
          if (!node.instanceMethods.includes(methodName)) {
            this.throwError(node, method, `Class ${node.name} must implement the method`)
          }
          const methodNodes = node.instanceMethods.get(methodName)
          const methodNode = argumentChecker(node, methodNodes, method.parameters)
          if (!methodNode) {
            this.throwError(node, method, `Class ${node.name} must implement the method`)
          }
          if (!methodNode.isPublic()) {
            this.throwError(node, method, `Overriding implementations of global or public interface methods must be global or public`)
          }
        })
      })
    })

    if (node.superClass) {
      const isAbstract = node.superClass.classNode.modifiers.some((modifier) => {
        return modifier.name === 'abstract'
      })
      if (isAbstract) {
        const instanceMethods = node.superClass.classNode.instanceMethods
        instanceMethods.keys().forEach((methodName) => {
          instanceMethods.get(methodName).forEach((method) => {
            if (method.isAbstract()) {
              if (!node.instanceMethods.includes(methodName)) {
                this.throwError(node, method, `Class ${node.name} must implement the method`)
              }
              const subClassMethodNodes = node.instanceMethods.get(methodName)
              const subClassMethodNode = argumentChecker(node, subClassMethodNodes, method.parameters)
              if (!subClassMethodNode) {
                this.throwError(node, method, `Class ${node.name} must implement the method`)
              }
              if (method.isPublic() && (subClassMethodNode.isPrivate() || subClassMethodNode.isProtected())) {
                this.throwError(node, method, `Cannot reduce the visibility of method`)
              }
              if (method.isProtected() && subClassMethodNode.isPrivate()) {
                this.throwError(node, method, `Cannot reduce the visibility of method`)
              }
              if (!subClassMethodNode.isOverride()) {
                this.throwError(node, method, `Method must use the override keyword`)
              }
            }
          })
        })
      }
    }
  }

  visitMethodDeclaration (node) {
    this.validateModifierDuplication(node)
    this.validateParameter(node)

    if (node.statements) {
      const returnNode = node.statements.accept(this)
      if (this.currentMethodNode.returnType.classNode !== null && !this.isReturn(returnNode)) {
        throw `Missing return statement required return type: ${this.currentMethodNode.returnType.name.join('.')} at line ${node.lineno}`
      }
    }
  }

  createObject (classNode) {
    const typeNode = new Ast.TypeNode([classNode.name], [])
    typeNode.classNode = ApexClassStore.get(classNode.name)
    const env = {
      this: {
        type: typeNode,
        value: new Ast.ApexObjectNode(typeNode, {})
      }
    }
    const instanceFields = new CaseIgnoredStore()
    EnvManager.pushScope(env, null)
    classNode.instanceFields.keys().forEach((fieldName) => {
      const field = classNode.instanceFields.get(fieldName)
      if (field.expression) {
        instanceFields.set(fieldName, new Variable(
          field.type,
          field.expression.accept(this)
        ))
      } else {
        instanceFields.set(fieldName, new Variable(
          field.type,
          new Ast.NullNode(),
          field.setter,
          field.getter
        ))
      }
    })
    return new Ast.ApexObjectNode(typeNode, instanceFields)
  }

  visitFieldDeclaration (node) {

  }

  visitArrayAccess (node) {
    return node.receiver.accept(this)
  }

  visitBreak (node) {
    return node
  }

  visitComment (node) {

  }

  visitContinue (node) {

  }

  visitDml (node) {

  }

  visitFor (node) {
    EnvManager.pushScope({})

    node.forControl.accept(this)
    node.statements.accept(this)

    EnvManager.popScope()
    return node
  }

  visitForControl (node) {
    node.forInit.accept(this)
    node.forUpdate.forEach((statement) => { statement.accept(this) })

    const condition = node.expression.type()
    if (condition.classNode != Runtime.Boolean) {
      throw `Should be boolean expression at line ${condition.lineno}`
    }
  }

  visitEnhancedForControl (node) {
    const env = EnvManager.currentScope()
    env.define(node.type, node.variableDeclaratorId, new Ast.NullNode())
    node.expression.accept(this)
  }

  visitIf (node) {
    const condition = node.condition.type()
    if (condition.classNode != Runtime.Boolean) {
      throw `Should be boolean expression at line ${node.condition.lineno}`
    }
    EnvManager.pushScope({})
    const ifReturnNode = node.ifStatement.accept(this)
    EnvManager.popScope()
    if (node.elseStatement) {
      EnvManager.pushScope({})
      const elseReturnNode = node.elseStatement.accept(this)
      EnvManager.popScope()
      if (this.isReturn(ifReturnNode) && this.isReturn(elseReturnNode)) {
        return ifReturnNode
      }
    }
  }

  visitMethodInvocation (node) {
    const searchResult = methodResolver.resolve(node)
    if (!searchResult) {
      throw `Method missing ${node.nameOrExpression.value.join('.')} at line ${node.lineno}`
    }
    const env = {}
    if (!(searchResult.receiverNode instanceof ApexClass)) {
      env.this = {
        type: searchResult.receiverNode,
        value: searchResult.receiverNode
      }
    }
    for (let i = 0; i < searchResult.methodNode.parameters.length; i++) {
      const parameter = searchResult.methodNode.parameters[i]
      const value = node.parameters[i]
      env[parameter.name] = { type: parameter.type() }
    }
    node.parameters.forEach((parameter) => {
      parameter.accept(this)
    })
  }

  visitName (node) {
    const resolveResult = variableResolver.resolve(node)
    if (!resolveResult) {
      throw `Variable not declaration : ${node.value.join('.')} at line ${node.lineno}`
    }

    if (resolveResult.receiverNode instanceof ApexClass) {
      const field = resolveResult.receiverNode.staticFields.get(resolveResult.key)
      if (!(field.isPublic())) {
        throw `Field is not visible : ${resolveResult.key} at line ${node.lineno}`
      }
      return field.type
    } else {
      if (resolveResult.key) {
        if (node.value.length !== 2 || node.value[0] !== 'this') {
          const field = resolveResult.receiverNode.classNode.instanceFields.get(resolveResult.key)
          if (!(field.isPublic())) {
            throw `Field is not visible : ${resolveResult.key} at line ${node.lineno}`
          }
          if (field.getter && !(field.getter.isPublic())) {
            throw `Field is not visible : ${resolveResult.key} at line ${node.lineno}`
          }
          return field.type
        }
      } else {
        return EnvManager.get(resolveResult.receiverNode).type()
      }
    }
  }

  visitFieldAccess (node) {}

  visitNew (node) {
    const classNode = node.classType.classNode
    if (classNode.isAbstract()) {
      throw `Abstract classes cannot be constructed: ${node.classType.classNode.name}`
    }
    const instanceFields = new CaseIgnoredStore()
    classNode.instanceFields.keys().map((fieldName) => {
      const field = classNode.instanceFields.get(fieldName)
      if (field.expression) {
        instanceFields.set(fieldName, new Variable(
          field.type,
          field.expression.accept(this)
        ))
      } else {
        instanceFields.set(fieldName, new Variable(
          field.type,
          new Ast.NullNode(),
          field.setter,
          field.getter
        ))
      }
    })
    return new Ast.ApexObjectNode(classNode, instanceFields)
  }

  visitNull (node) {
    return node
  }

  visitUnaryOperator (node) {}

  visitBinaryOperator (node) {
    const leftType = node.left.type()
    const rightType = node.right.type()

    switch (node.op) {
      case '+':
        if (![Runtime.String, Runtime.Integer, Runtime.Double].includes(leftType.classNode)) {
          throw `Must be String or integer or double, but ${leftType.name} at line ${node.lineno}`
        }
        if (![Runtime.String, Runtime.Integer, Runtime.Double].includes(rightType.classNode)) {
          throw `Must be String or integer or double, but ${rightType.name} at line ${node.lineno}`
        }
        break
      case '-':
      case '*':
      case '/':
      case '%':
      case '<<<':
      case '<<':
      case '>>>':
      case '>>':
        if (![Runtime.Integer, Runtime.Double].includes(leftType.classNode)) {
          throw `Must be integer or double, but ${leftType.name} at line ${node.lineno}`
        }
        if (![Runtime.Integer, Runtime.Double].includes(rightType.classNode)) {
          throw `Must be integer or double, but ${rightType.name} at line ${node.lineno}`
        }
        break
      case '&':
      case '|':
      case '^':
        if (leftType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${leftType.name} at line ${node.lineno}`
        }
        if (rightType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${rightType.name} at line ${node.lineno}`
        }
        break
      case '<':
      case '>':
      case '<=':
      case '>=':
      case '==':
      case '===':
      case '!=':
      case '!==':
        if (!this.checkType(leftType, rightType)) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        break
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
        if (!(node.right instanceof Ast.SoqlNode)) {
          if (!this.checkType(leftType, rightType)) {
            throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
          }
        }
        break
      case '&=':
      case '|=':
      case '^=':
        if (leftType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${leftType.name} at line ${node.lineno}`
        }
        if (rightType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${rightType.name} at line ${node.lineno}`
        }
        if (!this.checkType(leftType, rightType)) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        break
    }
  }

  visitSoql (node) {}

  visitReturn (node) {
    if (node.type().classNode === null) return node
    if (!this.checkType(this.currentMethodNode.returnType, node.type())) {
      throw `Illegal conversion from ${node.type().name.join('.')} to ${this.currentMethodNode.returnType.name.join('.')} at line ${node.lineno}`
    }
    return node
  }

  visitString (node) {}

  visitInteger (node) {}

  visitDouble (node) {}

  visitBoolean (node) {}

  visitSwitch (node) {}

  visitTrigger (node) {}

  visitTriggerTiming (node) {}

  visitVariableDeclaration (node) {
    const type = node.type
    node.declarators.forEach((declarator) => {
      if (!declarator.expression) return
      // TODO: for SOQL
      if (!(declarator.expression instanceof Ast.SoqlNode)) {
        const expressionType = declarator.expression.type()
        if (expressionType && !this.checkType(node.type, expressionType)) {
          throw `Type not matched : variable => ${node.type.classNode.name}, initializer => ${expressionType.classNode.name} at line ${node.lineno}`
        }
      }
      declarator.accept(this)
      const env = EnvManager.currentScope()
      env.define(type, declarator.name, new Ast.NullNode())
    })
  }

  visitVariableDeclarator (node) {
    const name = node.name
    if (EnvManager.localIncludes(name)) {
      throw `duplicate variable name ${name} at line ${node.lineno}`
    }
  }

  visitWhen (node) {

  }

  visitWhile (node) {
    let returnNode
    for (let i = 0; i < node.statements.length; i++) {
      returnNode = node.statements[i].accept(this)
      if (this.isReturn(returnNode)) {
        if (i < node.statements.length - 1) {
          throw `Unreachable statement ${node.statements[i].lineno + 1} at line ${node.lineno}`
        }
      }
    }
  }

  visitBlock (node) {
    let returnNode
    for (let i = 0; i < node.statements.length; i++) {
      returnNode = node.statements[i].accept(this)
      if (this.isReturn(returnNode)) {
        if (i < node.statements.length - 1) {
          throw `Unreachable statement ${node.statements[i].lineno + 1} at line ${node.lineno}`
        }
      }
    }
    return returnNode
  }

  visitThrow (node) {}

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
    // node.block.accept(this);
  }

  visitCastExpression (node) {}

  visitSpecialComment (node) {}

  visitUnaryOperator (node) {
    const expressionType = node.expression.type()

    switch (node.op) {
      case '!':
        if (expressionType.classNode !== Runtime.Boolean) {
          throw `Must be Boolean, but ${expressionType.name} at line ${node.lineno}`
        }
        break
      case '+':
      case '-':
        if (![Runtime.Integer, Runtime.Double].includes(expressionType.classNode)) {
          throw `Must be integer or double, but ${expressionType.name} at line ${node.lineno}`
        }
        if (![Runtime.Integer, Runtime.Double].includes(expressionType.classNode)) {
          throw `Must be integer or double, but ${expressionType.name} at line ${node.lineno}`
        }
        break
    }
  }

  visitTernalyExpression (node) {
    const conditionClassNode = node.condition.type().classNode
    if (conditionClassNode !== Runtime.Boolean) {
      throw `Must be Boolean, but ${conditionClassNode.name} at line ${node.lineno}`
    }
  }

  visitInterface (node) {
    this.validateModifierDuplication(node)
  }

  isReturn (returnNode) {
    return returnNode instanceof Ast.ReturnNode ||
      returnNode instanceof Ast.BreakNode ||
      returnNode instanceof Ast.ContinueNode
  }

  checkType (leftType, rightType) {
    if (leftType.classNode === null || rightType.classNode === null) return true
    if (rightType.classNode.name === '_SoqlResult') {
      // TODO: 本当はもうちょっと頑張ってバリデーションする
      return true
    }
    if (leftType.classNode.name == 'ID' && rightType.classNode.name == 'String') return true
    if (leftType.classNode !== rightType.classNode) {
      if (rightType.classNode.superClass) {
        return this.checkType(leftType, rightType.classNode.superClass)
      } else {
        return false
      }
    }
    if (leftType.parameters.length === 0 && rightType.parameters.length === 0) return true
    if (leftType.parameters.length !== rightType.parameters.length) return false
    for (let i = 0; i < leftType.parameters.length; i++) {
      const leftTypeParameter = leftType.parameters[i]
      const rightTypeParameter = rightType.parameters[i]
      if (!this.checkType(leftTypeParameter, rightTypeParameter)) return false
    }
    return true
  }

  throwError (classNode, methodNode, message) {
    const typeName = methodNode.returnType instanceof Ast.TypeNode ? methodNode.returnType.name.join('.') : 'void'
    const params = methodNode.parameters.map((parameter) => {
      return parameter.type().name.join('.')
    }).join(', ')
    throw `${message}: ${typeName} ${classNode.name}.${methodNode.name}(${params})`
  }
}

module.exports = ApexBuilder
