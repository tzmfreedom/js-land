const Ast = require('../node/ast')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

const ApexHttp = new Ast.ApexClass(
  'Http',
  null,
  [],
  [],
  {},
  {},
  {
    send: [
      createMethodNode(
        'send',
        ['public'],
        'HTTPResponse',
        [['HTTPRequest', 'request']],
        () => {
        }
      )
    ]
  },
  {},
  []
)
NameSpaceStore.registerClass('System', ApexHttp)

module.exports = ApexHttp
