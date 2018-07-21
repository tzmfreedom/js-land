const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast')
const createFieldNode  = require('../create-field-node')

const XmlTag = new ApexClass(
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
);
NameSpaceStore.registerClass('System', XmlTag);

module.exports = XmlTag
