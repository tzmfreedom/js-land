const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const createMethodNode = require('../create-method-node')

const ApexPages = new ApexClass(
  'ApexPages',
  null,
  [],
  [],
  {},
  {},
  {
    addMessage: [
      createMethodNode(
        'addMessage',
        ['public'],
        ['ApexPages', 'Message'],
        [
          ['String', 'algorithmName'],
          ['Blob', 'input'],
        ],
        () => {
        }
      )
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('System', ApexPages);

NameSpaceStore.register('ApexPages')

const Message = new ApexClass(
  'Message',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('ApexPages', Message);

module.exports = ApexPages
