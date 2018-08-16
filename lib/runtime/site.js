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
    ],
    getAdminId: [
      createMethodNode(
        'getAdminId',
        ['public'],
        'ID',
        [],
        () => {
        }
      ),
    ],
    setPortalUserAsAuthProvider: [
      createMethodNode(
        'setPortalUserAsAuthProvider',
        ['public'],
        'void',
        [
          ['SObject', 'user'],
          ['String', 'contactId'],
        ],
        () => {
        }
      ),
    ],
    login: [
      createMethodNode(
        'login',
        ['public'],
        'PageReference',
        [
          ['String', 'username'],
          ['String', 'password'],
          ['String', 'startURL'],
        ],
        () => {
        }
      ),
    ],
    createPortalUser: [
      createMethodNode(
        'createPortalUser',
        ['public'],
        'ID',
        [
          ['User', 'user'],
          ['ID', 'accountId'],
          ['String', 'password'],
        ],
        () => {
        }
      ),
    ]
  },
  []
);
NameSpaceStore.registerClass('System', Site)

NameSpaceStore.register('Site')

const URLRewriter = new ApexClass(
  'URLRewriter',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Site', URLRewriter);

module.exports = Site
