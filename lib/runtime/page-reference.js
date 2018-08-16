const Ast              = require('../node/ast')
const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

const ApexPageReference = new ApexClass(
  'PageReference',
  null,
  [],
  [],
  {},
  {},
  {
    getParameters: [
      createMethodNode(
        'getParameters',
        ['public'],
        new Ast.TypeNode(['Map'], [
          new Ast.TypeNode(['String'], []),
          new Ast.TypeNode(['String'], []),
        ]),
        [],
        () => {
        }
      ),
    ],
    setRedirect: [
      createMethodNode(
        'setRedirect',
        ['public'],
        ['PageReference'],
        [
          ['Boolean', 'redirect']
        ],
        () => {
        }
      ),
    ],
  },
  {},
  []
);
NameSpaceStore.registerClass('System', ApexPageReference);

module.exports = ApexPageReference
