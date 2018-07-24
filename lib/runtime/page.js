const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const createFieldNode  = require('../helper/create-field-node')
const createMethodNode = require('../helper/create-method-node')

const Page = new ApexClass(
  'Page',
  null,
  [],
  [],
  {},
  {
    changePassword: createFieldNode(
      'PageReference',
      ['public'],
      new Ast.NullNode()
    ),
  },
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', Page);

module.exports = Page
