const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const RestResponse = new ApexClass(
  'RestResponse',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('System', RestResponse)
