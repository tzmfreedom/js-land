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
  {
    put: [
      createMethodNode(
        'put',
        ['public'],
        'void',
        [
          ['String', 'fieldName'],
          ['Object', 'fieldValue'],
        ],
        () => {
        }
      )
    ]
  },
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
    new Ast.TypeNode(['SObject'], []),
    [],
    [],
    {
      Id: createFieldNode(
        'ID',
        ['public'],
        new Ast.NullNode()
      ),
      Name: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      Status: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      // User
      UserPermissionsChatterAnswersUser: createFieldNode(
        'Boolean',
        ['public'],
        new Ast.NullNode()
      ),
      Contact: createFieldNode(
        'Contact',
        ['public'],
        new Ast.NullNode()
      ),
      ProfileId: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      CommunityNickname: createFieldNode(
        'CommunityNickname',
        ['public'],
        new Ast.NullNode()
      ),
      CommunityNickname: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      Email: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      UserName: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      LastName: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      FirstName: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      // Account
      OwnerID: createFieldNode(
        'ID',
        ['public'],
        new Ast.NullNode()
      ),
      // Question
      Title: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      Body: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      CommunityId: createFieldNode(
        'ID',
        ['public'],
        new Ast.NullNode()
      ),
      Priority: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      // Case
      Subject: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      Description: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      Origin: createFieldNode(
        'String',
        ['public'],
        new Ast.NullNode()
      ),
      CommunityId: createFieldNode(
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
