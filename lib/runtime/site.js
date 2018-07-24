const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

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
