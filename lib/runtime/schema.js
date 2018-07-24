const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('Schema');

const SObjectType = new ApexClass(
  'SObjectType',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('Schema', SObjectType);

module.exports = SObjectType
