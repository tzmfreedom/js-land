const Ast = require('../node/ast')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

const ApexHTTPResponse = new Ast.ApexClass(
  'HTTPResponse',
  null,
  [],
  [],
  {},
  {},
  {
    getBody: [
      createMethodNode(
        'getBody',
        ['public'],
        'String',
        [],
        () => {
        }
      )
    ]
  },
  {},
  []
)
NameSpaceStore.registerClass('System', ApexHTTPResponse)

module.exports = ApexHTTPResponse
