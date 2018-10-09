const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const EnvManager = require('../env-manager')
const ClassStaticFields = require('../store/class-static-fields')
const createMethodNode = require('../helper/create-method-node')

const UserInfo = new ApexClass(
  'UserInfo',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    getDefaultCurrency: [
      createMethodNode(
        'getDefaultCurrency',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('defaultCurrency')
        }
      )
    ],
    getFirstName: [
      createMethodNode(
        'getFirstName',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('firstName')
        }
      )
    ],
    getLanguage: [
      createMethodNode(
        'getLanguage',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('language')
        }
      )
    ],
    getLastName: [
      createMethodNode(
        'getLastName',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('lastName')
        }
      )
    ],
    getLocale: [
      createMethodNode(
        'getLocale',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('locale')
        }
      )
    ],
    getName: [
      createMethodNode(
        'getName',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('name')
        }
      )
    ],
    getOrganizationId: [
      createMethodNode(
        'getOrganizationId',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('organizationId')
        }
      )
    ],
    getOrganizationName: [
      createMethodNode(
        'getOrganizationName',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('OrganizationName')
        }
      )
    ],
    getProfileId: [
      createMethodNode(
        'getProfileId',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('ProfileId')
        }
      )
    ],
    getSessionId: [
      createMethodNode(
        'getSessionId',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('SessionId')
        }
      )
    ],
    getTimeZone: [
      createMethodNode(
        'getTimeZone',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('TimeZone')
        }
      )
    ],
    getUiTheme: [
      createMethodNode(
        'getUiTheme',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('UiTheme')
        }
      )
    ],
    getUiThemeDisplayed: [
      createMethodNode(
        'getUiThemeDisplayed',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('UiThemeDisplayed')
        }
      )
    ],
    getUserEmail: [
      createMethodNode(
        'getUserEmail',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('Email')
        }
      )
    ],
    getUserId: [
      createMethodNode(
        'getUserId',
        ['public'],
        'ID',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('Id')
        }
      )
    ],
    getUserName: [
      createMethodNode(
        'getUserName',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('Name')
        }
      )
    ],
    getUserRoleId: [
      createMethodNode(
        'getUserRoleId',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('RoleId')
        }
      )
    ],
    getUserType: [
      createMethodNode(
        'getUserType',
        ['public'],
        'String',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('Type')
        }
      )
    ],
    isCurrentUserLicensed: [
      createMethodNode(
        'isCurrentUserLicensed',
        ['public'],
        'Boolean',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('CurrentUserLicensed')
        }
      )
    ],
    isMultiCurrencyOrganization: [
      createMethodNode(
        'isMultiCurrencyOrganization',
        ['public'],
        'Boolean',
        [],
        () => {
          const user = ClassStaticFields.get('UserInfo', '_user')
          return user.instanceFields.get('MultiCurrencyOrganization')
        }
      )
    ]
  },
  []
)
NameSpaceStore.registerClass('System', UserInfo)

module.exports = UserInfo
