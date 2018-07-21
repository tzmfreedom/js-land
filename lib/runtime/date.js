const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const createMethodNode = require('../create-method-node')

const ApexDate = new ApexClass(
  'Date',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexDate)

module.exports = ApexDate
