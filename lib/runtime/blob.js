const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../helper/create-method-node')

const Blob = new ApexClass(
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
          let object = EnvManager.getValue('this')
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
          let object = EnvManager.getValue('this')
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
        [['Object', 'object']],
        () => {
          let object = EnvManager.getValue('object')
          return new Ast.BlobNode(Buffer.from(object.value))
        }
      )
    ]
  },
  []
);
NameSpaceStore.registerClass('System', Blob);

module.exports = Blob
