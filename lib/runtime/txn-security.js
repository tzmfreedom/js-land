const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('TxnSecurity')

const Event = new Ast.ApexClass(
  'Event',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('TxnSecurity', Event)

const PolicyCondition = new Ast.ApexClass(
  'PolicyCondition',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('TxnSecurity', PolicyCondition)
