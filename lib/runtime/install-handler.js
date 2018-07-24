const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../helper/create-method-node')

const InstallHandler = new ApexClass(
  'InstallHandler',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', InstallHandler);

module.exports = InstallHandler
