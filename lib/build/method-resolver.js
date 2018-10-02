'use strict'

const Ast = require('../node/ast');
const modifier = require('../modifier-enum')
const MethodResolveResult = require('../method-resolve-result')
const MethodResolver = require('../method-resolver')

const resolver = new MethodResolver()
resolver.resolve = function(node) {
  if (!(node.nameOrExpression instanceof Ast.NameNode)) {
    const fieldAccess = node.nameOrExpression;
    const receiverType = fieldAccess.expression.type();
    const methodNode = this.resolveInstanceMethod(receiverType, fieldAccess.fieldName, node.parameters, modifier.PUBLIC);
    if (!methodNode) {
      throw `Method is not defined: ${fieldAccess.fieldName} at line ${node.lineno}`;
    }
    return new MethodResolveResult(fieldAccess.expression, methodNode);
  } else {
    return this._resolve(node);
  }
}

resolver.reduce = function(init, fieldNames, conditionState) {
  let receiverNode = init.type();
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i]
    if (!receiverNode) return null;
    const instanceField = this.resolveInstanceField(receiverNode.classNode, fieldName, conditionState)
    if (!instanceField) {
      return null
    }
    conditionState = modifier.PUBLIC

    receiverNode = instanceField.type;
  }
  return receiverNode;
}

resolver.resolveInstanceField = function(classNode, fieldName, conditionState) {
  const instanceFields = classNode.instanceFields
  if (!(instanceFields.includes(fieldName))) {
    if (conditionState == modifier.PRIVATE) {
      conditionState = modifier.PROTECTED
    }
    if (classNode.superClass) {
      return this.resolveInstanceField(classNode.superClass.classNode, fieldName, conditionState)
    }
  } else {
    const instanceField = instanceFields.get(fieldName)
    if (instanceField) {
      if (conditionState == modifier.PUBLIC) {
        if (!(instanceField.isPublic())) {
          throw `Field is not visible: ${instanceField.name}`
        }
        if (instanceField.getter && !instanceField.getter.isPublic()) {
          throw `Field is not visible: ${instanceField.name}`
        }
      }
      if (conditionState == modifier.PROTECTED) {
        if (instanceField.isPrivate()) {
          throw `Field is not visible: ${instanceField.name}`
        }
      }
      return instanceField
    }
  }
}

module.exports = resolver
