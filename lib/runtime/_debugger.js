const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const ClassStaticFields = require('../store/class-static-fields')
const EnvManager = require('../env-manager')
const createFieldNode = require('../helper/create-field-node')
const createMethodNode = require('../helper/create-method-node')

const Debugger = new Ast.ApexClass(
  '_Debugger',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    debug: [
      createMethodNode(
        'debug',
        ['public'],
        'void',
        [],
        () => {}
      )
    ],
  },
  {}
)
NameSpaceStore.registerClass('System', Debugger)

module.exports = Debugger
