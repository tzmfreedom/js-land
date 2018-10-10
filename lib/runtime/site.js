const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')
const CaseIgnoredStore = require('../store/case-ignored-store')

const staticMethods = {
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
    )
  ],
  getAdminId: [
    createMethodNode(
      'getAdminId',
      ['public'],
      'ID',
      [],
      () => {
      }
    )
  ],
  setPortalUserAsAuthProvider: [
    createMethodNode(
      'setPortalUserAsAuthProvider',
      ['public'],
      'void',
      [
        ['SObject', 'user'],
        ['String', 'contactId']
      ],
      () => {
      }
    )
  ],
  login: [
    createMethodNode(
      'login',
      ['public'],
      'PageReference',
      [
        ['String', 'username'],
        ['String', 'password'],
        ['String', 'startURL']
      ],
      () => {
      }
    )
  ],
  createPortalUser: [
    createMethodNode(
      'createPortalUser',
      ['public'],
      'ID',
      [
        ['User', 'user'],
        ['ID', 'accountId'],
        ['String', 'password']
      ],
      () => {
      }
    )
  ]
}

if (NameSpaceStore.includes('System', 'Site')) {
  const Site = NameSpaceStore.get('System', 'Site')
  Site.staticMethods = new CaseIgnoredStore(staticMethods)
} else {
  const Site = new Ast.ApexClass(
    'Site',
    null,
    [],
    [],
    {},
    {},
    {},
    staticMethods,
    []
  )
  NameSpaceStore.registerClass('System', Site)
}

NameSpaceStore.register('Site')
const URLRewriter = new Ast.ApexClass(
  'URLRewriter',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Site', URLRewriter)
