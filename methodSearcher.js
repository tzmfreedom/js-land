'use strict'

const ApexClassStore = require('./apexClass').ApexClassStore;
const ApexClass = require('./apexClass').ApexClass;
const NameSpaceStore = require('./apexClass').NameSpaceStore;
const Ast = require('./node/ast');
const EnvManager = require('./envManager');

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
    receiverNode = receiverNode.classNode.instanceFields[list[i]].type();
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
  constructor() {
    this.reduce = reduceTypeByInstanceField;
  }

  setInterpreterReducer() {
    this.reduce = reduceValueByInstanceField;
  }

  searchMethod(node, visitor, searchMethod = 'value') {
    if (searchMethod == 'value') {
      if (!(node.nameOrExpression instanceof Ast.NameNode)) {
        let receiverNode = node.nameOrExpression.accept(visitor);
        let classNode = receiverNode.classNode;
        if (classNode) {
          let methodNode = this.searchInstanceMethod(classNode, node.methodName);
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }

    let names = node.nameOrExpression.value;
    let name = names[0];
    let methodName = names[names.length - 1];

    if (EnvManager.localIncludes(name)) {
      let variable = EnvManager.get(name);
      let receiverNode = this.reduce(variable, names.slice(1, names.length-1));
      if (receiverNode) {
        let methodNode = this.searchInstanceMethod(receiverNode, methodName);
        if (receiverNode && methodNode) {
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }

    if (EnvManager.localIncludes('this')) {
      let variable = EnvManager.get('this');
      let receiverNode = this.reduce(variable, names.slice(1, names.length-1));
      if (receiverNode) {
        let methodNode = this.searchInstanceMethod(receiverNode, methodName);
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
      if (NameSpaceStore.includes('System', name)) {
        const classInfo = NameSpaceStore.get('System', name);
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
        let staticFieldName = names[1];
        if (staticFieldName in classNode.staticFields) {
          let staticField = classNode.staticFields[staticFieldName];
          let receiverNode = this.reduce(staticField, names.slice(2, names.length-1));
          if (receiverNode) {
            let methodNode = this.searchInstanceMethod(receiverNode, methodName);
            if (receiverNode && methodNode) {
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
          let receiverNode = this.reduce(staticField, names.slice(3, names.length-1));

          let methodNode = this.searchInstanceMethod(receiverNode, methodName);
          if (receiverNode && methodNode) {
            return new MethodSearchResult(receiverNode, methodNode);
          }
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
          receiverNode = receiverNode[searchMethod].classNode.instanceFields[list[i]];
        }
        return receiverNode;
      })();

      let key = names[names.length - 1];
      if (receiverNode && key in receiverNode.type().classNode.instanceFields) {
        return { receiverNode, key };
      }
    }

    // this_field.field...field
    if (EnvManager.localIncludes('this')) {
      let thisReceiverNode = EnvManager.get('this');
      if (names.length == 1 && name in thisReceiverNode.type().classNode.instanceFields) {
        return { receiverNode: thisReceiverNode, key: name };
      }
      if (name in thisReceiverNode.type().classNode.instanceFields) {
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
      return result.receiverNode.type().classNode.instanceFields[result.key].type;
    } else {
      return EnvManager.get(result.receiverNode).type();
    }
  }
  searchInstanceMethod(receiverNode, methodName) {
    let classNode;
    if (receiverNode instanceof Ast.TypeNode) {
      classNode = receiverNode.classNode;
    } else if (receiverNode instanceof ApexClass) {
      classNode = receiverNode;
    } else {
      classNode = receiverNode.type().classNode;
    }
    if (methodName in classNode.instanceMethods) {
      return classNode.instanceMethods[methodName];
    } else if (classNode.superClass) {
      return this.searchInstanceMethod(classNode.superClass.classNode, methodName);
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
    const parameters = node.parameters.map((parameter) => {
      return parameter.type.name.join('.');
    }).join(':');
    return `args:${parameters}`
  }
}

module.exports = new MethodSearcher();
