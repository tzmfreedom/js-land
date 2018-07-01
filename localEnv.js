'use strict'

let envStack = [];
class LocalEnvironment {
    constructor(env, parent) {
        this.env = env;
        this.parent = parent;
    }

    get(key) {
        return this.env[key];
    }

    static get(key) {
        let env = this.currentScope();
        let value = env.get(key);
        if (value) {
            return value;
        } else if (env.parent) {
            return env.parent.get(key);
        } else {
            console.log('Undefined Variable');
        }
    }

    static currentScope() {
        return envStack[envStack.length-1];
    }

    static pushScope(env) {
        let localEnv = new LocalEnvironment(env, this.currentScope());
        envStack.push(localEnv);
    }

    static popScope() {
        envStack.pop();
    }
}

module.exports = LocalEnvironment;
