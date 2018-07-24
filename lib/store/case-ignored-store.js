class CaseIgnoredStore {
  constructor() {
    this.env = {};
  }

  get(name) {
    return this.env[name.toUpperCase()]
  }

  set(name, value) {
    this.env[name.toUpperCase()] = value;
  }

  delete(name) {
    delete this.env[name.toUpperCase()]
  }

  includes(name) {
    return name.toUpperCase() in this.env;
  }

  all() {
    return this.env;
  }

  clear() {
    this.env = {}
  }
}

module.exports = CaseIgnoredStore;
