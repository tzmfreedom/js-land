'use strict'

const store = {}
class DatabaseAdapterRegister {
  static get (name) {
    return store[name]
  }

  static set (name, adapter) {
    return store[name] = adapter
  }
}

module.exports = DatabaseAdapterRegister
