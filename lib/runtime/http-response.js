const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const createMethodNode = require('../create-method-node')

const ApexHTTPResponse = new ApexClass(
  'HTTPResponse',
  null,
  [],
  [],
  {},
  {},
  {
    getBody: [
      createMethodNode(
        'getBody',
        ['public'],
        'String',
        [],
        () => {
        }
      )
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('System', ApexHTTPResponse);

module.exports = ApexHTTPResponse
