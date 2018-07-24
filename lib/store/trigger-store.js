'use strict'

const CaseIgnoredStore = require('./case-ignored-store')

let triggerStore = new CaseIgnoredStore();
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

