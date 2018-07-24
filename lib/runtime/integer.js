const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const ApexInteger = new ApexClass(
  'Integer',
  null,
  [],
  [],
  {},
  {},
  {
    format: [
      createMethodNode(
        'format',
        ['public'],
        'String',
        [],
        () => {
          const object = EnvManager.getValue('this')
          return new Ast.StringNode(String(object.value))
        }
      )
    ]
  },
  {
    valueOf: [
      createMethodNode(
        'valueOf',
        ['public'],
        'String',
        [['String', 'stringToInteger']],
        () => {
          const object = EnvManager.getValue('stringToInteger')
          return new Ast.IntegerNode(parseInt(object.value))
        }
      )
    ],
  },
  []
);
NameSpaceStore.registerClass('System', ApexInteger);

module.exports = ApexInteger
