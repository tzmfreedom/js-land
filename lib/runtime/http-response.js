const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

const ApexHTTPResponse = new ApexClass(
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
