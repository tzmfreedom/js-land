'use strict'

class MethodResolveResult {
  constructor(receiverNode, methodNode) {
    this.receiverNode = receiverNode;
    this.methodNode = methodNode;
  }
}

module.exports = MethodResolveResult