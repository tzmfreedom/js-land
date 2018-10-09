const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const EnvManager = require('../env-manager')
const Ast = require('../node/ast')
const createMethodNode = require('../helper/create-method-node')

const ApexList = new ApexClass(
  'List',
  null,
  [],
  [
    new Ast.MethodDeclarationNode(
      'List',
      [],
      new Ast.TypeNode(['void'], []),
      [],
      [],
      null,
      () => {
        const obj = EnvManager.get('this').value
        obj._records = []
        obj._idx = 0
      }
    )
  ],
  {},
  {},
  {
    hasNext: [
      createMethodNode(
        'hasNext',
        ['public'],
        'Boolean',
        [],
        () => {
          const obj = EnvManager.getValue('this')
          return new Ast.BooleanNode(obj._idx < obj._records.length)
        }
      )
    ],
    next: [
      createMethodNode(
        'next',
        ['public'],
        'Object',
        [],
        () => {
          const obj = EnvManager.getValue('this')
          const record = obj._records[obj._idx]
          obj._idx++
          return record
        }
      )
    ],
    add: [
      createMethodNode(
        'add',
        ['public'],
        'void',
        [['Object', 'value']],
        () => {
          const obj = EnvManager.getValue('this')
          const value = EnvManager.getValue('value')
          obj._records.push(value)
        }
      )
    ],
    get: [
      createMethodNode(
        'get',
        ['public'],
        'Object',
        [['Object', 'key']],
        () => {
          const obj = EnvManager.getValue('this')
          const keyNode = EnvManager.getValue('key')
          return obj._records[parseInt(keyNode.value)]
        }
      )
    ],
    size: [
      createMethodNode(
        'size',
        ['public'],
        'Integer',
        [],
        () => {
        }
      )
    ],
    isEmpty: [
      createMethodNode(
        'isEmpty',
        ['public'],
        'Boolean',
        [],
        () => {
        }
      )
    ]
  },
  {},
  []
)
ApexList.valueFunction = (node) => {
  const messages = node._records.map((record) => {
    if (record.val) {
      return `  ${record.val()}`
    } else {
      return `  ${record.value}`
    }
  })
  return `List\n${messages.join('\n')}`
}
NameSpaceStore.registerClass('System', ApexList)

module.exports = ApexList
