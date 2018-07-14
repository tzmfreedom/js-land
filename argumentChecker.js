'use strict'

const typeSearch = require('./typeSearch');

const argumentChecker = (methodNodes, parameters) => {
  const methodNodeParameterKeys = Object.keys(methodNodes);
  for (let i = 0; i < methodNodeParameterKeys.length; i++) {
    const methodNodeParameterKey = methodNodeParameterKeys[i];
    if (matchParameter(methodNodeParameterKey, parameters)) {
      return methodNodes[methodNodeParameterKey];
    }
  }
};

const matchParameter = (methodNodeParameterKey, parameters) => {
  const keys = methodNodeParameterKey.split(':');
  for (let i = 1; i < keys.length; i++) {
    if (!parameters[i-1]) return false;
    const methodNodeParameterType = typeSearch({ name: [keys[i]] });
    const parameterType = parameters[i-1].type().classNode;
    const matchedClass = canCast(methodNodeParameterType, parameterType);
    if (!matchedClass) return false;
  }
  return true;
};

const canCast = (methodNodeParameterType, parameterType) => {
  if (parameterType === null) {
    return methodNodeParameterType;
  }
  if (methodNodeParameterType === parameterType) {
    return parameterType;
  } else {
    let matchedClass;
    if (parameterType.superClass) {
      matchedClass = canCast(methodNodeParameterType, parameterType.superClass);
      if (matchedClass) return matchedClass;
    } else if (parameterType.name !== 'Object') {
      matchedClass = canCast(methodNodeParameterType, typeSearch({ name: ['Object']}));
      if (matchedClass) return matchedClass;
    }
    if (parameterType.implementClasses) {
      for (let i = 0; i < parameterType.implementClasses.length; i++) {
        matchedClass = canCast(methodNodeParameterType, parameterType.implementClasses[i])
      }
      if (matchedClass) return matchedClass;
    }
    return false;
  }
};


module.exports = argumentChecker;
