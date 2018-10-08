'use strict';

const CaseIgnoredStore = require('../store/case-ignored-store')

class ApexClass {
  constructor(name, superClass, implementClasses, constructors, instanceFields, staticFields, instanceMethods, staticMethods, innerClasses, modifiers) {
    this.name             = name;
    this.superClass       = superClass;
    this.implementClasses = implementClasses;
    this.constructors     = constructors;
    this.instanceFields   = new CaseIgnoredStore(instanceFields);
    this.staticFields     = new CaseIgnoredStore(staticFields);
    this.instanceMethods  = new CaseIgnoredStore(instanceMethods);
    this.staticMethods    = new CaseIgnoredStore(staticMethods);
    this.innerClasses     = new CaseIgnoredStore(innerClasses);
    this.valueFunction    = (node) => { return this.name };
    this.modifiers        = modifiers || []
  }

  accept(visitor) {
    visitor.visitClass(this);
  }

  isAbstract() {
    return this.modifiers.some((modifier) => {
      return modifier.name === 'abstract';
    })
  }

  isVirtual() {
    return this.modifiers.some((modifier) => {
      return modifier.name === 'virtual';
    })
  }
}

module.exports = ApexClass
