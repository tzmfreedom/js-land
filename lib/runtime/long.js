const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const ApexLong = new ApexClass(
  'Long',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)
NameSpaceStore.registerClass('System', ApexLong)

module.exports = ApexLong
