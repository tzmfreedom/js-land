const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const EnvManager = require('../env-manager')
const ClassStaticFields = require('../store/class-static-fields')
const createMethodNode = require('../helper/create-method-node')

const URL = new ApexClass(
  'URL',
  null,
  [],
  [],
  {},
  {},
  {
    toExternalForm: [
      createMethodNode(
        'toExternalForm',
        ['public'],
        'String',
        [],
        () => {
          const thisReceiver = EnvManager.getValue('this')
          return thisReciever.instanceFields.get('_original')
        }
      )
    ]
  },
  {
    getSalesforceBaseUrl: [
      createMethodNode(
        'getSalesforceBaseUrl',
        ['public'],
        'URL',
        [],
        () => {
          return ClassStaticFields.get('Test', '_salesforceBaseUrl')
        }
      )
    ]
  },
  []
)
NameSpaceStore.registerClass('System', URL)

module.exports = URL
