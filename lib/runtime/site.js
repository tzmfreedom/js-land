const ApexClass        = require('../node/apexClass').ApexClass;
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore;
const createMethodNode = require('../create-method-node')

const Site = new ApexClass(
  'Site',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    changePassword: [
      createMethodNode(
        'changePassword',
        ['public'],
        'PageReference',
        [
          ['String', 'oldPassword'],
          ['String', 'newPassword'],
          ['String', 'verifyNewPassword']
        ],
        () => {
        }
      ),
    ]
  },
  []
);
NameSpaceStore.registerClass('System', Site)

module.exports = Site
