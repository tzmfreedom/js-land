'use strict'


class Variable {
  constructor(variableType, value) {
    this.variableType = variableType;
    this.value = value;
  }

  type() {
    return this.variableType;
  }

  val() {
    if ('val' in this.value && typeof(this.value.val) === 'function') {
      return this.value.val();
    } else {
      return this.value.value;
    }
  }
}

module.exports = Variable;
