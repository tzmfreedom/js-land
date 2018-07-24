'use strict';

const ApexClass        = require('./node/apexClass').ApexClass;
const NameSpaceStore   = require('./store/name-space-store')
const Ast              = require('./node/ast');
const TypeStore = require('./store/type-store');
const EnvManager = require('./env-manager');
const createMethodNode = require('./helper/create-method-node')

NameSpaceStore.register('System');

const primitives = ['string', 'blob', 'boolean', 'integer', 'long', 'decimal', 'double', 'id', 'object']
primitives.forEach((file) => {
  require(`./runtime/${file}`)
})

const ApexArray = new ApexClass(
  'Array',
  null,
  [],
  [
    new Ast.MethodDeclarationNode(
      'Array',
      [],
      new Ast.TypeNode(['void'], []),
      [],
      [],
      null,
      () => {
        const obj = EnvManager.get('this').value;
        obj._records = [];
      }
    )
  ],
  {},
  {},
  {
    add: [
      new Ast.MethodDeclarationNode(
        'add',
        [],
        new Ast.TypeNode(['void'], []),
        [
          new Ast.ParameterNode(
            [],
            new Ast.TypeNode(['Object'], []),
            'value'
          ),
        ],
        [],
        null,
        () => {
          const obj = EnvManager.get('this').value;
          const value = EnvManager.get('value');
          obj._records.push(value);
        }
      )
    ],
    get: [
      new Ast.MethodDeclarationNode(
        'get',
        [],
        new Ast.TypeNode(['Object'], []),
        [
          new Ast.ParameterNode(
            [],
            new Ast.TypeNode(['Object'], []),
            'key'
          )
        ],
        [],
        null,
        () => {
          const obj = EnvManager.get('this').value;
          const keyNode = EnvManager.get('key').value;
          return obj._records[parseInt(keyNode.value)].value;
        }
      )
    ]
  },
  {},
  []
);
NameSpaceStore.registerClass('System', ApexArray);

const NullType = new Ast.TypeNode(
  ['void'],
  []
);
NullType.classNode = null;
TypeStore.set('Null', NullType);

const IntegerType = new Ast.TypeNode(
  ['Integer'],
  []
);
IntegerType.classNode = NameSpaceStore.get('System', 'Integer');
TypeStore.set('Integer', IntegerType);


const DoubleType = new Ast.TypeNode(
  ['Double'],
  []
);
DoubleType.classNode = NameSpaceStore.get('System', 'Double');
TypeStore.set('Double', DoubleType);

const StringType = new Ast.TypeNode(
  ['String'],
  []
);
StringType.classNode = NameSpaceStore.get('System', 'String');
TypeStore.set('String', StringType);

const BooleanType = new Ast.TypeNode(
  ['Boolean'],
  []
);
BooleanType.classNode = NameSpaceStore.get('System', 'Boolean');
TypeStore.set('Boolean', BooleanType);

const BlobType = new Ast.TypeNode(
  ['Blob'],
  []
);
BlobType.classNode = NameSpaceStore.get('System', 'Blob');
TypeStore.set('Blob', BlobType);

const VoidType = new Ast.TypeNode(
  ['void'],
  []
);
TypeStore.set('void', VoidType);

const ListType = new Ast.TypeNode(
  ['List'],
  []
);
ListType.classNode = NameSpaceStore.get('System', 'List');
TypeStore.set('List', ListType);

const ArrayType = new Ast.TypeNode(
  ['Array'],
  []
);
ArrayType.classNode = ApexArray;
TypeStore.set('Array', ArrayType);

module.exports = {
  Integer: NameSpaceStore.get('System', 'Integer'),
  Long: NameSpaceStore.get('System', 'Long'),
  Double: NameSpaceStore.get('System', 'Double'),
  ID: NameSpaceStore.get('System', 'ID'),
  String: NameSpaceStore.get('System', 'String'),
  Boolean: NameSpaceStore.get('System', 'Boolean'),
  NullType: NullType,
  TypeStore: TypeStore,
};
