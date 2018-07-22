const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const EnvManager       = require('../env-manager')
const ClassStaticFields = require('../class-static-fields')
const createMethodNode = require('../create-method-node')

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
          return thisReciever.instanceFields['_original']
        }
      )
    ],
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
    ],
  },
  []
);
NameSpaceStore.registerClass('System', URL)

module.exports = URL
