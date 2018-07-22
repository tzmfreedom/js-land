'use strict';

const UpperCasedKeyStore = require('../upcased-store');

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

let apexClassStore = new UpperCasedKeyStore();
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

let nameSpaceStore = new UpperCasedKeyStore();
class NameSpaceStore {
  static register(namespace) {
    if (nameSpaceStore.includes(namespace)) {
      throw `Already Stored ${namespace}`;
    } else {
      nameSpaceStore.set(namespace, new UpperCasedKeyStore());
    }
  }

  static registerClass(namespace, classObject) {
    nameSpaceStore.get(namespace).set(classObject.name, classObject);
  }

  static get(nameSpace, className) {
    if (!(nameSpaceStore.includes(nameSpace))) return null;
    if (!(nameSpaceStore.get(nameSpace).includes(className))) return null;
    return nameSpaceStore.get(nameSpace).get(className);
  }

  static getClasses(nameSpace) {
    return nameSpaceStore.get(nameSpace).env;
  }

  static includes(namespace, className) {
    if (!(nameSpaceStore.includes(namespace))) return false;
    return nameSpaceStore.get(namespace).includes(className);
  }

  static delete(namespace, className) {
    if (!(nameSpaceStore.includes(namespace))) return false;
    return nameSpaceStore.get(namespace).delete(className);
  }
}

module.exports = {
  ApexClass: ApexClass,
  ApexObject: ApexObject,
  ApexClassStore: ApexClassStore,
  NameSpaceStore: NameSpaceStore,
};
