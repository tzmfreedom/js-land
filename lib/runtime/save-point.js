const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

const SavePoint = new Ast.ApexClass(
  'SavePoint',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)
NameSpaceStore.registerClass('System', SavePoint)

module.exports = SavePoint
