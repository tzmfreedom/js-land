'use strict'

const Ast = require('../../node/ast')
const VariableResolver = require('../variable-resolver')
const VariableResolveResult = require('../variable-resolve-result')

const resolver = new VariableResolver()
resolver.resolveInstanceField = function (receiverNode, fieldName, _) {
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
    const instanceField = this.resolveInstanceField(classNode.superClass, fieldName, _)
    if (instanceField) return instanceField
  }
}

resolver.reduce = function (init, fieldNames, _, node) {
  let receiverNode = init.value
  for (let i = 0; i < fieldNames.length - 1; i++) {
    const fieldName = fieldNames[i]
    if (receiverNode instanceof Ast.NullNode) {
      throw new Error(`Null pointer exception : ${fieldName} at line ${node.lineno}`)
    }
    receiverNode = this.resolveInstanceField(receiverNode, fieldName, _)
    if (!receiverNode) return null
  }
  let key = fieldNames[fieldNames.length - 1]
  if (receiverNode instanceof Ast.NullNode) {
    throw new Error(`Null pointer exception : ${key} at line ${node.lineno}`)
  }
  const instanceField = this.resolveInstanceField(receiverNode, key)
  if (receiverNode && instanceField) {
    return new VariableResolveResult(receiverNode, key)
  }
}

module.exports = resolver
