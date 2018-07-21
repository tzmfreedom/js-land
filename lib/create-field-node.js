'use strict'

const Ast = require('./node/ast');

const createFieldNode = (type, modifiers, expression) => {
  return new Ast.FieldVariableNode(
    createTypeNode(type),
    modifiers.map((modifier) => {
      return new Ast.ModifierNode(modifier)
    }),
    expression
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

module.exports = createFieldNode
