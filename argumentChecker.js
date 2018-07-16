'use strict'

const typeSearch = require('./typeSearch');

const argumentChecker = (methodNodes, parameters) => {
  const parameterTypeClasses = parameters.map((parameter) => {
    return parameter.type().classNode;
  });
  for (let i = 0; i < methodNodes.length; i++) {
    const methodNode = methodNodes[i];
    if (matchParameter(methodNode, parameterTypeClasses)) {
      return methodNode;
    }
  }
};

const matchParameter = (methodNode, parameterTypeClasses) => {
  const types = methodNode.parameters.map((parameter) => {
    return parameter.type;
  });
  if (types.length != parameterTypeClasses.length) return false;
  for (let i = 0; i < types.length; i++) {
    const methodParameterTypeClass = types[i].classNode;
    const invokeParameterTypeClass = parameterTypeClasses[i];
    const matchedClass = matchType(methodParameterTypeClass, invokeParameterTypeClass);
    if (!matchedClass) return false;
  }
  return true;
};

const matchType = (methodParameterTypeClass, invokeParameterTypeClass) => {
  // Ast.NullNode
  if (invokeParameterTypeClass == null) return true;

  if (methodParameterTypeClass === invokeParameterTypeClass) {
    return true;
  } else {
    let matchedClass;
    if (invokeParameterTypeClass.superClass) {
      matchedClass = matchType(methodParameterTypeClass, invokeParameterTypeClass.superClass);
      if (matchedClass) return matchedClass;
    } else if (invokeParameterTypeClass.name !== 'Object') {
      matchedClass = matchType(methodParameterTypeClass, typeSearch({ name: ['Object']}));
      if (matchedClass) return matchedClass;
    }
    if (invokeParameterTypeClass.implementClasses) {
      for (let i = 0; i < invokeParameterTypeClass.implementClasses.length; i++) {
        matchedClass = matchType(methodParameterTypeClass, invokeParameterTypeClass.implementClasses[i])
        if (matchedClass) return true;
      }
    }
    return false;
  }
};


module.exports = argumentChecker;
