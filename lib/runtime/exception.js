const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

const Exception = new ApexClass(
  'Exception',
  null,
  [],
  [],
  {},
  {},
  {
    getCause: [
      createMethodNode(
        'getCause',
        ['public'],
        'Exception',
        [],
        () => {
          const thisReceiverNode = EnvManager.getValue('this')
          return thisReceiverNode.instanceFields.cause
        }
      )
    ],
    getLineNumber: [
      createMethodNode(
        'getLineNumber',
        ['public'],
        'Integer',
        [],
        () => {
          const thisReceiverNode = EnvManager.getValue('this')
          return thisReceiverNode.instanceFields.lineNumber
        }
      )
    ],
    getMessage: [
      createMethodNode(
        'getMessage',
        ['public'],
        'String',
        [],
        () => {
          const thisReceiverNode = EnvManager.getValue('this')
          return thisReceiverNode.instanceFields.message
        }
      )
    ],
    getStackTraceString: [
      createMethodNode(
        'getStackTraceString',
        ['public'],
        'String',
        [],
        () => {
          const thisReceiverNode = EnvManager.getValue('this')
          return thisReceiverNode.instanceFields.stackTraceString
        }
      )
    ],
    getTypeName: [
      createMethodNode(
        'getTypeName',
        ['public'],
        'String',
        [],
        () => {
          const thisReceiverNode = EnvManager.getValue('this')
          return thisReceiverNode.instanceFields.typeName
        }
      )
    ],
    initCause: [
      createMethodNode(
        'initCause',
        ['public'],
        'void',
        [['Exception', 'cause']],
        () => {
          const thisReceiverNode = EnvManager.getValue('this')
          const cause = EnvManager.getValue('cause')
          thisReceiverNode.instanceFields.cause = cause
        }
      )
    ],
    setMessage: [
      createMethodNode(
        'setMessage',
        ['public'],
        'void',
        [['String', 's']],
        () => {
          const thisReceiverNode = EnvManager.getValue('this')
          const message = EnvManager.getValue('s')
          thisReceiverNode.instanceFields.message = message
        }
      )
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('System', Exception);

module.exports = Exception
