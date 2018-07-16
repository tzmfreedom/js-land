'use strict'

const ApexClassStore = require('./apexClass').ApexClassStore;
const ApexClass = require('./apexClass').ApexClass;
const NameSpaceStore = require('./apexClass').NameSpaceStore;
const Ast = require('./node/ast');
const EnvManager = require('./envManager');
const argumentChecker = require('./argumentChecker');

class MethodSearchResult {
  constructor(receiverNode, methodNode) {
    this.receiverNode = receiverNode;
    this.methodNode = methodNode;
  }
}

const reduceTypeByInstanceField = (init, list) => {
  let receiverNode = init.type();
  for (let i = 0; i < list.length; i++) {
    if (!receiverNode) return null;
    if (!(list[i] in receiverNode.classNode.instanceFields)) return null;
    const instanceField = receiverNode.classNode.instanceFields[list[i]];
    receiverNode = instanceField.type();
  }
  return receiverNode;
};

const reduceValueByInstanceField = (init, list) => {
  let receiverNode = init.value;
  for (let i = 0; i < list.length; i++) {
    if (!receiverNode) return null;
    if (!(list[i] in receiverNode.classNode.instanceFields)) return null;
    receiverNode = receiverNode.classNode.instanceFields[list[i]].value;
  }
  return receiverNode;
};

class MethodSearcher {
  searchMethod(node, reduce) {
    let names = node.nameOrExpression.value;
    let name = names[0];
    let methodName = names[names.length - 1];

    if (EnvManager.localIncludes(name)) {
      let variable = EnvManager.get(name);
      let receiverNode = reduce(variable, names.slice(1, names.length-1));
      if (receiverNode) {
        let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters);
        if (receiverNode && methodNode) {
          if (!methodNode.isPublic()) {
            throw `Method is not visible: ${methodNode.name}`;
          }
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }

    if (EnvManager.localIncludes('this')) {
      let variable = EnvManager.get('this');
      let receiverNode = reduce(variable, names.slice(1, names.length-1));
      if (receiverNode) {
        let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters);
        if (receiverNode && methodNode) {
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }

    if (names.length == 2) {
      let classInfo = ApexClassStore.get(name);
      if (classInfo) {
        let methodNode = this.searchStaticMethod(classInfo, names[1], node.parameters);
        if (classInfo && methodNode) {
          return new MethodSearchResult(classInfo, methodNode);
        }
      }
      if (NameSpaceStore.includes('System', name)) {
        const classInfo = NameSpaceStore.get('System', name);
        if (classInfo) {
          let methodNode = this.searchStaticMethod(classInfo, names[1], node.parameters);
          if (classInfo && methodNode) {
            return new MethodSearchResult(classInfo, methodNode);
          }
        }
      }
    }

    if (names.length >= 3) {
      let classNode = ApexClassStore.get(name);
      if (classNode) {
        let staticFieldName = names[1];
        if (staticFieldName in classNode.staticFields) {
          let staticField = classNode.staticFields[staticFieldName];
          let receiverNode = reduce(staticField, names.slice(2, names.length-1));
          if (receiverNode) {
            let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters);
            if (receiverNode && methodNode) {
              if (!methodNode.isPublic()) {
                throw `Method is not visible: ${methodName.name}`;
              }
              return new MethodSearchResult(receiverNode, methodNode);
            }
          }
        }
      }
    }

    if (names.length >= 3) {
      let classNode = NameSpaceStore.get(name, names[1]);
      if (classNode) {
        let staticFieldName = names[2];
        if (staticFieldName in classNode.staticFields) {
          let staticField = classNode.staticFields[staticFieldName];
          let receiverNode = reduce(staticField, names.slice(3, names.length-1));

          let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters);
          if (receiverNode && methodNode) {
            if (!methodNode.isPublic()) {
              throw `Method is not visible: ${methodName.name}`;
            }
            return new MethodSearchResult(receiverNode, methodNode);
          }
        }
      }
    }
  }

  searchMethodByType(node) {
    return this.searchMethod(node, reduceTypeByInstanceField);
  }

  searchMethodByValue(node, visitor) {
    if (!(node.nameOrExpression instanceof Ast.NameNode)) {
      let receiverNode = node.nameOrExpression.accept(visitor);
      let classNode = receiverNode.classNode;
      if (classNode) {
        let methodNode = this.searchInstanceMethod(classNode, node.methodName, node.parameters);
        if (!methodNode.isPublic()) {
          throw `Method is not visible: ${node.methodName}`;
        }
        return new MethodSearchResult(receiverNode, methodNode);
      }
    } else {
      return this.searchMethod(node, reduceValueByInstanceField);
    }
  }

  searchInstanceMethod(receiverNode, methodName, parameters) {
    const classNode = (() => {
      if (receiverNode instanceof Ast.TypeNode) {
        return receiverNode.classNode;
      } else {
        return receiverNode.type().classNode;
      }
    })();

    const methodNodes = (() => {
      if (methodName in classNode.instanceMethods) {
        return classNode.instanceMethods[methodName];
      } else if (classNode.superClass) {
        return this.searchInstanceMethod(classNode.superClass, methodName);
      } else {
        return null;
      }
    })();
    if (methodNodes == null) return null;

    return argumentChecker(methodNodes, parameters);
  }

  searchStaticMethod(classNode, methodName, parameters) {
    const methodNodes = (() => {
      if (methodName in classNode.staticMethods) {
        return classNode.staticMethods[methodName];
      } else if (classNode.superClass) {
        return this.searchInstanceMethod(classNode.superClass, methodName);
      } else {
        return null;
      }
    })();

    return argumentChecker(methodNodes, parameters);
  }
}

module.exports = new MethodSearcher();
