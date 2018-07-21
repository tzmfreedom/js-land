'use strict'

const Variable = require('./node/variable')
const UpperCasedKeyStore = require('./upcased-store')

const store = new UpperCasedKeyStore()
class ClassStaticFields {
  static get(className, fieldName) {
    return store.get(className).get(fieldName)
  }

  static put(className, type, fieldName, value) {
    if (!(store.includes(className))) {
      store.set(className, new UpperCasedKeyStore())
    }
    const fieldStore = store.get(className)
    fieldStore.set(fieldName, new Variable(type, value))
  }

  static all() {
    return store
  }

  static clear() {
    store.clear()
  }
}

module.exports = ClassStaticFields;
