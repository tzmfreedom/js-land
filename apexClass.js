'use strict'

class ApexClass {
    constructor(className, superClass, implements, instanceFields, staticFields, instanceMethods, staticMethods) {
        this.className = className;
        this.superClass = superClass;
        this.implements = implements;
        this.instanceFields = instanceFields;
        this.staticFields = staticFields;
        this.instanceMethods = instanceMethods;
        this.staticMethods = staticMethods;
    }
}

class ApexMethod {
    constructor(identifier, parameters, throws, statements) {
        this.identifier = identifier;
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
