const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createFieldNode = require('../helper/create-field-node')
const createMethodNode = require('../helper/create-method-node')

const Messaging = new Ast.ApexClass(
  'Messaging',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)
NameSpaceStore.registerClass('System', Messaging)

NameSpaceStore.register('Messaging')

const InboundEmail = new Ast.ApexClass(
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
    )
  },
  {},
  {},
  {},
  {
    Header: new Ast.ApexClass(
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
        )
      },
      {},
      {},
      {},
      {}
    )
  }
)
NameSpaceStore.registerClass('Messaging', InboundEmail)

const InboundEnvelope = new Ast.ApexClass(
  'InboundEnvelope',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Messaging', InboundEnvelope)

const InboundEmailHandler = new Ast.ApexClass(
  'InboundEmailHandler',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Messaging', InboundEmailHandler)

const InboundEmailResult = new Ast.ApexClass(
  'InboundEmailResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Messaging', InboundEmailResult)

const SingleEmailMessage = new Ast.ApexClass(
  'SingleEmailMessage',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Messaging', SingleEmailMessage)

const PushNotification = new Ast.ApexClass(
  'PushNotification',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Messaging', PushNotification)

const PushNotificationPayload = new Ast.ApexClass(
  'PushNotificationPayload',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Messaging', PushNotificationPayload)

module.exports = InboundEmail
