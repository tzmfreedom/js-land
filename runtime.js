'use strict';

const ApexClass        = require('./apexClass').ApexClass;
const NameSpaceStore   = require('./apexClass').NameSpaceStore;
const Ast              = require('./node/ast');
const TypeStore = require('./type_store');
const EnvManager = require('./envManager');

NameSpaceStore.register('System');

const ApexSystem = new ApexClass(
  'System',
  null,
  [],
  {},
  {},
  {},
  {},
  {
    debug: {
      'args:Object': new Ast.MethodDeclarationNode(
        'debug',
        [],
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
    }
  },
  []
);
NameSpaceStore.registerClass('System', ApexSystem);

const ApexString = new ApexClass(
  'String',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexString);

const ApexInteger = new ApexClass(
  'Integer',
  null,
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
  {
    'args:': new Ast.MethodDeclarationNode(
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
  },
  {},
  {},
  {
    add: {
      'args:Object': new Ast.MethodDeclarationNode(
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
    },
    get: {
      'args:Object': new Ast.MethodDeclarationNode(
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
    }
  },
  []
);
NameSpaceStore.registerClass('System', ApexArray);

const ApexList = new ApexClass(
  'List',
  null,
  [],
  {
    'args:': new Ast.MethodDeclarationNode(
      'List',
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
  },
  {},
  {},
  {
    add: {
      'args:Object': new Ast.MethodDeclarationNode(
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
    },
    get: {
      'args:Object': new Ast.MethodDeclarationNode(
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
    }
  },
  []
);
ApexList.valueFunction = (node) => {
  const messages = node._records.map((record) => {
    return `  ${record.val()}`;
  });
  console.log(`List\n${messages.join('\n')}`);
};
NameSpaceStore.registerClass('System', ApexList);

const ApexLong = new ApexClass(
  'Long',
  null,
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
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexDecimal);

const ApexDate = new ApexClass(
  'Date',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexDate);

const ApexBlob = new ApexClass(
  'Blob',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexBlob);

const ApexID = new ApexClass(
  'ID',
  null,
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
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexObject);

const ApexTime = new ApexClass(
  'Time',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexTime);

const ApexMap = new ApexClass(
  'Map',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexMap);

const ApexHttpRequest = new ApexClass(
  'HttpRequest',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexHttpRequest);

const ApexHTTPResponse = new ApexClass(
  'HTTPResponse',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexHTTPResponse);

const ApexXmlStreamWriter = new ApexClass(
  'Xmlstreamwriter',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexXmlStreamWriter);

const ApexXmlStreamReader = new ApexClass(
  'Xmlstreamreader',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexXmlStreamReader);

const ApexPageReference = new ApexClass(
  'PageReference',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexPageReference);

const ApexHttp = new ApexClass(
  'Http',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexHttp);

const ApexSObject = new ApexClass(
  'SObject',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
ApexSObject.valueFunction = (node) => {
  const keys = Object.keys(node.instanceFields).map((fieldName) => {
    let field = node.instanceFields[fieldName];
    return `${fieldName} => ${field.value}`;
  });
  return `${node.type().classNode.name}: ${keys.join(', ')}`;
};
NameSpaceStore.registerClass('System', ApexSObject);

const ApexDateTime = new ApexClass(
  'DateTime',
  null,
  [],
  {},
  {},
  {},
  {},
  {
    now: {
      a: new Ast.MethodDeclarationNode(
        'now',
        [],
        new Ast.TypeNode(['DateTime'], []),
        [],
        [],
        null,
        () => {
          let obj = new ApexObject();
          obj.classNode = ApexDateTime;
          obj.value = Date.now();
          return obj;
        }
      )
    }
  },
  []
);
NameSpaceStore.registerClass('System', ApexDateTime);

const NullType = new Ast.TypeNode(
  ['Null'],
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
StringType.classNode = ApexString;
TypeStore.set('String', StringType);

const BooleanType = new Ast.TypeNode(
  ['Boolean'],
  []
);
BooleanType.classNode = ApexBoolean;
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

const SObjectType = new Ast.TypeNode(
  ['SObject'],
  []
);
SObjectType.classNode = ApexSObject;
TypeStore.set('SObject', SObjectType);

module.exports = {
  System: ApexSystem,
  Integer: ApexInteger,
  Double: ApexDouble,
  Long: ApexLong,
  ID: ApexID,
  String: ApexString,
  Boolean: ApexBoolean,
  Date: ApexDate,
  DateTime: ApexDateTime,
  Time: ApexTime,
  Blob: ApexBlob,
  Object: ApexObject,
  SObject: ApexSObject,
  List: ApexList,
  TypeStore: TypeStore,
};