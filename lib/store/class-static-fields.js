'use strict'

const Variable = require('../node/variable')
const CaseIgnoredStore = require('./case-ignored-store')

const store = new CaseIgnoredStore()
class ClassStaticFields {
  static get (className, fieldName) {
    return store.get(className).get(fieldName)
  }

  static put (className, type, fieldName, value) {
    if (!(store.includes(className))) {
      store.set(className, new CaseIgnoredStore())
    }
    const fieldStore = store.get(className)
    fieldStore.set(fieldName, new Variable(type, value))
  }

  static all () {
    return store
  }

  static clear () {
    store.clear()
  }
}

module.exports = ClassStaticFields
