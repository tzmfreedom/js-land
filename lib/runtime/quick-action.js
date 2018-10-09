const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('QuickAction')

const SendEmailQuickActionDefaults = new ApexClass(
  'SendEmailQuickActionDefaults',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)
NameSpaceStore.registerClass('QuickAction', SendEmailQuickActionDefaults)

module.exports = SendEmailQuickActionDefaults
