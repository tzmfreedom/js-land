const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../create-method-node')

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
