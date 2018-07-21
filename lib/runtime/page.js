const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast')
const createFieldNode  = require('../create-field-node')
const createMethodNode = require('../create-method-node')

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
