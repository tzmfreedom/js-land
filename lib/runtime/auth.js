const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createFieldNode = require('../helper/create-field-node')
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('Auth');

const RegistrationHandler = new ApexClass(
  'RegistrationHandler',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Auth', RegistrationHandler);

const UserData = new ApexClass(
  'UserData',
  null,
  [],
  [],
  {
    identifier: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    firstName: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    lastName: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    fullName: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    email: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    link: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    username: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    locale: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    provider: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    siteLoginUrl: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    attributeMap: createFieldNode(
      new Ast.TypeNode(
        ['Map'],
        [
          new Ast.TypeNode(['String'], []),
          new Ast.TypeNode(['String'], []),
        ],
      ),
      ['public'],
      new Ast.NullNode()
    ),
  },
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Auth', UserData);

const ConnectedAppPlugin = new ApexClass(
  'ConnectedAppPlugin',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Auth', ConnectedAppPlugin);

