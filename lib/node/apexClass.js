'use strict';

const CaseIgnoredStore = require('../store/case-ignored-store');

class ApexClass {
  constructor(name, superClass, implementClasses, constructors, instanceFields, staticFields, instanceMethods, staticMethods, innerClasses) {
    this.name             = name;
    this.superClass       = superClass;
    this.implementClasses = implementClasses;
    this.constructors     = constructors;
    this.instanceFields   = instanceFields;
    this.staticFields     = staticFields;
    this.instanceMethods  = instanceMethods;
    this.staticMethods    = staticMethods;
    this.innerClasses     = innerClasses;
    this.valueFunction    = (node) => { return this.name };
  }

  accept(visitor) {
    visitor.visitClass(this);
  }
}

class ApexObject {
  constructor(classNode, instanceFields) {
    this.classNode = classNode;
    this.instanceFields = instanceFields;
  }
}

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


module.exports = {
  ApexClass: ApexClass,
  ApexObject: ApexObject,
  ApexClassStore: ApexClassStore,
};
