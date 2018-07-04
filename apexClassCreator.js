'use strict'

let LocalEnvironment = require('./localEnv');
let ApexClass        = require('./apexClass').ApexClass;
let ApexMethod       = require('./apexClass').ApexMethod;
let ApexClassStore   = require('./apexClass').ApexClassStore;

class ApexClassCreator {
  static create() {
    let apexClass = new ApexClass(
      'System',
      null,
      [],
      {},
      {},
      {},
      {
        debug: new ApexMethod(
          ['public'],
          'debug',
          [],
          [],
          [],
          () => {
            console.log(LocalEnvironment.currentScope());
            let object = LocalEnvironment.get('object');
            console.log(object.value);
          }
        )
      }
    );
    ApexClassStore.register('System', apexClass);
  }
}

ApexClassCreator.create();

module.exports = {
  ApexClassCreator: ApexClassCreator,
};
