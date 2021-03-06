'use strict'

const Ast = require('../../node/ast')
const modifier = require('../modifier-enum')
const MethodResolveResult = require('../method-resolve-result')
const MethodResolver = require('../method-resolver')

const resolver = new MethodResolver()
resolver.resolve = function (node) {
  if (!(node.nameOrExpression instanceof Ast.NameNode)) {
    const fieldAccess = node.nameOrExpression
    const receiverType = fieldAccess.expression.type()
    const methodNode = this.resolveInstanceMethod(receiverType, fieldAccess.fieldName, node.parameters, modifier.PUBLIC, node)
    if (!methodNode) {
      throw new Error(`Method is not defined: ${fieldAccess.fieldName} at line ${node.lineno}`)
    }
    return new MethodResolveResult(fieldAccess.expression, methodNode)
  } else {
    return this._resolve(node)
  }
}

resolver.reduce = function (init, fieldNames, conditionState, node) {
  let receiverNode = init.type()
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i]
    if (!receiverNode) return null
    const instanceField = this.resolveInstanceField(receiverNode.classNode, fieldName, conditionState, node)
    if (!instanceField) {
      return null
    }
    conditionState = modifier.PUBLIC

    receiverNode = instanceField.type
  }
  return receiverNode
}

resolver.resolveInstanceField = function (classNode, fieldName, conditionState, _) {
  const instanceFields = classNode.instanceFields
  if (!(instanceFields.includes(fieldName))) {
    if (conditionState == modifier.PRIVATE) {
      conditionState = modifier.PROTECTED
    }
    if (classNode.superClass) {
      return this.resolveInstanceField(classNode.superClass.classNode, fieldName, conditionState, _)
    }
  } else {
    const instanceField = instanceFields.get(fieldName)
    if (instanceField) return instanceField
  }
}

module.exports = resolver
