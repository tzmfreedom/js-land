'use strict'

const CaseIgnoredStore = require('./case-ignored-store')

const typeStore = new CaseIgnoredStore()
class TypeStore {
  static get (typeName) {
    return typeStore.get(typeName)
  }

  static set (typeName, typeNode) {
    typeStore.set(typeName, typeNode)
  }
}

module.exports = TypeStore
