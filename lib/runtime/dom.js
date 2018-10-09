const ApexClass = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('DOM')

const XmlNode = new ApexClass(
  'XmlNode',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  []
)

NameSpaceStore.registerClass('DOM', XmlNode)

module.exports = XmlNode
