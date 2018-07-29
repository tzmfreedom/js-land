'use strict';

const CaseIgnoredStore = require('../store/case-ignored-store')

class ApexClass {
  constructor(name, superClass, implementClasses, constructors, instanceFields, staticFields, instanceMethods, staticMethods, innerClasses) {
    this.name             = name;
    this.superClass       = superClass;
    this.implementClasses = implementClasses;
    this.constructors     = constructors;
    this.instanceFields   = new CaseIgnoredStore(instanceFields);
    this.staticFields     = new CaseIgnoredStore(staticFields);
    this.instanceMethods  = instanceMethods;
    this.staticMethods    = staticMethods;
    this.innerClasses     = innerClasses;
    this.valueFunction    = (node) => { return this.name };
  }

  accept(visitor) {
    visitor.visitClass(this);
  }
}

module.exports = ApexClass
