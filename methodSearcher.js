'use strict'

let ApexClassStore = require('./apexClass').ApexClassStore;
let NameSpaceStore = require('./apexClass').NameSpaceStore;
let LocalEnvironment = require('./localEnv');

class MethodSearcher {
  searchMethod(node) {
    if (node.methodName) {
      let receiverNode = node.receiver.accept(this);
      let classNode = receiverNode.classNode;
      let methodNode = this.searchInstanceMethod(classNode, node.methodName);
      return [receiverNode, methodNode];
    }

    let names = node.receiver.value;
    let name = names[0];

    if (this.localIncludes(name)) {
      let variable = this.getValue(name);
      let receiverNode = (() => {
        let receiverNode = variable;
        let list = names.slice(1);
        for (let i = 0; i < list.length; i++) {
          if (!receiverNode) return null;
          receiverNode = receiverNode.instanceFields[list[i]];
        }
        return receiverNode;
      })();

      if (receiverNode) {
        let methodNode = this.searchInstanceMethod(receiverNode, node.methodName);
        if (receiverNode && methodNode) {
          return [receiverNode, methodNode];
        }
      }
    }

    if (this.localIncludes('this')) {
      let variable = this.getValue('this');
      let receiverNode = (() => {
        let receiverNode = variable;
        for (let i = 0; i < list.length; i++) {
          if (!receiverNode) return null;
          receiverNode = receiverNode.instanceFields[names[i]];
        }
        return receiverNode;
      })();
      let methodNode = this.searchInstanceMethod(receiverNode, node.methodName);
      if (receiverNode && methodNode) {
        return [receiverNode, methodNode];
      }
    }

    if (names.length == 2) {
      let classInfo = ApexClassStore.get(name);
      if (classInfo) {
        let methodNode = this.searchStaticMethod(classInfo, names[1]);
        if (classInfo && methodNode) {
          return [classInfo, methodNode];
        }
      }
    }

    if (names.length >= 3) {
      let classInfo = ApexClassStore.get(name);
      if (classInfo) {
        let receiverNode = (() => {
          let staticFieldName = names[1];
          let receiverNode = classInfo.staticFields[staticFieldName];
          for (let i = 2; i < names.length; i++) {
            if (!receiverNode) return null;
            receiverNode = receiverNode.instanceFields[names[i]];
          }
          return receiverNode;
        })();
        if (receiverNode) {
          let methodNode = this.searchInstanceMethod(receiverNode.classNode, methodName);
          if (receiverNode && methodNode) {
            return [receiverNode, methodNode];
          }
        }
      }
    }

    if (names.length >= 3) {
      let nameSpace = NameSpaceStore.get(name);
      let className = names[1];
      let staticFieldName = names[2];
      if (nameSpace && className in nameSpace) {
        let classNode = nameSpace[className];
        let staticField = classNode.searchStaticField(staticFieldName);
        let receiverNode = names.reduce((receiver, name) => {
          if (!receiver) {
            return;
          }
          return receiver.instanceFields[name];
        }, staticField);
        let methodNode = receiverNode.searchInstanceMethod(methodName);
        if (receiverNode && methodNode) {
          return [receiverNode, methodNode];
        }
      }
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


  getValue(key) {
    return LocalEnvironment.get(key);
  }

  localIncludes(key) {
    return LocalEnvironment.includes(key);
  }

  searchField(key) {

  }
}

module.exports = new MethodSearcher();
