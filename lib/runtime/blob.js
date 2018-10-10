const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const Blob = new Ast.ApexClass(
  'Blob',
  null,
  [],
  [],
  {},
  {},
  {
    toString: [
      createMethodNode(
        'toString',
        ['public'],
        'String',
        [],
        () => {
          const object = EnvManager.getValue('this')
          return new Ast.StringNode(object.value.toString())
        }
      )
    ],
    size: [
      createMethodNode(
        'size',
        ['public'],
        'Integer',
        [],
        () => {
          const object = EnvManager.getValue('this')
          return new Ast.StringNode(object.value.length)
        }
      )
    ]
  },
  {
    valueOf: [
      createMethodNode(
        'valueOf',
        ['public'],
        'Blob',
        [['String', 'stringToBlob']],
        () => {
          const stringToBlob = EnvManager.getValue('stringToBlob')
          return new Ast.BlobNode(Buffer.from(stringToBlob.value))
        }
      )
    ]
  },
  []
)
NameSpaceStore.registerClass('System', Blob)

module.exports = Blob
