const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const createMethodNode = require('../create-method-node')

const ApexHttp = new ApexClass(
  'Http',
  null,
  [],
  [],
  {},
  {},
  {
    send: [
      createMethodNode(
        'send',
        ['public'],
        'HTTPResponse',
        [['HTTPRequest', 'request']],
        () => {
        }
      )
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('System', ApexHttp);

module.exports = ApexHttp
