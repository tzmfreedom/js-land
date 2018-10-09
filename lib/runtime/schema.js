const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('Schema')

const Schema = new ApexClass(
  'Schema',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    getGlobalDescribe: [
      createMethodNode(
        'getGlobalDescribe',
        ['public'],
        new Ast.TypeNode(
          ['Map'],
          [
            new Ast.TypeNode(['String'], []),
            new Ast.TypeNode(['Schema', 'SObjectType'], [])
          ]
        ),
        [],
        () => {
          return null
        }
      )
    ],
    describeDataCategoryGroups: [
      createMethodNode(
        'describeDataCategoryGroups',
        ['public'],
        new Ast.TypeNode(
          ['List'],
          [
            new Ast.TypeNode(['Schema', 'DescribeDataCategoryGroupResult'], [])
          ]
        ),
        [['String', 'sObjectNames']],
        () => {
          const sObjectNames = EnvManager.getValue('sObjectNames')
          return null
        }
      )
    ],
    describeSObjects: [
      createMethodNode(
        'getGlobalDescribe',
        ['public'],
        new Ast.TypeNode(
          ['List'],
          [
            new Ast.TypeNode(['Schema', 'DescribeSObjectResult'], [])
          ]
        ),
        [
          [
            new Ast.TypeNode(
              ['List'],
              [ new Ast.TypeNode(['String'], []) ]
            ),
            'sObjectTypes'
          ]
        ],
        () => {
          const sObjectTypes = EnvManager.getValue('sObjectTypes')
        }
      )
    ],
    describeTabs: [
      createMethodNode(
        'describeTabs',
        ['public'],
        new Ast.TypeNode(
          ['List'],
          [
            new Ast.TypeNode(['Schema', 'DescribeTabSetResult'], [])
          ]
        ),
        [],
        () => {
          return null
        }
      )
    ],
    describeDataCategoryGroupStructures: [
      createMethodNode(
        'describeDataCategoryGroupStructures',
        ['public'],
        new Ast.TypeNode(
          ['List'],
          [ new Ast.TypeNode(['Schema', 'DescribeDataCategoryGroupStructureResult'], []) ]
        ),
        [
          [
            new Ast.TypeNode(
              ['List'],
              [ new Ast.TypeNode(['Schema', 'DataCategoryGroupSobjectTypePair'], []) ]
            ),
            'pairs'
          ]
        ],
        () => {
          const pairs = EnvManager.getValue('pairs')
        }
      )
    ]
  },
  []
)
NameSpaceStore.registerClass('System', Schema)

const SObjectType = new ApexClass(
  'SObjectType',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)

NameSpaceStore.registerClass('Schema', SObjectType)

const DescribeDataCategoryGroupResult = new ApexClass(
  'DescribeDataCategoryGroupResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)
NameSpaceStore.registerClass('Schema', DescribeDataCategoryGroupResult)

const DescribeSObjectResult = new ApexClass(
  'DescribeSObjectResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)
NameSpaceStore.registerClass('Schema', DescribeSObjectResult)

const DescribeTabSetResult = new ApexClass(
  'DescribeTabSetResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)
NameSpaceStore.registerClass('Schema', DescribeTabSetResult)

const DataCategoryGroupSobjectTypePair = new ApexClass(
  'DataCategoryGroupSobjectTypePair',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)
NameSpaceStore.registerClass('Schema', DataCategoryGroupSobjectTypePair)

const DescribeDataCategoryGroupStructureResult = new ApexClass(
  'DescribeDataCategoryGroupStructureResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)
NameSpaceStore.registerClass('Schema', DescribeDataCategoryGroupStructureResult)

module.exports = SObjectType
