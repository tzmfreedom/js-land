class UpperCasedKeyStore {
  constructor() {
    this.env = {};
  }

  get(name) {
    return this.env[name.toUpperCase()]
  }

  set(name, value) {
    this.env[name.toUpperCase()] = value;
  }

  includes(name) {
    return name.toUpperCase() in this.env;
  }

  all() {
    return this.env;
  }
}

module.exports = UpperCasedKeyStore;
