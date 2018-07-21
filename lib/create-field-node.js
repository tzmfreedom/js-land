'use strict'

const Ast = require('./node/ast');

const createFieldNode = (type, modifiers, expression) => {
  return new Ast.FieldVariableNode(
    new Ast.TypeNode([type], []),
    modifiers.map((modifier) => {
      return new Ast.ModifierNode(modifier)
    }),
    expression
  )
}

module.exports = createFieldNode
