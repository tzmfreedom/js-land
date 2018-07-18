'use strict'

class Event {
  constructor(name, node, lineno) {
    this.name = name;
    this.node = node;
    this.lineno = lineno;
  }
}

module.exports = Event;

