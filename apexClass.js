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

class ApexMethodNative {
    constructor(callFunction) {
        this.callFunction = callFunction;
    }

    call() {
        this.callFunction();
    }
}

class InstanceFieldDeclaration {
    constructor(type, declarators) {
        this.modifiers   = [];
        this.type        = type;
        this.declarators = declarators;
    }
}

class InstanceFieldDeclarator {
    constructor(identifier, expression) {
        this.identifier = identifier;
        this.expression = expression;
    }
}

class ApexObject {
    constructor(class_name, parameters) {
        this.class_name = class_name;
        this.instance_fields = {};
    }
}

let store = {};
class ApexClassStore {
    static register(class_name, class_object) {
        if (store[class_name]) {
            console.log(`Already Stored ${class_name}`);
        } else {
            store[class_name] = class_object;
        }
    }

    static get(class_name) {
        return store[class_name];
    }
}

module.exports = {
    ApexClass: ApexClass,
    ApexMethod: ApexMethod,
    ApexMethodNative: ApexMethodNative,
    InstanceFieldDeclaration: InstanceFieldDeclaration,
    InstanceFieldDeclarator: InstanceFieldDeclarator,
    ApexObject: ApexObject,
    ApexClassStore: ApexClassStore,
};
