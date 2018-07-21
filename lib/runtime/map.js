const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const EnvManager       = require('../env-manager')
const Ast              = require('../node/ast')
const createMethodNode = require('../create-method-node')

const ApexMap = new ApexClass(
  'Map',
  null,
  [],
  [],
  {},
  {},
  {
    keys: [
      createMethodNode(
        'keys',
        ['public'],
        'List',
        [],
        () => {
          const obj = EnvManager.get('this').value;
        }
      )
    ],
    put: [
      createMethodNode(
        'put',
        ['public'],
        'void',
        [['T:0', 'key'], ['T:1', 'value']],
        () => {
          const obj = EnvManager.get('this').value;
          const value = EnvManager.get('value');
          obj._records.push(value);
        }
      )
    ],
    get: [
      createMethodNode(
        'get',
        ['public'],
        'T:0',
        [['T:1', 'key']],
        () => {
          const obj = EnvManager.get('this').value;
          const keyNode = EnvManager.get('key').value;
          return obj._records[parseInt(keyNode.value)].value;
        }
      )
    ],
    keySet: [
      createMethodNode(
        'keySet',
        ['public'],
        'Set',
        [],
        () => {
          const thisReceiver = EnvManager.getValue('this')
          thisReceiver._records
        }
      )
    ],
    containsKey: [
      createMethodNode(
        'containsKey',
        ['public'],
        'Boolean',
        [['T:0', 'key']],
        () => {
        }
      )
    ]
  },
  {},
  []
);
NameSpaceStore.registerClass('System', ApexMap);

module.exports = ApexMap
