const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const createFieldNode  = require('../helper/create-field-node')
const createMethodNode = require('../helper/create-method-node')

const SoqlResult = new ApexClass(
  '_SoqlResult',
  null,
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
  {}
);
NameSpaceStore.registerClass('System', SoqlResult);

module.exports = SoqlResult
