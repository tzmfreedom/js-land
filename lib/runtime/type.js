const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')
const CaseIgnoredStore = require('../store/case-ignored-store')
const ApexClassStore = require('../store/apex-class-store')

const Type = new Ast.ApexClass(
  'Type',
  null,
  [],
  [],
  {},
  {},
  {
    getName: [
      createMethodNode(
        'getName',
        ['public'],
        'String',
        [],
        () => {
          const object = EnvManager.getValue('this')
          return new Ast.StringNode(object.instanceFields.get('name'))
        }
      )
    ],
    toString: [
      createMethodNode(
        'toString',
        ['public'],
        'String',
        [],
        () => {
          const object = EnvManager.getValue('this')
          return new Ast.StringNode(object.instanceFields.get('name'))
        }
      )
    ],
    hashCode: [
      createMethodNode(
        'hashCode',
        ['public'],
        'String',
        [],
        () => {
          const object = EnvManager.getValue('this')
          let hashCode = 0
          const typename = object.instanceFields.get('name')
          for (let i = 0; i < typename.length; i++) {
            hashCode += typename[i] * 31 ^ (typename.length - i - 1)
          }
          return new Ast.IntegerNode(hashCode)
        }
      )
    ],
    newInstance: [
      createMethodNode(
        'newInstance',
        ['public'],
        'Object',
        [],
        () => {
          const thisObject = EnvManager.getValue('this')
          const typeName = thisObject.instanceFields.get('_type').value
          const newObject = new Ast.ApexObjectNode()
          newObject.classType = new Ast.TypeNode([typeName], [])
          newObject.classType.classNode = ApexClassStore.get(typeName)
          return newObject
        }
      )
    ]
  },
  {
    forName: [
      createMethodNode(
        'forName',
        ['public'],
        'Type',
        [
          ['String', 'fullyQualifiedName']
        ],
        () => {
          const fullyQualifiedName = EnvManager.getValue('fullyQualifiedName')
          const typeObject = new Ast.ApexObjectNode()
          typeObject.classType = new Ast.TypeNode(['Type'], [])
          typeObject.classType.classNode = NameSpaceStore.get('System', 'Type')
          typeObject.instanceFields = new CaseIgnoredStore()
          typeObject.instanceFields.set('_type', fullyQualifiedName)
          return typeObject
        }
      )
    ]
  },
  []
)
NameSpaceStore.registerClass('System', Type)

module.exports = Type
