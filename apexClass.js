'use strict'

class ApexClass {
    constructor(className, superClass, implementClasses, instanceFields, staticFields, instanceMethods, staticMethods) {
        this.className        = className;
        this.superClass       = superClass;
        this.implementClasses = implementClasses;
        this.instanceFields   = instanceFields;
        this.staticFields     = staticFields;
        this.instanceMethods  = instanceMethods;
        this.staticMethods    = staticMethods;
    }
}

class ApexMethod {
    constructor(identifier, parameters, throws, statements) {
        this.identifier = identifier;
        this.modifiers  = [];
        this.parameters = parameters;
        this.statements = throws;
        this.statements = statements;
    }
}

class InstanceField {
    constructor(identifier, parameters, throws, statements) {
        this.identifier = identifier;
        this.modifiers  = [];
        this.parameters = parameters;
        this.statements = throws;
        this.statements = statements;
    }
}

class ApexObject {
    constructor(class_name, parameters) {
        this.class_name = class_name;
        this.instance_fields = {};
    }
}

class ApexClassStore {
    static store() {
        if (this._store == undefined) {
            this._store = [];
        }
        return this._store;
    }

    static register(class_name, class_object) {
        if (this.store[class_name]) {
            console.log(`Already Stored ${class_name}`);
        } else {
            this.store[class_name] = class_object;
        }
    }

    static get(class_name) {
        this.store[class_name];
    }
}

module.exports = {
    ApexClass: ApexClass,
    ApexMethod: ApexMethod,
    InstanceField: InstanceField,
    ApexObject: ApexObject,
    ApexClassStore: ApexClassStore,
};
