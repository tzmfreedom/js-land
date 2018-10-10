const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('Reports')

const NotificationAction = new Ast.ApexClass(
  'NotificationAction',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Reports', NotificationAction)

const NotificationActionContext = new Ast.ApexClass(
  'NotificationActionContext',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Reports', NotificationActionContext)
