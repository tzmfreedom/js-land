const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const EnvManager       = require('../env-manager')
const Ast              = require('../node/ast')
const createMethodNode = require('../create-method-node')

const JSONParser = new ApexClass(
  'JSONParser',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', JSONParser);

module.exports = JSONParser
