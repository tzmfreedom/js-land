const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const createMethodNode = require('../create-method-node')

const Crypto = new ApexClass(
  'Crypto',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    generateMac: [
      createMethodNode(
        'generateMac',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'input'],
          ['Blob', 'privateKey']
        ],
        () => {
        }
      )
    ],
    generateDigest: [
      createMethodNode(
        'generateDigest',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'input'],
        ],
        () => {
        }
      )
    ],
  },
  []
);
NameSpaceStore.registerClass('System', Crypto);

module.exports = Crypto
