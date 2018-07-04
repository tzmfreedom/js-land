'use strict'

let LocalEnvironment = require('./localEnv');
let ApexClass        = require('./apexClass').ApexClass;
let ApexMethod       = require('./apexClass').ApexMethod;
let ApexClassStore   = require('./apexClass').ApexClassStore;
let NameSpaceStore   = require('./apexClass').NameSpaceStore;
let Ast              = require('./node/ast');

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
          [
            new Ast.ParameterNode(
              [],
              new Ast.TypeNode('Object', []),
              'object'
            )
          ],
          [],
          [],
          () => {
            let object = LocalEnvironment.get('object');
            console.log(object.value);
          }
        )
      }
    );
    ApexClassStore.register(apexClass);
  }
}

ApexClassCreator.create();
NameSpaceStore.register('System');

module.exports = {
  ApexClassCreator: ApexClassCreator,
};
