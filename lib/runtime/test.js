const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')
const ClassStaticFields = require('../store/class-static-fields')

const Test = new ApexClass(
  'Test',
  null,
  [],
  [],
  {},
  {
  },
  {},
  {
    clearApexPageMessages: [
      createMethodNode(
        'clearApexPageMessages',
        ['public'],
        'void',
        [],
        () => {
          ClassStaticFields.put(
            'ApexPages',
            new Ast.TypeNode(['']), 'ApexPageMessages', new Ast.NullNode()
          )
        }
      )
    ],
    createStub: [
      createMethodNode(
        'createStub',
        ['public'],
        'Object',
        [
          ['Type', 'parentType'],
          ['StubProvider', 'stubProvider']
        ],
        () => {
        }
      )
    ],
    enqueueBatchJobs: [
      createMethodNode(
        'enqueueBatchJobs',
        ['public'],
        new Ast.TypeNode(['List'], [new Ast.TypeNode(['Id'], [])]),
        [['Integer', 'numberOfJobs']],
        () => {
        }
      )
    ],
    getEventBus: [
      createMethodNode(
        'getEventBus',
        ['public'],
        ['EventBus', 'TestBroker'],
        [],
        () => {
        }
      )
    ],
    getFlexQueueOrder: [
      createMethodNode(
        'getFlexQueueOrder',
        ['public'],
        new Ast.TypeNode(['List'], [new Ast.TypeNode(['Id'], [])]),
        [],
        () => {
        }
      )
    ],
    getStandardPricebookId: [
      createMethodNode(
        'getStandardPricebookId',
        ['public'],
        'Id',
        [],
        () => {
        }
      )
    ],
    isRunningTest: [
      createMethodNode(
        'isRunningTest',
        ['public'],
        'Boolean',
        [],
        () => {
          return ClassStaticFields.get('Test', '_isRunningTest')
        }
      )
    ],
    invokeContinuationMethod: [
      createMethodNode(
        'invokeContinuationMethod',
        ['public'],
        'Object',
        [
          ['Object', 'controller'],
          ['Continuation', 'request']
        ],
        () => {
        }
      )
    ],
    loadData: [
      createMethodNode(
        'loadData',
        ['public'],
        new Ast.TypeNode(['List'], [new Ast.TypeNode(['sObject'], [])]),
        [
          [['Schema', 'SObjectType'], 'sObjectToken'],
          ['String', 'resourceName']
        ],
        () => {
        }
      )
    ],
    newSendEmailQuickActionDefaults: [
      createMethodNode(
        'newSendEmailQuickActionDefaults',
        ['public'],
        ['QuickAction', 'SendEmailQuickActionDefaults'],
        [
          ['Id', 'contextId'],
          ['Id', 'replyToId']
        ],
        () => {
        }
      )
    ],
    setContinuationResponse: [
      createMethodNode(
        'setContinuationResponse',
        ['public'],
        'void',
        [
          ['String', 'requestLabel'],
          ['HTTPResponse', 'mockResponse']
        ],
        () => {
        }
      )
    ],
    setCreatedDate: [
      createMethodNode(
        'setCreatedDate',
        ['public'],
        'void',
        [
          ['Id', 'recordId'],
          ['DateTime', 'createdDatetime']
        ],
        () => {
        }
      )
    ],
    setCurrentPage: [
      createMethodNode(
        'setCurrentPage',
        ['public'],
        'void',
        [['PageReference', 'page']],
        () => {
          const page = EnvManager.getValue('page')
          return ClassStaticFields.put('Test', 'public', '_isRunningTest', page)
        }
      )
    ],
    setCurrentPageReference: [
      createMethodNode(
        'setCurrentPageReference',
        ['public'],
        'void',
        [['PageReference', 'page']],
        () => {
          const page = EnvManager.getValue('page')
          return ClassStaticFields.put('Test', 'public', '_isRunningTest', page)
        }
      )
    ],
    setFixedSearchResults: [
      createMethodNode(
        'setFixedSearchResults',
        ['public'],
        'void',
        [
          [new Ast.TypeNode(['Array'], [new Ast.TypeNode(['Id'], [])]), 'fixedSearchResults']
        ],
        () => {
        }
      )
    ],
    setMock: [
      createMethodNode(
        'setMock',
        ['public'],
        'void',
        [
          ['Type', 'interfaceType'],
          ['Object', 'instance']
        ],
        () => {
        }
      )
    ],
    setReadOnlyApplicationMode: [
      createMethodNode(
        'setReadOnlyApplicationMode',
        ['public'],
        'void',
        [['Boolean', 'applicationMode']],
        () => {
        }
      )
    ],
    startTest: [
      createMethodNode(
        'startTest',
        ['public'],
        'void',
        [],
        () => {
          return ClassStaticFields.put('Test', 'public', '_isStartTest', new Ast.BooleanNode(true))
        }
      )
    ],
    stopTest: [
      createMethodNode(
        'stopTest',
        ['public'],
        'void',
        [],
        () => {
          return ClassStaticFields.put('Test', 'public', '_isStartTest', new Ast.BooleanNode(false))
        }
      )
    ],
    testInstall: [
      createMethodNode(
        'testInstall',
        ['public'],
        'void',
        [
          ['InstallHandler', 'installImplementation'],
          ['Version', 'version'],
          ['Boolean', 'isPush']
        ],
        () => {
        }
      )
    ]
  },
  []
)
NameSpaceStore.registerClass('System', Test)

module.exports = Test
