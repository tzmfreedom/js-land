const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const createMethodNode = require('../helper/create-method-node')

const ApexHttpRequest = new ApexClass(
  'HttpRequest',
  null,
  [],
  [],
  {},
  {},
  {
    setHeader: [
      createMethodNode(
        'setHeader',
        ['public'],
        'void',
        [['String', 'headerName'], ['String', 'headerValue']],
        () => {
          const thisReceiver = EnvManager.getValue('this')
          const headerName = EnvManager.get('headerName')
          const headerValue = EnvManager.get('headerValue')
          thisReceiver.instanceFields['_headers'][headerName] = headerValue
        }
      )
    ],
    setMethod: [
      createMethodNode(
        'setMethod',
        ['public'],
        'void',
        [['String', 'method']],
        () => {
        }
      )
    ],
    setEndpoint: [
      createMethodNode(
        'setEndpoint',
        ['public'],
        'void',
        [['String', 'endpoint']],
        () => {
        }
      )
    ],
    setBody: [
      createMethodNode(
        'setBody',
        ['public'],
        'void',
        [['String', 'body']],
        () => {
        }
      )
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('System', ApexHttpRequest);

module.exports = ApexHttpRequest
