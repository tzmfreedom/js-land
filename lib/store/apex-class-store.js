'use strict'

const CaseIgnoredStore = require('../store/case-ignored-store')

const apexClassStore = new CaseIgnoredStore()
class ApexClassStore {
  static register (classObject) {
    if (apexClassStore.includes(classObject.name)) {
      throw new Error(`Already Stored ${classObject.name}`)
    } else {
      apexClassStore.set(classObject.name, classObject)
    }
  }

  static get (className) {
    return apexClassStore.get(className)
  }

  static all () {
    return apexClassStore.all()
  }

  static deregister (className) {
    apexClassStore.delete(className)
  }

  static deregisterAll () {
    apexClassStore.keys().forEach((key) => {
      this.deregister(key)
    })
  }
}

module.exports = ApexClassStore
