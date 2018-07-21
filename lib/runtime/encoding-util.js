const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');

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
      new Ast.MethodDeclarationNode(
        'base64Encode',
        [new Ast.ModifierNode('public')],
        new Ast.TypeNode(['String'], []),
        [
          new Ast.ParameterNode(
            [],
            new Ast.TypeNode(['Blob'], []),
            'object'
          )
        ],
        [],
        null,
        () => {
          const object = EnvManager.get('object')
          const base64string = object.value.toString('base64')
          return new Ast.StringNode(base64string)
        }
      )
    ],
    base64Decode: [
      new Ast.MethodDeclarationNode(
        'base64Decode',
        [new Ast.ModifierNode('public')],
        new Ast.TypeNode(['Blob'], []),
        [
          new Ast.ParameterNode(
            [],
            new Ast.TypeNode(['String'], []),
            'object'
          )
        ],
        [],
        null,
        () => {
          const object = EnvManager.get('object')
          const buf = Buffer.from(object.value, 'base64')
          return new Ast.BlobNode(buf)
        }
      )
    ],
  },
  []
);
NameSpaceStore.registerClass('System', EncodingUtil);

module.exports = EncodingUtil
