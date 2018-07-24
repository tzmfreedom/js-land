const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../helper/create-method-node')

const Type = new ApexClass(
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
          let object = EnvManager.getValue('this')
          return new Ast.StringNode(object.instanceFields['name'])
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
          let object = EnvManager.getValue('this')
          return new Ast.StringNode(object.instanceFields['name'])
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
          let object = EnvManager.getValue('this')
          let hashCode = 0;
          const typename = object.instanceFields['name']
          for (let i = 0; i < typename.length; i++) {
            hashCode += typename[i] * 31^(typename.length-i-1)
          }
          return new Ast.IntegerNode(hashCode)
        }
      )
    ],
    newInstance: [
      createMethodNode(
        'hashCode',
        ['public'],
        'String',
        [],
        () => {
          let object = EnvManager.getValue('this')
          const typename = object.instanceFields['name']
          const newObject = new Ast.ApexObjectNode()
          return newObject
        }
      )
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('System', Type);

module.exports = Type
