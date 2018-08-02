const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
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
  {},
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

