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
]

function createSObject(filePath, objectName) {
  const meta = require(filePath)
  const fields = {}
  meta.fields.forEach((field) => {
    fields[field.name] = createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    )
  })

  const sObject = new ApexClass(
    objectName,
    new Ast.TypeNode(['SObject'], []),
    [],
    [],
    fields,
    {},
    {},
    {},
    []
  )
  sObject.valueFunction = ApexSObject.valueFunction
  NameSpaceStore.registerClass('System', sObject);
}

['account', 'user', 'contact'].forEach((objectName) => {
  createSObject(`../../${objectName}.meta.json`, objectName[0].toUpperCase() + objectName.slice(1))
})

const SObjectType = new Ast.TypeNode(
  ['SObject'],
  []
);
SObjectType.classNode = ApexSObject;
TypeStore.set('SObject', SObjectType);

module.exports = ApexSObject
