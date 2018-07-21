const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const EnvManager       = require('../env-manager')
const Ast              = require('../node/ast')
const createMethodNode = require('../create-method-node')

const ApexList = new ApexClass(
  'List',
  null,
  [],
  [
    new Ast.MethodDeclarationNode(
      'List',
      [],
      new Ast.TypeNode(['void'], []),
      [],
      [],
      null,
      () => {
        const obj = EnvManager.get('this').value;
        obj._records = [];
        obj._idx = 0;
      }
    )
  ],
  {},
  {},
  {
    hasNext: [
      createMethodNode(
        'hasNext',
        ['public'],
        'Boolean',
        [],
        () => {
          const obj = EnvManager.get('this').value;
          return new Ast.BooleanNode(obj._idx < obj._records.length);
        }
      )
    ],
    next: [
      createMethodNode(
        'next',
        ['public'],
        'Object',
        [],
        () => {
          const obj = EnvManager.get('this').value;
          const record = obj._records[obj._idx];
          obj._idx++;
          return record;
        }
      )
    ],
    add: [
      createMethodNode(
        'add',
        ['public'],
        'void',
        [['Object', 'value']],
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
        'Object',
        [['Object', 'key']],
        () => {
          const obj = EnvManager.get('this').value;
          const keyNode = EnvManager.get('key').value;
          return obj._records[parseInt(keyNode.value)].value;
        }
      )
    ],
    isEmpty: [
      createMethodNode(
        'isEmpty',
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
ApexList.valueFunction = (node) => {
  const messages = node._records.map((record) => {
    return `  ${record.val()}`;
  });
  return `List\n${messages.join('\n')}`;
};
NameSpaceStore.registerClass('System', ApexList);

const ApexMap = new ApexClass(
  'Map',
  null,
  [],
  [],
  {},
  {},
  {
    keys: [
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
