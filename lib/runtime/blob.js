const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../create-method-node')

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
          let object = EnvManager.get('object')
          return new Ast.StringNode(object.value.toString())
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
          let object = EnvManager.get('object')
          return new Ast.BlobNode(Buffer.from(object.value))
        }
      )
    ]
  },
  []
);
NameSpaceStore.registerClass('System', Blob);

module.exports = Blob
