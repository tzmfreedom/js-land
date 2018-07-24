const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const createMethodNode = require('../helper/create-method-node')
const createFieldNode  = require('../helper/create-field-node')

const ApexXmlStreamReader = new ApexClass(
  'XmlStreamReader',
  null,
  [],
  [],
  {},
  {},
  {
    getEventType: [
      createMethodNode(
        'getEventType',
        ['public'],
        'XmlTag',
        [],
        () => {
        }
      )
    ],
    getLocalName: [
      createMethodNode(
        'getLocalName',
        ['public'],
        'String',
        [],
        () => {
        }
      )
    ],
    getText: [
      createMethodNode(
        'getText',
        ['public'],
        'String',
        [],
        () => {
        }
      )
    ],
    next: [
      createMethodNode(
        'next',
        ['public'],
        'void',
        [],
        () => {
        }
      )
    ],
    hasNext: [
      createMethodNode(
        'hasNext',
        ['public'],
        'Boolean',
        [],
        () => {
        }
      )
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('System', ApexXmlStreamReader);

module.exports = ApexXmlStreamReader
