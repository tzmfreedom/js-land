const Ast = require('../node/ast')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('DataSource')

const QueryAggregation = new Ast.ApexClass(
  'QueryAggregation',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', QueryAggregation)

const QueryUtils = new Ast.ApexClass(
  'QueryUtils',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', QueryUtils)

const QueryContext = new Ast.ApexClass(
  'QueryContext',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', QueryContext)

const ReadContext = new Ast.ApexClass(
  'ReadContext',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', ReadContext)

const SearchContext = new Ast.ApexClass(
  'SearchContext',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', SearchContext)

const TableResult = new Ast.ApexClass(
  'TableResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', TableResult)

const TableSelection = new Ast.ApexClass(
  'TableSelection',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', TableSelection)

const Table = new Ast.ApexClass(
  'Table',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    get: [
      createMethodNode(
        'get',
        ['public'],
        ['DataSource', 'Column'],
        [
          ['String', 'name'],
          ['String', 'nameColumn'],
          [
            new Ast.TypeNode(
              ['List'],
              [ new Ast.TypeNode(['DataSource', 'Column'], []) ]
            ),
            'columns'
          ]
        ],
        () => {
        }
      )
    ]
  },
  {}
)
NameSpaceStore.registerClass('DataSource', Table)

const Column = new Ast.ApexClass(
  'Column',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    url: [
      createMethodNode(
        'url',
        ['public'],
        ['DataSource', 'Column'],
        [
          ['String', 'name'],
          ['Integer', 'length']
        ],
        () => {
        }
      )
    ],
    number: [
      createMethodNode(
        'text',
        ['public'],
        ['DataSource', 'Column'],
        [
          ['String', 'name'],
          ['Integer', 'length'],
          ['Integer', 'decimalPlaces']
        ],
        () => {
        }
      )
    ],
    text: [
      createMethodNode(
        'text',
        ['public'],
        ['DataSource', 'Column'],
        [
          ['String', 'name'],
          ['Integer', 'length']
        ],
        () => {
        }
      )
    ]
  },
  {}
)
NameSpaceStore.registerClass('DataSource', Column)

const ConnectionParams = new Ast.ApexClass(
  'ConnectionParams',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', ConnectionParams)

const Connection = new Ast.ApexClass(
  'Connection',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', Connection)

const Provider = new Ast.ApexClass(
  'Provider',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', Provider)

const Capability = new Ast.ApexClass(
  'Capability',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', Capability)

const AuthenticationCapability = new Ast.ApexClass(
  'AuthenticationCapability',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('DataSource', AuthenticationCapability)
