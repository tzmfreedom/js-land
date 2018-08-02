const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../helper/create-method-node')

const Messaging = new ApexClass(
  'Messaging',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', Messaging);

NameSpaceStore.register('Messaging');

const InboundEmail = new ApexClass(
  'InboundEmail',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {
    Header: new ApexClass(
      'Header',
      null,
      [],
      [],
      {},
      {},
      {},
      {},
      {}
    )
  }
);
NameSpaceStore.registerClass('Messaging', InboundEmail);

const InboundEnvelope = new ApexClass(
  'InboundEnvelope',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Messaging', InboundEnvelope);

const InboundEmailHandler = new ApexClass(
  'InboundEmailHandler',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Messaging', InboundEmailHandler);

const InboundEmailResult = new ApexClass(
  'InboundEmailResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Messaging', InboundEmailResult);

module.exports = InboundEmail
