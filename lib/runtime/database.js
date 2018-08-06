const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const Database = new ApexClass(
  'Database',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    setSavePoint: [
      createMethodNode(
        'setSavePoint',
        ['public'],
        ['SavePoint'],
        [],
        () => {
        }
      ),
    ],
    getQueryLocator: [
      createMethodNode(
        'getQueryLocator',
        ['public'],
        ['Database', 'QueryLocator'],
        [['String', 'query']],
        () => {
        }
      ),
      createMethodNode(
        'getQueryLocator',
        ['public'],
        ['Database', 'QueryLocator'],
        [
          [
            new Ast.TypeNode(
              ['Array'],
              [ new Ast.TypeNode(['SObject'], []) ]
            ),
            'listOfQueries',
          ]
        ],
        () => {
        }
      )
    ],
    executeBatch: [
      createMethodNode(
        'executeBatch',
        ['public'],
        'ID',
        [
          ['Object', 'batchClassObject']
        ],
        () => {
        }
      )
    ],
  },
  {}
);
NameSpaceStore.registerClass('System', Database);

NameSpaceStore.register('Database');
const Batchable = new ApexClass(
  'Batchable',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Database', Batchable);

const BatchableContext = new ApexClass(
  'BatchableContext',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Database', BatchableContext);

const QueryLocator = new ApexClass(
  'QueryLocator',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Database', QueryLocator);

const SaveResult = new ApexClass(
  'SaveResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Database', SaveResult);

const AllowsCallouts = new ApexClass(
  'AllowsCallouts',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Database', AllowsCallouts);

module.exports = Database
