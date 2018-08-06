const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createFieldNode = require('../helper/create-field-node')
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
  {
    headers: createFieldNode(
      new Ast.TypeNode(
        ['Array'],
        [
          new Ast.TypeNode(['Messaging', 'InboundEmail', 'Header'], [])
        ]
      ),
      ['public'],
      new Ast.NullNode()
    ),
    fromAddress: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    ccAddresses: createFieldNode(
      new Ast.TypeNode(
        ['Array'],
        [
          new Ast.TypeNode(['String'], [])
        ]
      ),
      ['public'],
      new Ast.NullNode()
    ),
    subject: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    plainTextBody: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
  },
  {},
  {},
  {},
  {
    Header: new ApexClass(
      'Header',
      null,
      [],
      [],
      {
        name: createFieldNode(
          'String',
          ['public'],
          new Ast.NullNode()
        ),
        value: createFieldNode(
          'String',
          ['public'],
          new Ast.NullNode()
        ),
      },
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

const SingleEmailMessage = new ApexClass(
  'SingleEmailMessage',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Messaging', SingleEmailMessage);

const PushNotification = new ApexClass(
  'PushNotification',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Messaging', PushNotification);

const PushNotificationPayload = new ApexClass(
  'PushNotificationPayload',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Messaging', PushNotificationPayload);

module.exports = InboundEmail
