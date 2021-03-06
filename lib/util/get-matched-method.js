'use strict'

const resolveType = require('../util/resolve-type')

const getMatchedMethod = (receiverNode, methodNodes, parameters) => {
  const parameterTypeClasses = parameters.map((parameter) => {
    return parameter.type().classNode
  })
  for (let i = 0; i < methodNodes.length; i++) {
    const methodNode = methodNodes[i]
    if (matchParameter(receiverNode, methodNode, parameterTypeClasses)) {
      return methodNode
    }
  }
}

const matchParameter = (receiverNode, methodNode, parameterTypeClasses) => {
  const types = methodNode.parameters.map((parameter) => {
    const genericsMatcher = parameter.type().name.join('.').match(/^T:(\d)$/)
    if (genericsMatcher) {
      const index = parseInt(genericsMatcher[1])
      return receiverNode.parameters[index]
    }
    return parameter.type()
  })
  if (types.length != parameterTypeClasses.length) return false
  for (let i = 0; i < types.length; i++) {
    const methodParameterTypeClass = types[i].classNode
    const invokeParameterTypeClass = parameterTypeClasses[i]
    const matchedClass = matchType(methodParameterTypeClass, invokeParameterTypeClass)
    if (!matchedClass) return false
  }
  return true
}

const matchType = (methodParameterTypeClass, invokeParameterTypeClass) => {
  // Ast.NullNode
  if (invokeParameterTypeClass == null) return true

  if (methodParameterTypeClass === invokeParameterTypeClass) {
    return true
  } else {
    if (invokeParameterTypeClass.superClass) {
      const matchedClass = matchType(methodParameterTypeClass, invokeParameterTypeClass.superClass.classNode)
      if (matchedClass) return matchedClass
    } else if (invokeParameterTypeClass.name == 'String' && methodParameterTypeClass.name == 'ID') {
      return true
    } else if (invokeParameterTypeClass.name !== 'Object') {
      const matchedClass = matchType(methodParameterTypeClass, resolveType({ name: ['Object'] }))
      if (matchedClass) return matchedClass
    }
    if (invokeParameterTypeClass.implementClasses) {
      for (let i = 0; i < invokeParameterTypeClass.implementClasses.length; i++) {
        const matchedClass = matchType(methodParameterTypeClass, invokeParameterTypeClass.implementClasses[i])
        if (matchedClass) return true
      }
    }
    return false
  }
}

module.exports = getMatchedMethod
