const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const Math = new ApexClass(
  'Math',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    random: [
      createMethodNode(
        'random',
        ['public'],
        'Double',
        [],
        () => {
        }
      ),
    ],
    round: [
      createMethodNode(
        'round',
        ['public'],
        'Integer',
        [
          ['Double', 'doubleValue']
        ],
        () => {
        }
      ),
      createMethodNode(
        'round',
        ['public'],
        'Integer',
        [
          ['Decimal', 'decimalValue']
        ],
        () => {
        }
      ),
    ],
  },
  {}
);
NameSpaceStore.registerClass('System', Math);

module.exports = Math
