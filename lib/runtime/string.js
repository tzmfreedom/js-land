const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

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
          // pass
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
          // pass
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
          const thisReceiverString = EnvManager.getValue('this').value
          const secondString = EnvManager.getValue('secondString').value
          const returnValue= (() => {
            if (thisReceiverString === secondString) {
              return 0
            } else if (thisReceiverString < secondString) {
              return -1
            } else {
              return 1
            }
          })();
          return new Ast.IntegerNode(returnValue)
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
    containsAny: [
      createMethodNode(
        'containsAny',
        ['public'],
        'Boolean',
        [
          ['String', 'inputString']
        ],
        () => {
          const thisReceiverValue = EnvManager.getValue('this').value
          const inputString = EnvManager.getValue('inputString').value
          for (let i = 0; i < inputString.length; i++) {
            if (thisReceiverValue.indexOf(inputString[i]) !== -1) {
              return new Ast.BooleanNode(true)
            }
          }
          return new Ast.BooleanNode(false)
        }
      )
    ],
    containsIgnoreCase: [
      createMethodNode(
        'containsIgnoreCase',
        ['public'],
        'Boolean',
        [
          ['String', 'substring']
        ],
        () => {
          const stringValue = EnvManager.getValue('this').value.toUpperCase()
          const subStringValue = EnvManager.getValue('substring').value.toUpperCase()
          return new Ast.BooleanNode(stringValue.includes(subStringValue))
        }
      )
    ],
    containsNone: [
      createMethodNode(
        'containsNone',
        ['public'],
        'Boolean',
        [
          ['String', 'inputString']
        ],
        () => {
          const booleanNode = ApexString.instanceMethods.containsAny[0].nativeFunction.call(this)
          booleanNode.value = !booleanNode.value
          return booleanNode
        }
      )
    ],
    containsOnly: [
      createMethodNode(
        'containsOnly',
        ['public'],
        'Boolean',
        [
          ['String', 'inputString']
        ],
        () => {
          const thisReceiverValue = EnvManager.getValue('this').value
          const inputString = EnvManager.getValue('inputString').value
          for (let i = 0; i < thisReceiverValue.length; i++) {
            if (inputString.indexOf(thisReceiverValue[i]) === -1) {
              return new Ast.BooleanNode(false)
            }
          }
          return new Ast.BooleanNode(true)
        }
      )
    ],
    containsWhitespace: [
      createMethodNode(
        'containsWhitespace',
        ['public'],
        'Boolean',
        [],
        () => {
          const thisReceiverValue = EnvManager.getValue('this').value
          return new Ast.BooleanNode(thisReceiverValue.includes(' '))
        }
      )
    ],
    countMatches: [
      createMethodNode(
        'countMatches',
        ['public'],
        'Integer',
        [
          ['String', 'substring']
        ],
        () => {
          const thisReceiverValue = EnvManager.getValue('this').value
          const substring = EnvManager.getValue('substring').value
          var count = 0;

          var pos = thisReceiverValue.indexOf(substring)
          while (pos !== -1) {
            count++
            pos = thisReceiverValue.indexOf(substring, pos + 1)
          }
          return new Ast.IntegerNode(count)
        }
      )
    ],
    deleteWhitespace: [
      createMethodNode(
        'deleteWhitespace',
        ['public'],
        'String',
        [],
        () => {
          const thisReceiverValue = EnvManager.getValue('this').value
          return new Ast.StringNode(thisReceiverValue.replace(/\s/g, ''))
        }
      )
    ],
    difference: [
      createMethodNode(
        'difference',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    endsWith: [
      createMethodNode(
        'endsWith',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    endsWithIgnoreCase: [
      createMethodNode(
        'endsWithIgnoreCase',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    equals: [
      createMethodNode(
        'equals',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    equalsIgnoreCase: [
      createMethodNode(
        'equalsIgnoreCase',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    escapeCsv: [
      createMethodNode(
        'escapeCsv',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    escapeEcmaScript: [
      createMethodNode(
        'escapeEcmaScript',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    escapeHtml3: [
      createMethodNode(
        'escapeHtml3',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    escapeHtml4: [
      createMethodNode(
        'escapeHtml4',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    escapeJava: [
      createMethodNode(
        'escapeJava',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    escapeSingleQuotes: [
      createMethodNode(
        'escapeSingleQuotes',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    escapeXml: [
      createMethodNode(
        'escapeXml',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    format: [
      createMethodNode(
        'format',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    fromCharArray: [
      createMethodNode(
        'fromCharArray',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    getChars: [
      createMethodNode(
        'getChars',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    getCommonPrefix: [
      createMethodNode(
        'getCommonPrefix',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    getLevenshteinDistance: [
      createMethodNode(
        'getLevenshteinDistance',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    hashCode: [
      createMethodNode(
        'hashCode',
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
        [['String', 'substring']],
        () => {
          const thisReceiverValue = EnvManager.getValue('this').value
          const substring = EnvManager.getValue('substring').value
          return new Ast.IntegerNode(thisReceiverValue.indexOf(substring))
        }
      ),
      createMethodNode(
        'indexOf',
        ['public'],
        'Integer',
        [
          ['String', 'substring'],
          ['Integer', 'index'],
        ],
        () => {
          const thisReceiverValue = EnvManager.getValue('this').value
          const substring = EnvManager.getValue('substring').value
          const index = EnvManager.getValue('index').value
          return new Ast.IntegerNode(thisReceiverValue.indexOf(substring, index))
        }
      ),
    ],
    indexOfAny: [
      createMethodNode(
        'indexOfAny',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    indexOfAnyBut: [
      createMethodNode(
        'indexOfAnyBut',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    indexOfChar: [
      createMethodNode(
        'indexOfChar',
        ['public'],
        'String',
        [],
        () => {

        }
      ),
      createMethodNode(
        'indexOfChar',
        ['public'],
        'String',
        [],
        () => {

        }
      ),
    ],
    indexOfDifference: [
      createMethodNode(
        'indexOfDifference',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    indexOfIgnoreCase: [
      createMethodNode(
        'indexOfIgnoreCase',
        ['public'],
        'String',
        [],
        () => {

        }
      )
    ],
    isAllLowerCase: [
      createMethodNode(
        'isAllLowerCase',
        ['public'],
        'String',
        [],
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
