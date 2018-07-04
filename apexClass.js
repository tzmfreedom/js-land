'use strict';

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
    constructor(modifiers, identifier, parameters, throws, statements, nativeFunction) {
        this.modifiers      = modifiers;
        this.identifier     = identifier;
        this.parameters     = parameters;
        this.throws         = throws;
        this.statements     = statements;
        this.nativeFunction = nativeFunction;
    }
}

class InstanceFieldDeclaration {
    constructor(modifiers, type, identifier, expression) {
        this.modifiers  = modifiers;
        this.type       = type;
        this.identifier = identifier;
        this.expression = expression;
    }
}

class ApexObject {
    constructor(className, instanceFields) {
        this.className = className;
        this.instanceFields = instanceFields;
    }
}

let store = {};
class ApexClassStore {
    static register(class_name, class_object) {
        if (store[class_name]) {
            throw `Already Stored ${class_name}`;
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
    InstanceFieldDeclaration: InstanceFieldDeclaration,
    ApexObject: ApexObject,
    ApexClassStore: ApexClassStore,
};
