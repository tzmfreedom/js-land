'use strict';

const CaseIgnoredStore = require('../store/case-ignored-store');

let apexClassStore = new CaseIgnoredStore();
class ApexClassStore {
  static register(classObject) {
    if (apexClassStore.includes(classObject.name)) {
      throw `Already Stored ${classObject.name}`;
    } else {
      apexClassStore.set(classObject.name, classObject);
    }
  }

  static get(className) {
    return apexClassStore.get(className);
  }

  static all() {
    return apexClassStore.all();
  }

  static deregister(className) {
    apexClassStore.delete(className)
  }
}


module.exports = ApexClassStore
