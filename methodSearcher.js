'use strict'

const ApexClassStore = require('./apexClass').ApexClassStore;
const NameSpaceStore = require('./apexClass').NameSpaceStore;
const Ast = require('./node/ast');
const crypto = require('crypto');
const EnvManager = require('./envManager');

class MethodSearchResult {
  constructor(receiverNode, methodNode) {
    this.receiverNode = receiverNode;
    this.methodNode = methodNode;
  }
}
class MethodSearcher {
  searchMethod(node, visitor, searchMethod = 'value') {
    if (!(node.nameOrExpression instanceof Ast.NameNode)) {
      let receiverNode = node.nameOrExpression.accept(visitor);
      let classNode = receiverNode.classNode;
      if (classNode) {
        let methodNode = this.searchInstanceMethod(classNode, node.methodName);
        return new MethodSearchResult(receiverNode, methodNode);
      }
    }

    let names = node.nameOrExpression.value;
    let name = names[0];
    let methodName = names[names.length - 1];

    if (EnvManager.localIncludes(name)) {
      let variable = EnvManager.get(name);
      let receiverNode = (() => {
        let receiverNode = variable;
        let list = names.slice(1);
        for (let i = 0; i < list.length - 1; i++) {
          if (!receiverNode) return null;
          if (!(searchMethod in receiverNode)) return null;
          receiverNode = receiverNode[searchMethod].instanceFields[list[i]];
        }
        return receiverNode;
      })();

      if (receiverNode) {
        let methodNode = this.searchInstanceMethod(receiverNode.classNode, methodName);
        if (receiverNode && methodNode) {
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }

    if (EnvManager.localIncludes('this')) {
      let variable = EnvManager.get('this');
      let receiverNode = (() => {
        let receiverNode = variable;
        for (let i = 0; i < names.length - 1; i++) {
          if (!receiverNode) return null;
          if (!(searchMethod in receiverNode)) return null;
          receiverNode = receiverNode[searchMethod].instanceFields[names[i]];
        }
        return receiverNode;
      })();

      if (receiverNode) {
        let methodNode = this.searchInstanceMethod(receiverNode.classNode, methodName);
        if (receiverNode && methodNode) {
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }

    if (names.length == 2) {
      let classInfo = ApexClassStore.get(name);
      if (classInfo) {
        let methodNode = this.searchStaticMethod(classInfo, names[1]);
        if (classInfo && methodNode) {
          return new MethodSearchResult(classInfo, methodNode);
        }
      }
      if (NameSpaceStore.includes('System', names[0])) {
        const clasInfo = NameSpaceStore.get('System', names[0]);
        if (classInfo) {
          let methodNode = this.searchStaticMethod(classInfo, names[1]);
          if (classInfo && methodNode) {
            return new MethodSearchResult(classInfo, methodNode);
          }
        }
      }
    }

    if (names.length >= 3) {
      let classNode = ApexClassStore.get(name);
      if (classNode) {
        let receiverNode = (() => {
          let staticFieldName = names[1];
          if (!(staticFieldName in classNode.staticFields)) return null;
          let receiverNode = classNode.staticFields[staticFieldName];
          for (let i = 2; i < names.length - 1; i++) {
            if (!receiverNode) return null;
            if (!(searchMethod in receiverNode)) return null;
            receiverNode = receiverNode[searchMethod].instanceFields[names[i]];
          }
          return receiverNode;
        })();
        if (receiverNode) {
          let methodNode = this.searchInstanceMethod(receiverNode.classNode, methodName);
          if (receiverNode && methodNode) {
            return new MethodSearchResult(receiverNode, methodNode);
          }
        }
      }
    }

    if (names.length >= 3) {
      let classNode = NameSpaceStore.get(name, names[1]);
      if (classNode) {
        let staticFieldName = names[2];
        let receiverNode = (() => {
          let classNode = nameSpace[className];
          if (!(staticFieldName in classNode.staticFields)) return null;
          let receiverNode = classNode.staticFields[staticFieldName];
          for (let i = 3; i < names.length - 1; i++) {
            if (!receiverNode) return;
            if (!(searchMethod in receiverNode)) return null;
            receiverNode = receiverNode[searchMethod].instanceFields[names[i]];
          }
          return receiverNode;
        })();

        let methodNode = receiverNode.searchInstanceMethod(methodName);
        if (receiverNode && methodNode) {
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }
  }

  searchField(node, searchMethod = 'type') {
    let names = node.value;
    let name = names[0];

    // variable.field...field
    if (EnvManager.localIncludes(name)) {
      if (names.length == 1) {
        return { receiverNode: name, key: null };
      }
      let variable = EnvManager.get(name);
      let receiverNode = (() => {
        let receiverNode = variable;
        let list = names.slice(1);
        for (let i = 0; i < list.length - 1; i++) {
          if (!receiverNode) return null;
          if (!(searchMethod in receiverNode)) return null;
          receiverNode = receiverNode[searchMethod].instanceFields[list[i]];
        }
        return receiverNode;
      })();

      let key = names[names.length - 1];
      if (receiverNode && key in receiverNode.type().instanceFields) {
        return { receiverNode, key };
      }
    }

    // this_field.field...field
    if (EnvManager.localIncludes('this')) {
      let thisReceiverNode = EnvManager.get('this');
      if (names.length == 1 && name in thisReceiverNode.instanceFields) {
        return { receiverNode: thisReceiverNode, key: name };
      }
      if (name in thisReceiverNode.instanceFields) {
        let field = thisReceiverNode.instanceFields[name];
        let receiverNode = (() => {
          let receiverNode = field;
          let list = names.slice(1);
          for (let i = 0; i < list.length - 1; i++) {
            if (!receiverNode) return null;
            if (!(searchMethod in receiverNode)) return null;
            receiverNode = receiverNode[searchMethod].instanceFields[list[i]];
          }
          return receiverNode;
        })();
        console.log(receiverNode)
        let key = names[names.length - 1];
        if (receiverNode && key in receiverNode.instanceFields) {
          return { receiverNode, key };
        }
      }
    }

    // class.static_field...field
    if (names.length > 1) {
      let apexClass = ApexClassStore.get(name);
      let staticFieldName = names[1];
      if (apexClass && staticFieldName in apexClass.staticFields) {
        let receiverNode = (() => {
          let receiverNode = apexClass.staticFields[staticFieldName];
          let list = names.slice(1);
          for (let i = 0; i < list.length - 1; i++) {
            if (!receiverNode) return null;
            if (!(searchMethod in receiverNode)) return null;
            receiverNode = receiverNode[searchMethod].instanceFields[list[i]];
          }
          return receiverNode;
        })();

        let key = names[names.length - 1];
        if (receiverNode && key in receiverNode.instanceFields) {
          return { receiverNode, key };
        }
      }
    }

    if (names.length > 2) {
      let classNode = NameSpaceStore.get(name, names[1]);
      if (classNode) {
        let staticFieldName = names[2];
        if (staticFieldName in classNode.staticFields) {
          let receiverNode = (() => {
            let receiverNode = classNode.staticFields[staticFieldName];
            let list = names.slice(2);
            for (let i = 0; i < list.length - 1; i++) {
              if (!receiverNode) return null;
              if (!(searchMethod in receiverNode)) return null;
              receiverNode = receiverNode[searchMethod].instanceFields[list[i]];
            }
            return receiverNode;
          })();

          let key = names[names.length - 1];
          if (receiverNode && key in receiverNode.instanceFields) {
            return { receiverNode, key };
          }
        }
      }
    }
  }

  searchFieldType(node) {
    const result = this.searchField(node, 'type');
    if (result.key) {
      return result.receiverNode.instanceFields[result.key].type.classNode;
    } else {
      return EnvManager.get(result.receiverNode).type.classNode;
    }
  }
  searchInstanceMethod(classNode, methodName) {
    if (methodName in classNode.instanceMethods) {
      return classNode.instanceMethods[methodName];
    } else if (classNode.superClass) {
      return this.searchInstanceMethod(classNode.superClass, methodName);
    } else {
      return null;
    }
  }

  searchStaticMethod(classNode, methodName) {
    if (methodName in classNode.staticMethods) {
      return classNode.staticMethods[methodName];
    } else if (classNode.superClass) {
      return this.searchInstanceMethod(classNode.superClass, methodName);
    } else {
      return null;
    }
  }

  calculateMethodParameterHash(node) {
    const hash = crypto.createHash('sha256');
    const hashSource = node.parameters.map((parameter) => {
      return parameter.type.name.join('.');
    }).join(':');
    hash.update(hashSource);
    return hash.digest('hex');
  }
}

module.exports = new MethodSearcher();
