const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const createFieldNode = require('../helper/create-field-node')

const XmlTag = new Ast.ApexClass(
  'XmlTag',
  null,
  [],
  [],
  {},
  {
    START_ELEMENT: createFieldNode(
      'XmlTag',
      ['public'],
      new Ast.NullNode()
    ),
    END_ELEMENT: createFieldNode(
      'XmlTag',
      ['public'],
      new Ast.NullNode()
    )
  },
  {},
  {},
  []
)
NameSpaceStore.registerClass('System', XmlTag)

module.exports = XmlTag
