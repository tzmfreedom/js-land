class CaseIgnoredStore {
  constructor(env) {
    this.env = {};
    if (env) {
      Object.keys(env).forEach((key) => {
        this.env[key.toUpperCase()] = env[key]
      })
    }
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

  keys() {
    return Object.keys(this.env)
  }
}

module.exports = CaseIgnoredStore;
