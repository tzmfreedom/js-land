const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
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
        }
      )
    ],
  },
  []
);
NameSpaceStore.registerClass('System', URL)

module.exports = URL
