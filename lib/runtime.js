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

const ApexSystem = new ApexClass(
  'System',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    debug: [
      new Ast.MethodDeclarationNode(
        'debug',
        [new Ast.ModifierNode('public')],
        new Ast.TypeNode(['void'], []),
        [
          new Ast.ParameterNode(
            [],
            new Ast.TypeNode(['Object'], []),
            'object'
          )
        ],
        [],
        null,
        () => {
          let object = EnvManager.get('object');
          console.log(object.val());
        }
      )
    ]
  },
  []
);
NameSpaceStore.registerClass('System', ApexSystem);

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

const ApexList = new ApexClass(
  'List',
  null,
  [],
  [
    new Ast.MethodDeclarationNode(
      'List',
      [],
      new Ast.TypeNode(['void'], []),
      [],
      [],
      null,
      () => {
        const obj = EnvManager.get('this').value;
        obj._records = [];
        obj._idx = 0;
      }
    )
  ],
  {},
  {},
  {
    hasNext: [
      new Ast.MethodDeclarationNode(
        'hasNext',
        [new Ast.ModifierNode('public')],
        new Ast.TypeNode(['Boolean'], []),
        [],
        [],
        null,
        () => {
          const obj = EnvManager.get('this').value;
          return new Ast.BooleanNode(obj._idx < obj._records.length);
        }
      )
    ],
    next: [
      new Ast.MethodDeclarationNode(
        'next',
        [new Ast.ModifierNode('public')],
        new Ast.TypeNode(['Object'], []),
        [],
        [],
        null,
        () => {
          const obj = EnvManager.get('this').value;
          const record = obj._records[obj._idx];
          obj._idx++;
          return record;
        }
      )
    ],
    add: [
      new Ast.MethodDeclarationNode(
        'add',
        [new Ast.ModifierNode('public')],
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
        [new Ast.ModifierNode('public')],
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
ApexList.valueFunction = (node) => {
  const messages = node._records.map((record) => {
    return `  ${record.val()}`;
  });
  return `List\n${messages.join('\n')}`;
};
NameSpaceStore.registerClass('System', ApexList);

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
ListType.classNode = ApexList;
TypeStore.set('List', ListType);

const ArrayType = new Ast.TypeNode(
  ['Array'],
  []
);
ArrayType.classNode = ApexArray;
TypeStore.set('Array', ArrayType);

module.exports = {
  System: ApexSystem,
  Integer: ApexInteger,
  Double: ApexDouble,
  Long: ApexLong,
  ID: ApexID,
  String: NameSpaceStore.get('System', 'String'),
  Boolean: ApexBoolean,
  Object: ApexObject,
  List: ApexList,
  NullType: NullType,
  TypeStore: TypeStore,
};
