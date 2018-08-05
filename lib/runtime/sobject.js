const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const TypeStore        = require('../store/type-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createFieldNode  = require('../helper/create-field-node')
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
  const keys = node.instanceFields.keys().map((fieldName) => {
    let field = node.instanceFields.get(fieldName);
    return `${fieldName} => ${field.value}`;
  });
  return `${node.type().classNode.name}: ${keys.join(', ')}`;
};
NameSpaceStore.registerClass('System', ApexSObject);

const sObjectNames = [
  'Account',
  'Contact',
  'Case',
  'CaseComment',
  'Opportunity',
  'Task',
  'Event',
  'Attachment',
  'AsyncApexJob',
  'User',
  'Profile',
  'Community',
  'Question',
  'AuthSession',
  'FeedItem',
  'TwoFactorInfo',
  'ContentVersion',
  'Dreamhouse_Settings__c',
  'Log__c',
  'MixiConfig__c',
  'Property__c',
  'Favorite__c',
  'LoginMaster__c',
  'TestObject__c',
  'TwitterConfig__c',
  'Customer__c',
]
sObjectNames.forEach((sObjectName) => {
  const sObject = new ApexClass(
    sObjectName,
    ApexSObject,
    [],
    [],
    {
      Id: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      Name: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
    },
    {},
    {},
    {},
    []
  )
  sObject.valueFunction = ApexSObject.valueFunction
  NameSpaceStore.registerClass('System', sObject);
})

const SObjectType = new Ast.TypeNode(
  ['SObject'],
  []
);
SObjectType.classNode = ApexSObject;
TypeStore.set('SObject', SObjectType);

module.exports = ApexSObject
