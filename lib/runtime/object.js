const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

const ApexObject = new ApexClass(
  'Object',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    // for insert(), update() method
    insert: [
      createMethodNode(
        'insert',
        ['public'],
        'void',
        [
          ['Object', 'recordToInsert']
        ],
        [],
        null,
        () => {
        }
      )
    ],
    update: [
      createMethodNode(
        'update',
        ['public'],
        'void',
        [
          ['Object', 'recordToUpdate']
        ],
        [],
        null,
        () => {
        }
      )
    ]
  },
  []
)
NameSpaceStore.registerClass('System', ApexObject)

module.exports = ApexObject
