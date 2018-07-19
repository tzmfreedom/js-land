'use strict'

const LocalEnvironment = require('./local-environment');

class EnvManager {
  currentScope() {
    return LocalEnvironment.currentScope();
  }

  pushScope(env, parent) {
    if (parent !== null) parent = LocalEnvironment.currentScope();
    LocalEnvironment.pushScope(env, parent);
  }

  popScope() {
    LocalEnvironment.popScope();
  }

  get(key) {
    return LocalEnvironment.get(key);
  }

  getValue(key) {
    return LocalEnvironment.get(key).value;
  }

  setValue(key, value) {
    LocalEnvironment.set(key, value);
  }

  localIncludes(key) {
    return LocalEnvironment.includes(key);
  }
}

module.exports = new EnvManager();
