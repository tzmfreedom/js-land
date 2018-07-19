'use strict'

const UpperCasedKeyStore = require('./upcased-store');

let triggerStore = new UpperCasedKeyStore();
class TriggerStore {
  static get(objectName) {
    return triggerStore.get(objectName);
  }

  static add(objectName, triggerNode) {
    if (!triggerStore.includes(objectName)) {
      triggerStore.set(objectName, []);
    }
    triggerStore.get(objectName).push(triggerNode);
  }
}

module.exports = TriggerStore;

