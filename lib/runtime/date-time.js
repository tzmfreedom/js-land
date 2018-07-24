const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

const ApexDateTime = new ApexClass(
  'DateTime',
  null,
  [],
  [],
  {},
  {},
  {
    format: [
      createMethodNode(
        'format',
        ['public'],
        'String',
        [['String', 'dateFormatString']],
        () => {
        }
      )
    ],
    formatGmt: [
      createMethodNode(
        'formatGmt',
        ['public'],
        'String',
        [['String', 'dateFormatString']],
        () => {
        }
      )
    ],
    addDays: [
      createMethodNode(
        'addDays',
        ['public'],
        'DateTime',
        [['Integer', 'additionalDays']],
        () => {
        }
      )
    ],

  },
  {
    now: [
      createMethodNode(
        'now',
        ['public'],
        'DateTime',
        [],
        () => {
          let obj = new ApexObject();
          obj.classNode = ApexDateTime;
          obj.value = Date.now();
          return obj;
        }
      )
    ]
  },
  []
);
NameSpaceStore.registerClass('System', ApexDateTime);
