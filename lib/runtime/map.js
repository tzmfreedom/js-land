const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const EnvManager       = require('../env-manager')
const Ast              = require('../node/ast')
const createMethodNode = require('../helper/create-method-node')

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
          const value = EnvManager.getValue('value');
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
          const obj = EnvManager.getValue('this');
          const keyNode = EnvManager.getValue('key');
          return obj._records[parseInt(keyNode.value)];
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
ApexMap.valueFunction = (node) => {
  const messages = Object.keys(node._records).map((key) => {
    const value = node._records[key]
    if ('value' in value) {
      return `  ${key} => ${value.value}`;
    } else {
      return `  ${key} => ${value.val()}`;
    }
  });
  return `Map\n${messages.join('\n')}`;
};

NameSpaceStore.registerClass('System', ApexMap);

module.exports = ApexMap
