const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../create-method-node')

const ApexDouble = new ApexClass(
  'Double',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexDouble);

module.exports = ApexDouble
