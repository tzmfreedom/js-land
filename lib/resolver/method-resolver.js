'use strict'

const ApexClassStore = require('../store/apex-class-store')
const NameSpaceStore = require('../store/name-space-store')
const ClassStaticFields = require('../store/class-static-fields')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const getMatchedMethod = require('../util/get-matched-method')
const MethodResolveResult = require('./method-resolve-result')
const modifier = require('./modifier-enum')

class MethodResolver {
  _resolve (node) {
    const names = node.nameOrExpression.value
    const name = names[0]
    const methodName = names[names.length - 1]

    // local_variable.field...method()
    if (EnvManager.localIncludes(name)) {
      const variable = EnvManager.get(name)
      const conditionState = name === 'this' ? modifier.PRIVATE : modifier.PUBLIC
      const receiverNode = this.reduce(variable, names.slice(1, names.length - 1), conditionState, node)
      if (receiverNode) {
        const conditionState = (() => {
          if (name === 'this' && names.length == 2) {
            return modifier.PRIVATE
          }
          return modifier.PUBLIC
        })()
        const methodNode = this.resolveInstanceMethod(receiverNode, methodName, node.parameters, conditionState, node)
        if (receiverNode && methodNode) {
          return new MethodResolveResult(receiverNode, methodNode)
        }
      }
    }

    // this.field...method()
    if (EnvManager.localIncludes('this')) {
      const variable = EnvManager.get('this')
      const receiverNode = this.reduce(variable, names.slice(0, names.length - 1), modifier.PRIVATE, node)
      if (receiverNode) {
        const conditionState = (() => {
          if (names.length === 1) {
            return modifier.PRIVATE
          }
          return modifier.PUBLIC
        })()
        const methodNode = this.resolveInstanceMethod(receiverNode, methodName, node.parameters, conditionState, node)
        if (receiverNode && methodNode) {
          return new MethodResolveResult(receiverNode, methodNode)
        }
      }
    }

    // (this_class.)static_method()
    if (names.length == 1) {
      if (EnvManager.localIncludes('_class')) {
        const classNode = EnvManager.getValue('_class')
        if (classNode) {
          const methodNode = this.resolveStaticMethod(classNode, name, node.parameters, modifier.PRIVATE)
          if (methodNode) {
            if (!methodNode.isPublic()) {
              throw new Error(`Method is not visible: ${methodNode.name} at line ${node.lineno}`)
            }
            return new MethodResolveResult(classNode, methodNode)
          }
        }
      }
      // TODO: (this_class.)static_field.method
      // TODO: (this_class.)static_field.field...method
    }

    // Class.static_method()
    if (names.length == 2) {
      const classInfo = ApexClassStore.get(name)
      if (classInfo) {
        const methodNode = this.resolveStaticMethod(classInfo, names[1], node.parameters, modifier.PUBLIC)
        if (classInfo && methodNode) {
          if (!(methodNode.isPublic())) {
            throw new Error(`Method is not visible: ${methodNode.name} at line ${node.lineno}`)
          }
          return new MethodResolveResult(classInfo, methodNode)
        }
      }
      if (NameSpaceStore.includes('System', name)) {
        const classInfo = NameSpaceStore.get('System', name)
        if (classInfo) {
          const methodNode = this.resolveStaticMethod(classInfo, names[1], node.parameters, modifier.PUBLIC)
          if (classInfo && methodNode) {
            if (!(methodNode.isPublic())) {
              throw new Error(`Method is not visible: ${methodNode.name} at line ${node.lineno}`)
            }
            return new MethodResolveResult(classInfo, methodNode)
          }
        }
      }
    }

    // Class.static_field.field...method()
    if (names.length >= 3) {
      const classNode = ApexClassStore.get(name)
      if (classNode) {
        const staticFieldName = names[1]
        if (classNode.staticFields.includes(staticFieldName)) {
          const field = ClassStaticFields.get(classNode.name, staticFieldName)
          const receiverNode = this.reduce(field, names.slice(2, names.length - 1), modifier.PUBLIC, node)
          if (receiverNode) {
            const methodNode = this.resolveInstanceMethod(receiverNode, methodName, node.parameters, modifier.PUBLIC, node)
            if (receiverNode && methodNode) {
              if (!methodNode.isPublic()) {
                throw new Error(`Method is not visible: ${methodNode.name} at line ${node.lineno}`)
              }
              return new MethodResolveResult(receiverNode, methodNode)
            }
          }
        }
      }
    }

    // Namespace.Class.static_field.field...method()
    if (names.length >= 3) {
      const classNode = NameSpaceStore.get(name, names[1])
      if (classNode) {
        const staticFieldName = names[2]
        if (classNode.staticFields.includes(staticFieldName)) {
          const field = ClassStaticFields.get(classNode.name, staticFieldName)
          const receiverNode = this.reduce(field, names.slice(3, names.length - 1), modifier.PUBLIC, node)

          const methodNode = this.resolveInstanceMethod(receiverNode, methodName, node.parameters, modifier.PUBLIC, node)
          if (receiverNode && methodNode) {
            if (!methodNode.isPublic()) {
              throw new Error(`Method is not visible: ${methodNode.name} at line ${node.lineno}`)
            }
            return new MethodResolveResult(receiverNode, methodNode)
          }
        }

        if (names.length == 3) {
          const methodNode = this.resolveStaticMethod(classNode, names[2], node.parameters, modifier.PUBLIC)
          if (methodNode) {
            return new MethodResolveResult(classNode, methodNode)
          }
        }
      }
    }

    throw new Error(`Method is not exist ${names.join('.')} at line ${node.lineno}`)
  }

  resolveInstanceMethod (receiverNode, methodName, parameters, conditionState, node) {
    if (receiverNode instanceof Ast.NullNode) {
      throw new Error(`Null pointer exception : ${methodName}() at line ${node.lineno}`)
    }
    let classNode
    if (receiverNode instanceof Ast.TypeNode) {
      classNode = receiverNode.classNode
    } else {
      classNode = receiverNode.type().classNode
    }

    if (classNode.instanceMethods.includes(methodName)) {
      const methodNodes = classNode.instanceMethods.get(methodName)
      const methodNode = getMatchedMethod(receiverNode, methodNodes, parameters)
      if (methodNode) {
        this.checkMethodModifier(receiverNode, methodNode, conditionState)
        return methodNode
      }
    }
    if (classNode.superClass) {
      if (conditionState === modifier.PRIVATE) {
        conditionState = modifier.PROTECTED
      }
      const methodNode = this.resolveInstanceMethod(classNode.superClass, methodName, parameters, conditionState, node)
      if (methodNode) {
        this.checkMethodModifier(receiverNode, methodNode, conditionState)
        return methodNode
      }
    }
  }

  resolveStaticMethod (classNode, methodName, parameters, conditionState) {
    if (classNode.staticMethods.includes(methodName)) {
      const methodNodes = classNode.staticMethods.get(methodName)
      if (methodNodes == null) return null

      const methodNode = getMatchedMethod(classNode, methodNodes, parameters)
      if (methodNode) {
        this.checkMethodModifier(classNode, methodNode, conditionState)
        return methodNode
      }
    } else {
      if (classNode.superClass) {
        if (conditionState === modifier.PRIVATE) {
          conditionState = modifier.PROTECTED
        }
        return this.resolveStaticMethod(classNode.superClass.classNode, methodName, parameters, conditionState)
      }
      if (classNode.name != 'Object') {
        const ApexObject = NameSpaceStore.get('System', 'Object')
        return this.resolveStaticMethod(ApexObject, methodName, parameters)
      }
    }
  }

  checkMethodModifier (receiverNode, methodNode, conditionState) {
    if (conditionState === modifier.PUBLIC && !methodNode.isPublic()) {
      throw new Error(`Method is not visible: ${methodNode.name} at line ${receiverNode.lineno}`)
    }
    if (conditionState === modifier.PROTECTED && methodNode.isPrivate()) {
      throw new Error(`Method is not visible: ${methodNode.name} at line ${receiverNode.lineno}`)
    }
  }
}

module.exports = MethodResolver
