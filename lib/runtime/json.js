const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const EnvManager       = require('../env-manager')
const Ast              = require('../node/ast')
const createMethodNode = require('../helper/create-method-node')
const CaseIgnoredStore = require('../store/case-ignored-store')

const ApexJSON = new ApexClass(
  'JSON',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    createGenerator: [
      createMethodNode(
        'createGenerator',
        ['public'],
        'JSONGenerator',
        [
          ['Boolean', 'prettyPrint'],
        ],
        () => {
        }
      )
    ],
    createParser: [
      createMethodNode(
        'createParser',
        ['public'],
        'JSONParser',
        [
          ['String', 'jsonString'],
        ],
        () => {
        }
      )
    ],
    deserialize: [
      createMethodNode(
        'deserialize',
        ['public'],
        'Object',
        [
          ['String', 'jsonString'],
          ['Type', 'apexType'],
        ],
        () => {
        }
      )
    ],
    deserializeStrict: [
      createMethodNode(
        'deserializeStrict',
        ['public'],
        'Object',
        [
          ['String', 'jsonString'],
          ['Type', 'apexType'],
        ],
        () => {
        }
      )
    ],
    deserializeUntyped: [
      createMethodNode(
        'deserializeUntyped',
        ['public'],
        'Object',
        [['String', 'jsonString']],
        () => {
          const walkObject = (object) => {
            if (typeof object === 'string') return new Ast.StringNode(object)
            if (typeof object === 'number') return new Ast.IntegerNode(object)
            if (typeof object === 'boolean') return new Ast.BooleanNode(object)
            if (object == null) return new Ast.NullNode()

            const mapObject = new Ast.ApexObjectNode();
            mapObject.classType = new Ast.TypeNode(
              ['Map'],
              [
                new Ast.TypeNode(['String'], []),
                new Ast.TypeNode(['Object'], []),
              ]
            );
            mapObject.classType.classNode = NameSpaceStore.get('System', 'Map')
            mapObject.instanceFields = new CaseIgnoredStore()
            const records = {}
            Object.keys(object).forEach((key) => {
              records[key] = walkObject(object[key])
            })
            mapObject._records = records
            return mapObject
          }
          const thisReceiver = EnvManager.getValue('jsonString')
          const object = JSON.parse(thisReceiver.value)
          return walkObject(object)
        }
      )
    ],
    serialize: [
      createMethodNode(
        'serialize',
        ['public'],
        'String',
        [
          ['Object', 'objectToSerialize'],
        ],
        () => {
        }
      ),
      createMethodNode(
        'serialize',
        ['public'],
        'String',
        [
          ['Object', 'objectToSerialize'],
          ['Boolean', 'suppressApexObjectNulls'],
        ],
        () => {
        }
      ),
    ],
    serializePretty: [
      createMethodNode(
        'serializePretty',
        ['public'],
        'String',
        [
          ['Object', 'objectToSerialize'],
        ],
        () => {
        }
      ),
      createMethodNode(
        'serializePretty',
        ['public'],
        'String',
        [
          ['Object', 'objectToSerialize'],
          ['Boolean', 'suppressApexObjectNulls'],
        ],
        () => {
        }
      )
    ],
  },
  []
);
NameSpaceStore.registerClass('System', ApexJSON);

module.exports = ApexJSON
