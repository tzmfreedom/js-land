const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const ApexDouble = new ApexClass(
  'Double',
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
          const thisReceiver = EnvManager.getValue('this')
          return new Ast.StringNode(String(thisReceiver.value))
        }
      )
    ],
    intValue: [
      createMethodNode(
        'intValue',
        ['public'],
        'Integer',
        [],
        () => {
          const thisReceiver = EnvManager.getValue('this')
          return new Ast.IntegerNode(parseInt(thisReceiver.value))
        }
      )
    ],
    longValue: [
      createMethodNode(
        'longValue',
        ['public'],
        'Integer',
        [],
        () => {
          const thisReceiver = EnvManager.getValue('this')
          return new Ast.IntegerNode(parseInt(thisReceiver.value))
        }
      )
    ],
    round: [
      createMethodNode(
        'round',
        ['public'],
        'Long',
        [],
        () => {
          const thisReceiver = EnvManager.getValue('this')
          return new Ast.IntegerNode(Math.round(thisReceiver.value))
        }
      )
    ]
  },
  {
    valueOf: [
      createMethodNode(
        'valueOf',
        ['public'],
        'Double',
        [['String', 'stringToDouble']],
        () => {
          const stringToDouble = EnvManager.getValue('stringToDouble')
          return new Ast.DoubleNode(parseFloat(stringToDouble))
        }
      )
    ]
  },
  []
)
NameSpaceStore.registerClass('System', ApexDouble)

module.exports = ApexDouble
