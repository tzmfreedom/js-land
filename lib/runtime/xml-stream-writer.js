const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

const ApexXmlStreamWriter = new ApexClass(
  'XmlStreamWriter',
  null,
  [],
  [],
  {},
  {},
  {
    writeStartDocument: [
      createMethodNode(
        'writeStartDocument',
        ['public'],
        'void',
        [['String', 'encoding'], ['String', 'version']],
        () => {
        }
      )
    ],
    writeEndDocument: [
      createMethodNode(
        'writeEndDocument',
        ['public'],
        'void',
        [],
        () => {
        }
      )
    ],
    writeStartElement: [
      createMethodNode(
        'writeStartElement',
        ['public'],
        'void',
        [
          ['String', 'prefix'],
          ['String', 'localName'],
          ['String', 'namespaceUri']
        ],
        () => {
        }
      )
    ],
    writeEndElement: [
      createMethodNode(
        'writeEndElement',
        ['public'],
        'void',
        [],
        () => {
        }
      )
    ],
    writeCharacters: [
      createMethodNode(
        'writeCharacters',
        ['public'],
        'void',
        [['String', 'text']],
        () => {
        }
      )
    ],
    getXmlString: [
      createMethodNode(
        'getXmlString',
        ['public'],
        'String',
        [],
        () => {
        }
      )
    ],
    close: [
      createMethodNode(
        'close',
        ['public'],
        'void',
        [],
        () => {
        }
      )
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('System', ApexXmlStreamWriter);

module.exports = ApexXmlStreamWriter
