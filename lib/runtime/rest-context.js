const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const RestContext = new ApexClass(
  'RestContext',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('System', RestContext)
