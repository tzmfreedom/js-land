const ApexClass        = require('../node/apexClass').ApexClass
const NameSpaceStore   = require('../node/apexClass').NameSpaceStore
const createMethodNode = require('../create-method-node')

NameSpaceStore.register('DOM')

const XmlNode= new ApexClass(
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
