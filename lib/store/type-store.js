'use strict'

const CaseIgnoredStore = require('./case-ignored-store')

let typeStore = new CaseIgnoredStore()
class TypeStore {
  static get(typeName) {
    return typeStore[typeName];
  }

  static set(typeName, typeNode) {
    typeStore[typeName] = typeNode;
  }
}

module.exports = TypeStore;

