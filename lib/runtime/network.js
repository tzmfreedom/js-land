const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const Network = new Ast.ApexClass(
  'Network',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    communitiesLanding: [
      createMethodNode(
        'communitiesLanding',
        ['public'],
        ['PageReference'],
        [],
        () => {
        }
      )
    ],
    forwardToAuthPage: [
      createMethodNode(
        'forwardToAuthPage',
        ['public'],
        ['PageReference'],
        [
          ['String', 'startURL']
        ],
        () => {
        }
      ),
      createMethodNode(
        'forwardToAuthPage',
        ['public'],
        ['PageReference'],
        [
          ['String', 'startURL'],
          ['String', 'displayType']
        ],
        () => {
        }
      )
    ]
  },
  {}
)
NameSpaceStore.registerClass('System', Network)

module.exports = Network
