const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('Flow')

const Interview = new Ast.ApexClass(
  'Interview',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {
    CreateRecord: new Ast.ApexClass(
      'CreateRecord',
      null,
      [],
      [],
      {},
      {},
      {},
      {},
      {

      }
    )
  }
)
NameSpaceStore.registerClass('Flow', Interview)
