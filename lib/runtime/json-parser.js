const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const EnvManager       = require('../env-manager')
const Ast              = require('../node/ast')
const createMethodNode = require('../helper/create-method-node')

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
