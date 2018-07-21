'use strict';

const ApexClass        = require('./node/apexClass').ApexClass;
const NameSpaceStore   = require('./node/apexClass').NameSpaceStore;
const Ast              = require('./node/ast');
const TypeStore = require('./type-store');
const EnvManager = require('./env-manager');
const createMethodNode = require('./create-method-node')

NameSpaceStore.register('System');

const primitives = ['string']
primitives.forEach((file) => {
  require(`./runtime/${file}`)
})

const ApexInteger = new ApexClass(
  'Integer',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexInteger);

const ApexDouble = new ApexClass(
  'Double',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexDouble);

const ApexBoolean = new ApexClass(
  'Boolean',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexBoolean);

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


const ApexLong = new ApexClass(
  'Long',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexLong);

const ApexDecimal = new ApexClass(
  'Decimal',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexDecimal);

const ApexID = new ApexClass(
  'ID',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexID);

const ApexObject = new ApexClass(
  'Object',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexObject);

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
IntegerType.classNode = ApexInteger;
TypeStore.set('Integer', IntegerType);


const DoubleType = new Ast.TypeNode(
  ['Double'],
  []
);
DoubleType.classNode = ApexDouble;
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
  Integer: ApexInteger,
  Double: ApexDouble,
  Long: ApexLong,
  ID: ApexID,
  String: NameSpaceStore.get('System', 'String'),
  Boolean: ApexBoolean,
  Object: ApexObject,
  NullType: NullType,
  TypeStore: TypeStore,
};
