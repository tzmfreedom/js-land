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
    if ('value' in this.value) {
      return this.value.value;
    } else {
      return this.value.val();
    }
  }
}

module.exports = Variable;
