const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

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
