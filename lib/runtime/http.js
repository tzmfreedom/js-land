const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

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
