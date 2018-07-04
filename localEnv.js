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

  includes(key) {
    return key in this.env;
  }

  static get(key) {
    let env = this.currentScope();
    let value = env.get(key);
    if (value) {
      return value;
    } else if (env.parent) {
      return env.parent.get(key);
    } else {
      throw `Undefined Variable ${key}`;
    }
  }

  static includes(key, env) {
    if (!env) env = this.currentScope();
    if (env.includes(key)) {
      return true;
    } else if (env.parent) {
      return this.includes(key, env.parent);
    } else {
      return false;
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
