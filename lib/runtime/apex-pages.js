const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast')
const createFieldNode  = require('../create-field-node')
const createMethodNode = require('../create-method-node')

const ApexPages = new ApexClass(
  'ApexPages',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    addMessage: [
      createMethodNode(
        'addMessage',
        ['public'],
        ['ApexPages', 'Message'],
        [
          [['ApexPages', 'Message'], 'message'],
        ],
        () => {
        }
      )
    ],
    getMessages: [
      createMethodNode(
        'addMessage',
        ['public'],
        new Ast.TypeNode(
          ['List'],
          [
            new Ast.TypeNode(['ApexPages', 'Message'], []),
          ]
        ),
        [],
        () => {
        }
      )
    ],
  },
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
  {
    getSeverity: [
      createMethodNode(
        'getSeverity',
        ['public'],
        ['ApexPages', 'Severity'],
        [],
        () => {
        }
      )
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('ApexPages', Message);

const Severity = new ApexClass(
  'Severity',
  null,
  [],
  [],
  {},
  {
    CONFIRM: createFieldNode(
      ['ApexPages', 'Severity'],
      ['public'],
      new Ast.NullNode()
    ),
    INFO: createFieldNode(
      ['ApexPages', 'Severity'],
      ['public'],
      new Ast.NullNode()
    ),
    WARNING: createFieldNode(
      ['ApexPages', 'Severity'],
      ['public'],
      new Ast.NullNode()
    ),
    ERROR: createFieldNode(
      ['ApexPages', 'Severity'],
      ['public'],
      new Ast.NullNode()
    ),
    FATAL: createFieldNode(
      ['ApexPages', 'Severity'],
      ['public'],
      new Ast.NullNode()
    ),
  },
  {},
  {},
  []
);
NameSpaceStore.registerClass('ApexPages', Severity);

module.exports = ApexPages
