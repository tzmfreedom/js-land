'use strict'

const Ast = require('../node/ast')
const VariableResolver = require('../variable-resolver')
const VariableResolveResult = require('../variable-resolve-result')
const modifier = require('../modifier-enum')

const resolver = new VariableResolver()
resolver.resolveInstanceField = function (receiverNode, fieldName, conditionState, node) {
  let classNode
  if (receiverNode instanceof Ast.TypeNode) {
    classNode = receiverNode.classNode
  } else {
    classNode = receiverNode.type().classNode
  }

  if (classNode.instanceFields.includes(fieldName)) {
    const instanceField = classNode.instanceFields.get(fieldName)
    if (instanceField) return instanceField
  }
  if (classNode.superClass) {
    if (conditionState == modifier.PRIVATE) {
      conditionState = modifier.PROTECTED
    }
    const instanceField = this.resolveInstanceField(classNode.superClass, fieldName, conditionState, node)
    if (instanceField) return instanceField
  }
}

resolver.reduce = function (init, fieldNames, conditionState, node) {
  let receiverNode = init.type()
  for (let i = 0; i < fieldNames.length - 1; i++) {
    const fieldName = fieldNames[i]
    if (!receiverNode) return null
    const instanceField = this.resolveInstanceField(receiverNode, fieldName, conditionState, node)
    if (!instanceField) return null
    receiverNode = instanceField.type
  }

  let key = fieldNames[fieldNames.length - 1]
  const instanceField = this.resolveInstanceField(receiverNode, key, conditionState, node)
  if (receiverNode && instanceField) {
    return new VariableResolveResult(receiverNode, key)
  }
}

module.exports = resolver
