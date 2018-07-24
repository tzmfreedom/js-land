const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

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
