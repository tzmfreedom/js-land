const ApexClass        = require('../node/apex-class')
const Ast = require('../node/ast')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('DataSource');

const QueryAggregation = new ApexClass(
  'QueryAggregation',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', QueryAggregation);

const QueryUtils = new ApexClass(
  'QueryUtils',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', QueryUtils);

const QueryContext = new ApexClass(
  'QueryContext',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', QueryContext);

const ReadContext = new ApexClass(
  'ReadContext',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', ReadContext);

const SearchContext = new ApexClass(
  'SearchContext',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', SearchContext);

const TableResult = new ApexClass(
  'TableResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', TableResult);

const TableSelection = new ApexClass(
  'TableSelection',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', TableSelection);

const Table = new ApexClass(
  'Table',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', Table);

const Column = new ApexClass(
  'Column',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', Column);

const ConnectionParams = new ApexClass(
  'ConnectionParams',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', ConnectionParams);

const Connection = new ApexClass(
  'Connection',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', Connection);

const Provider = new ApexClass(
  'Provider',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', Provider);

const Capability = new ApexClass(
  'Capability',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', Capability);

const AuthenticationCapability = new ApexClass(
  'AuthenticationCapability',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('DataSource', AuthenticationCapability);

