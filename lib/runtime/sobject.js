const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore = require('../store/name-space-store')
const TypeStore        = require('../store/type-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const ApexSObject = new ApexClass(
  'SObject',
  null,
  [],
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

const sObjectNames = [
  'Account',
  'Contact',
]
sObjectNames.forEach((sObjectName) => {
  const sObject = new ApexClass(
    sObjectName,
    null,
    [],
    [],
    {},
    {},
    {},
    {},
    []
  )
  NameSpaceStore.registerClass('System', sObject);
})

const SObjectType = new Ast.TypeNode(
  ['SObject'],
  []
);
SObjectType.classNode = ApexSObject;
TypeStore.set('SObject', SObjectType);

module.exports = ApexSObject
