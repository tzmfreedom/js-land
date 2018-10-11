'use strict'

const CaseIgnoredStore = require('./case-ignored-store')

const nameSpaceStore = new CaseIgnoredStore()
class NameSpaceStore {
  static register (namespace) {
    if (nameSpaceStore.includes(namespace)) {
      throw new Error(`Already Stored ${namespace}`)
    } else {
      nameSpaceStore.set(namespace, new CaseIgnoredStore())
    }
  }

  static registerClass (namespace, classObject) {
    nameSpaceStore.get(namespace).set(classObject.name, classObject)
  }

  static get (nameSpace, className) {
    if (!(nameSpaceStore.includes(nameSpace))) return null
    if (!(nameSpaceStore.get(nameSpace).includes(className))) return null
    return nameSpaceStore.get(nameSpace).get(className)
  }

  static getClasses (nameSpace) {
    return nameSpaceStore.get(nameSpace).env
  }

  static includes (namespace, className) {
    if (!(nameSpaceStore.includes(namespace))) return false
    return nameSpaceStore.get(namespace).includes(className)
  }

  static delete (namespace, className) {
    if (!(nameSpaceStore.includes(namespace))) return false
    return nameSpaceStore.get(namespace).delete(className)
  }
}

module.exports = NameSpaceStore
