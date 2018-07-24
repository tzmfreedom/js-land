'use strict'

const Ast = require('../node/ast');
const createMethodNode = (name, modifiers, returnType, parameters, nativeFunction) => {
  return new Ast.MethodDeclarationNode(
    name,
    modifiers.map((modifier) => {
      return new Ast.ModifierNode(modifier)
    }),
    createTypeNode(returnType),
    parameters.map((parameter) => {
      return new Ast.ParameterNode(
        [],
        createTypeNode(parameter[0]),
        parameter[1]
      )
    }),
    [],
    null,
    nativeFunction
  )
}

const createTypeNode = (type) => {
  if (type instanceof Ast.TypeNode) {
    return type
  } else if (Array.isArray(type)){
    return new Ast.TypeNode(type, [])
  } else {
    return new Ast.TypeNode([type], [])
  }
}

module.exports = createMethodNode
