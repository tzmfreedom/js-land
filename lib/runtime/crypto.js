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
    decrypt: [
      createMethodNode(
        'decrypt',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'privateKey'],
          ['Blob', 'initializationVector'],
          ['Blob', 'cipherText'],
        ],
        () => {
        }
      )
    ],
    decryptWithManagedIV: [
      createMethodNode(
        'decryptWithManagedIV',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'privateKey'],
          ['Blob', 'IVAndCipherText'],
        ],
        () => {
        }
      )
    ],
    encrypt: [
      createMethodNode(
        'encrypt',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'privateKey'],
          ['Blob', 'initializationVector'],
          ['Blob', 'clearText']
        ],
        () => {
        }
      )
    ],
    encryptWithManagedIV: [
      createMethodNode(
        'encryptWithManagedIV',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'privateKey'],
          ['Blob', 'clearText']
        ],
        () => {
        }
      )
    ],
    generateAesKey: [
      createMethodNode(
        'generateAesKey',
        ['public'],
        'Blob',
        [
          ['Integer', 'size'],
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
    getRandomInteger: [
      createMethodNode(
        'getRandomInteger',
        ['public'],
        'Integer',
        [],
        () => {
        }
      )
    ],
    getRandomLong: [
      createMethodNode(
        'getRandomLong',
        ['public'],
        'Long',
        [],
        () => {
        }
      )
    ],
    sign: [
      createMethodNode(
        'sign',
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
    signWithCertificate: [
      createMethodNode(
        'signWithCertificate',
        ['public'],
        'Blob',
        [
          ['String', 'algorithmName'],
          ['Blob', 'input'],
          ['String', 'certDevName']
        ],
        () => {
        }
      )
    ],

    signXML: [
      createMethodNode(
        'signXML',
        ['public'],
        'void',
        [
          ['String', 'algorithmName'],
          [['Dom', 'XmlNode'], 'node'],
          ['String', 'idAttributeName'],
          ['String', 'certDevName'],
        ],
        () => {
        }
      ),
      createMethodNode(
        'signXML',
        ['public'],
        'void',
        [
          ['String', 'algorithmName'],
          [['Dom', 'XmlNode'], 'node'],
          ['String', 'idAttributeName'],
          ['String', 'certDevName'],
          [['Dom', 'XmlNode'], 'refChild'],
        ],
        () => {
        }
      ),
    ],
  },
  []
);
NameSpaceStore.registerClass('System', Crypto);

module.exports = Crypto
