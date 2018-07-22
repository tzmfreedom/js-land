const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../create-method-node')

const EncodingUtil = new ApexClass(
  'EncodingUtil',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    base64Encode: [
      createMethodNode(
        'base64Encode',
        ['public'],
        'String',
        [['Blob', 'inputBlob']],
        () => {
          const object = EnvManager.getValue('inputBlob')
          const base64string = object.value.toString('base64')
          return new Ast.StringNode(base64string)
        }
      )
    ],
    base64Decode: [
      createMethodNode(
        'base64Decode',
        ['public'],
        'Blob',
        [['String', 'inputString']],
        () => {
          const object = EnvManager.getValue('inputString')
          const buf = Buffer.from(object.value, 'base64')
          return new Ast.BlobNode(buf)
        }
      )
    ],
    convertFromHex: [
      createMethodNode(
        'convertFromHex',
        ['public'],
        'Blob',
        [['String', 'inputString']],
        () => {
          const object = EnvManager.getValue('inputString')
          const buf = Buffer.from(object.value, 'hex')
          return new Ast.BlobNode(buf)
        }
      )
    ],
    convertToHex: [
      createMethodNode(
        'convertToHex',
        ['public'],
        'String',
        [['Blob', 'inputBlob']],
        () => {
          const object = EnvManager.getValue('inputBlob')
          return new Ast.StringNode(object.value.toString('hex'))
        }
      )
    ],
    urlDecode: [
      createMethodNode(
        'urlDecode',
        ['public'],
        'String',
        [
          ['String', 'inputString'],
          ['String', 'encodingScheme'],
        ],
        () => {
          const object = EnvManager.getValue('inputString')
          return new Ast.StringNode(decodeURIComponent(object.value))
        }
      )
    ],
    urlEncode: [
      createMethodNode(
        'urlEncode',
        ['public'],
        'String',
        [
          ['String', 'inputString'],
          ['String', 'encodingScheme'],
        ],
        () => {
          const object = EnvManager.getValue('inputString')
          return new Ast.StringNode(encodeURIComponent(object.value))
        }
      )
    ],
  },
  []
);
NameSpaceStore.registerClass('System', EncodingUtil);

module.exports = EncodingUtil
