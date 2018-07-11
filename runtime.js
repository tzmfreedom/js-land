'use strict';

const LocalEnvironment = require('./localEnv');
const ApexClass        = require('./apexClass').ApexClass;
const NameSpaceStore   = require('./apexClass').NameSpaceStore;
const Ast              = require('./node/ast');

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
      a: new Ast.MethodDeclarationNode(
        'debug',
        [],
        new Ast.TypeNode(['void'], []),
        [
          new Ast.ParameterNode(
            [],
            new Ast.TypeNode('Object', []),
            'object'
          )
        ],
        [],
        [],
        () => {
          let object = LocalEnvironment.get('object');
          console.log(object.value);
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

const ApexList = new ApexClass(
  'List',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
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

const ApexDateTime = new ApexClass(
  'DateTime',
  null,
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexDateTime);

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
};
