const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const Ast              = require('../node/ast');
const EnvManager = require('../env-manager');
const createMethodNode = require('../create-method-node')

NameSpaceStore.register('QuickAction');

const SendEmailQuickActionDefaults = new ApexClass(
  'SendEmailQuickActionDefaults',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('QuickAction', SendEmailQuickActionDefaults);

module.exports = SendEmailQuickActionDefaults