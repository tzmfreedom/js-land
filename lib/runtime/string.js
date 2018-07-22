const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../create-method-node')

const ApexString = new ApexClass(
  'String',
  null,
  [],
  [],
  {},
  {},
  {
    abbreviate: [
      createMethodNode(
        'abbreviate',
        ['public'],
        'String',
        [
          ['Integer', 'maxWidth']
        ],
        () => {
          const thisReceiver = EnvManager.getValue('this')
          const maxWidth = EnvManager.getValue('maxWidth').value
          if (thisReceiver.value.length <= maxWidth) {
            return thisReceiver
          } else {
            return new Ast.StringNode(`${thisReceiver.value.substr(0, maxWidth)}...`)
          }
        }
      ),
      createMethodNode(
        'abbreviate',
        ['public'],
        'String',
        [
          ['Integer', 'maxWidth'],
          ['Integer', 'offset'],
        ],
        () => {
        }
      )
    ],
    capitalize: [
      createMethodNode(
        'capitalize',
        ['public'],
        'String',
        [],
        () => {
          const stringValue = EnvManager.getValue('this').value
          return new Ast.StringNode(stringValue[0].toUpperCase() + stringValue.slice(1))
        }
      )
    ],
    center: [
      createMethodNode(
        'center',
        ['public'],
        'String',
        [
          ['Integer', 'size']
        ],
        () => {
          const stringValue = EnvManager.getValue('this').value
          const size = EnvManager.getValue('size').value
          if (stringValue.length >= size) {
            return new Ast.StringNode(stringValue)
          } else {
            const paddingLeft = Math.floor((size - stringValue.length)/2)
            const paddingRight = size - paddingLeft
            return new Ast.StringNode(`${' '.repeat(paddingLeft)}${stringValue}${' '.repeat(paddingRight)}`)
          }
        }
      ),
      createMethodNode(
        'center',
        ['public'],
        'String',
        [
          ['Integer', 'size'],
          ['String', 'paddingString'],
        ],
        () => {
          const stringValue = EnvManager.getValue('this').value
          const size = EnvManager.getValue('size').value
          const paddingString = EnvManager.getValue('paddingString').value
          if (stringValue.length >= size) {
            return new Ast.StringNode(stringValue)
          } else {
            const paddingLeft = Math.floor((size - stringValue.length)/2)
            const paddingRight = size - stringValue.length - paddingLeft
            return new Ast.StringNode(`${paddingString.repeat(paddingLeft)}${stringValue}${paddingString.repeat(paddingRight)}`)
          }
        }
      ),
    ],
    charAt: [
      createMethodNode(
        'charAt',
        ['public'],
        'String',
        [
          ['Integer', 'index']
        ],
        () => {
          const stringValue = EnvManager.getValue('this').value
          const index = EnvManager.getValue('index').value
          return new Ast.StringNode(stringValue[index])
        }
      )
    ],
    codePointAt: [
      createMethodNode(
        'codePointAt',
        ['public'],
        'Integer',
        [
          ['Integer', 'index']
        ],
        () => {
          // TODO: サロゲートのテスト
          const stringValue = EnvManager.getValue('this').value
          const index = EnvManager.getValue('index').value
          return new Ast.StringNode(stringValue.charCodeAt(index))
        }
      )
    ],
    codePointBefore: [
      createMethodNode(
        'codePointBefore',
        ['public'],
        'Integer',
        [
          ['Integer', 'index']
        ],
        () => {
        }
      )
    ],
    codePointCount: [
      createMethodNode(
        'codePointCount',
        ['public'],
        'Integer',
        [
          ['Integer', 'beginIndex'],
          ['Integer', 'endIndex'],
        ],
        () => {
        }
      )
    ],
    compareTo: [
      createMethodNode(
        'compareTo',
        ['public'],
        'Integer',
        [
          ['String', 'secondString']
        ],
        () => {
        }
      )
    ],
    contains: [
      createMethodNode(
        'contains',
        ['public'],
        'Boolean',
        [
          ['String', 'substring']
        ],
        () => {
          const stringValue = EnvManager.getValue('this').value
          const subStringValue = EnvManager.getValue('substring').value
          return new Ast.BooleanNode(stringValue.includes(subStringValue))
        }
      )
    ],
    codePointBefore: [
      createMethodNode(
        'codePointBefore',
        ['public'],
        'Integer',
        [
          ['Integer', 'index']
        ],
        () => {
        }
      )
    ],
    codePointBefore: [
      createMethodNode(
        'codePointBefore',
        ['public'],
        'Integer',
        [
          ['Integer', 'index']
        ],
        () => {
        }
      )
    ],
    codePointBefore: [
      createMethodNode(
        'codePointBefore',
        ['public'],
        'Integer',
        [
          ['Integer', 'index']
        ],
        () => {
        }
      )
    ],
    codePointBefore: [
      createMethodNode(
        'codePointBefore',
        ['public'],
        'Integer',
        [
          ['Integer', 'index']
        ],
        () => {
        }
      )
    ],
    codePointBefore: [
      createMethodNode(
        'codePointBefore',
        ['public'],
        'Integer',
        [
          ['Integer', 'index']
        ],
        () => {
        }
      )
    ],
    codePointBefore: [
      createMethodNode(
        'codePointBefore',
        ['public'],
        'Integer',
        [
          ['Integer', 'index']
        ],
        () => {
        }
      )
    ],
    codePointBefore: [
      createMethodNode(
        'codePointBefore',
        ['public'],
        'Integer',
        [
          ['Integer', 'index']
        ],
        () => {
        }
      )
    ],
    toLowerCase: [
      createMethodNode(
        'toLowerCase',
        ['public'],
        'String',
        [],
        () => {
        }
      )
    ],
    indexOf: [
      createMethodNode(
        'indexOf',
        ['public'],
        'Integer',
        [['String', 'target']],
        () => {
        }
      )
    ],
  },
  {
    isBlank: [
      createMethodNode(
        'isBlank',
        ['public'],
        'Boolean',
        [['String', 'target']],
        () => {
        }
      )
    ],
  },
  []
);
NameSpaceStore.registerClass('System', ApexString);

module.exports = ApexString
