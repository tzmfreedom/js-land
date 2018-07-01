'use strict'

let LocalEnvironment = require('./localEnv');
let Apex = require('./apexClass');

class ApexClassCreator {
    static create() {
        let apexClass = new Apex.ApexClass(
            'System',
            [],
            [],
            {},
            {},
            {},
            {
                debug: new Apex.ApexMethodNative(() => {
                    console.log(LocalEnvironment.currentScope());
                    let object = LocalEnvironment.get('object');
                    console.log(object.value);
                })
            }
        );
        Apex.ApexClassStore.register('System', apexClass);
    }
}

ApexClassCreator.create();


module.exports = {
    ApexClassCreator: ApexClassCreator,
};
