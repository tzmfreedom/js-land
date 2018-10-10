const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const ClassStaticFields = require('../store/class-static-fields')
const EnvManager = require('../env-manager')
const createFieldNode = require('../helper/create-field-node')
const createMethodNode = require('../helper/create-method-node')

const ApexPages = new Ast.ApexClass(
  'ApexPages',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    addMessage: [
      createMethodNode(
        'addMessage',
        ['public'],
        'void',
        [
          [['ApexPages', 'Message'], 'message']
        ],
        () => {
          const message = EnvManager.getValue('message')
          const messages = ClassStaticFields.get('ApexPages', '_message')
          messages.push(message)
        }
      )
    ],
    addMessages: [
      createMethodNode(
        'addMessages',
        ['public'],
        'void',
        [
          ['Exception', 'exceptionThrown']
        ],
        () => {
          const message = EnvManager.getValue('Message')
          const messages = ClassStaticFields.get('ApexPages', '_message')
          messages.push(message.instanceFields.message)
        }
      )
    ],
    currentPage: [
      createMethodNode(
        'currentPage',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    hasMessages: [
      createMethodNode(
        'hasMessages',
        ['public'],
        'Boolean',
        [],
        () => {
          const messages = ClassStaticFields.get('ApexPages', '_message')
          return new Ast.BooleanNode(messages._records.length > 0)
        }
      ),
      createMethodNode(
        'hasMessages',
        ['public'],
        'Boolean',
        [
          [['ApexPages', 'Severity'], 'severity']
        ],
        () => {
          const severity = EnvManager.getValue('severity')
          const messages = ClassStaticFields.get('ApexPages', '_message')
          const hasMessages = messages._records.some((record) => {
            record.instanceFields.severity.value == severity.value
          })
          return new Ast.BooleanNode(hasMessages)
        }
      )
    ],
    getMessages: [
      createMethodNode(
        'getMessages',
        ['public'],
        new Ast.TypeNode(
          ['List'],
          [
            new Ast.TypeNode(['ApexPages', 'Message'], [])
          ]
        ),
        [],
        () => {
          return ClassStaticFields.get('ApexPages', '_message')
        }
      )
    ]
  },
  {}
)
NameSpaceStore.registerClass('System', ApexPages)

NameSpaceStore.register('ApexPages')

const Message = new Ast.ApexClass(
  'Message',
  null,
  [],
  [],
  {},
  {},
  {
    getComponentLabel: [
      createMethodNode(
        'getComponentLabel',
        ['public'],
        'String',
        [],
        () => {
          const object = EnvManager.getValue('this')
          return object.instanceFields.get('_componentLabel')
        }
      )
    ],
    getDetail: [
      createMethodNode(
        'getDetail',
        ['public'],
        'String',
        [],
        () => {
          const object = EnvManager.getValue('this')
          return object.instanceFields.get('_detail')
        }
      )
    ],
    getSeverity: [
      createMethodNode(
        'getSeverity',
        ['public'],
        ['ApexPages', 'Severity'],
        [],
        () => {
          const object = EnvManager.getValue('this')
          return object.instanceFields.get('_severity')
        }
      )
    ],
    getSummary: [
      createMethodNode(
        'getSummary',
        ['public'],
        'String',
        [],
        () => {
          const object = EnvManager.getValue('this')
          return object.instanceFields.get('_summary')
        }
      )
    ]
  },
  {},
  {}
)
NameSpaceStore.registerClass('ApexPages', Message)

const Severity = new Ast.ApexClass(
  'Severity',
  null,
  [],
  [],
  {},
  {
    CONFIRM: createFieldNode(
      ['ApexPages', 'Severity'],
      ['public'],
      new Ast.NullNode()
    ),
    INFO: createFieldNode(
      ['ApexPages', 'Severity'],
      ['public'],
      new Ast.NullNode()
    ),
    WARNING: createFieldNode(
      ['ApexPages', 'Severity'],
      ['public'],
      new Ast.NullNode()
    ),
    ERROR: createFieldNode(
      ['ApexPages', 'Severity'],
      ['public'],
      new Ast.NullNode()
    ),
    FATAL: createFieldNode(
      ['ApexPages', 'Severity'],
      ['public'],
      new Ast.NullNode()
    )
  },
  {},
  {},
  []
)
NameSpaceStore.registerClass('ApexPages', Severity)

const StandardController = new Ast.ApexClass(
  'StandardController',
  null,
  [],
  [],
  {},
  {},
  {
    addFields: [
      createMethodNode(
        'addFields',
        ['public'],
        'void',
        [
          [new Ast.TypeNode(['List'], [new Ast.TypeNode(['String'], [])]), 'fieldNames']
        ],
        () => {
          const fieldNames = EnvManager.getValue('fieldNames')
          return object.instanceFields.get('_summary')
        }
      )
    ],
    cancel: [
      createMethodNode(
        'cancel',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    delete: [
      createMethodNode(
        'delete',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    edit: [
      createMethodNode(
        'edit',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    getId: [
      createMethodNode(
        'getId',
        ['public'],
        'String',
        [],
        () => {
        }
      )
    ],
    getRecord: [
      createMethodNode(
        'getRecord',
        ['public'],
        'sObject',
        [],
        () => {
        }
      )
    ],
    reset: [
      createMethodNode(
        'reset',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    save: [
      createMethodNode(
        'save',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    view: [
      createMethodNode(
        'view',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ]
  },
  []
)
NameSpaceStore.registerClass('ApexPages', StandardController)

const StandardSetController = new Ast.ApexClass(
  'StandardSetController',
  null,
  [],
  [],
  {},
  {},
  {
    addFields: [
      createMethodNode(
        'addFields',
        ['public'],
        'void',
        [
          [new Ast.TypeNode(['List'], [new Ast.TypeNode(['String'], [])]), 'fieldNames']
        ],
        () => {
          const fieldNames = EnvManager.getValue('fieldNames')
          return object.instanceFields.get('_summary')
        }
      )
    ],
    cancel: [
      createMethodNode(
        'cancel',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    delete: [
      createMethodNode(
        'delete',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    edit: [
      createMethodNode(
        'edit',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    getId: [
      createMethodNode(
        'getId',
        ['public'],
        'String',
        [],
        () => {
        }
      )
    ],
    getRecord: [
      createMethodNode(
        'getRecord',
        ['public'],
        'sObject',
        [],
        () => {
        }
      )
    ],
    reset: [
      createMethodNode(
        'reset',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    save: [
      createMethodNode(
        'save',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ],
    view: [
      createMethodNode(
        'view',
        ['public'],
        'PageReference',
        [],
        () => {
        }
      )
    ]
  },
  []
)

NameSpaceStore.registerClass('ApexPages', StandardSetController)

module.exports = StandardController
