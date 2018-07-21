const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const createMethodNode = require('../create-method-node')

const ApexTime = new ApexClass(
  'Time',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
);
NameSpaceStore.registerClass('System', ApexTime);

module.exports = ApexTime
