const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const createMethodNode = require('../create-method-node')

const ApexString = new ApexClass(
  'String',
  null,
  [],
  [],
  {},
  {},
  {
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
