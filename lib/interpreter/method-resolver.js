'use strict'

const Ast = require('../node/ast');
const MethodResolveResult = require('../method-resolve-result')
const MethodResolver = require('../method-resolver')
const modifier = require('../modifier-enum')

const resolver = new MethodResolver()
resolver.reduce = function(init, fieldNames) {
  let receiverNode = init.value;
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i]
    if (!receiverNode) return null;
    if (!(receiverNode.instanceFields.includes(fieldName))) return null;
    receiverNode = receiverNode.instanceFields.get(fieldName)
  }
  return receiverNode;
}

resolver.resolveInstanceField = function(classNode, fieldName, _) {
  const instanceFields = classNode.instanceFields
  if (!(instanceFields.includes(fieldName))) {
    if (classNode.superClass) {
      return this.resolveInstanceField(classNode.superClass.classNode, fieldName, _)
    }
  } else {
    const instanceField = instanceFields.get(fieldName)
    if (instanceField) return instanceField
  }
}

resolver.resolve = function(node, visitor) {
  if (!(node.nameOrExpression instanceof Ast.NameNode)) {
    const fieldAccess = node.nameOrExpression;
    const receiverNode = fieldAccess.expression.accept(visitor);
    const methodNode = this.resolveInstanceMethod(receiverNode, fieldAccess.fieldName, node.parameters, modifier.PUBLIC);
    return new MethodResolveResult(receiverNode, methodNode);
  } else {
    return this._resolve(node);
  }
}

module.exports = resolver
