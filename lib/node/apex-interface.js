'use strict';

const CaseIgnoredStore = require('../store/case-ignored-store')

class ApexInterface {
  constructor(name, superClass, instanceMethods, staticMethods) {
    this.name             = name;
    this.superClass       = superClass;
    this.instanceMethods  = new CaseIgnoredStore(instanceMethods);
    this.staticMethods    = new CaseIgnoredStore(staticMethods);
    this.valueFunction    = (node) => { return this.name };
  }

  accept(visitor) {
    visitor.visitInterface(this);
  }
}

module.exports = ApexInterface
