'use strict'

const ApexClassStore = require('./store/apex-class-store')
const NameSpaceStore = require('./store/name-space-store')
const ClassStaticFields = require('./store/class-static-fields')
const Ast = require('./node/ast');
const EnvManager = require('./env-manager');
const argumentChecker = require('./argument-checker');

class MethodSearchResult {
  constructor(receiverNode, methodNode) {
    this.receiverNode = receiverNode;
    this.methodNode = methodNode;
  }
}

const reduceTypeByInstanceField = (init, fieldNames, privateCheck) => {
  let receiverNode = init.type();
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i]
    if (!receiverNode) return null;
    if (!(receiverNode.classNode.instanceFields.includes(fieldName))) return null;
    const instanceField = receiverNode.classNode.instanceFields.get(fieldName);
    if (i === 0 && privateCheck && !(instanceField.isPublic())) {
      throw `Field is not visible: ${instanceField.name}`;
    }
    if (i !== 0) {
      if (!(instanceField.isPublic())) {
        throw `Field is not visible: ${instanceField.name}`;
      }
      if (instanceField.getter && !instanceField.getter.isPublic()) {
        throw `Field is not visible: ${instanceField.name}`;
      }
    }
    receiverNode = instanceField.type;
  }
  return receiverNode;
};

const reduceValueByInstanceField = (init, fieldNames) => {
  let receiverNode = init.value;
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i]
    if (!receiverNode) return null;
    if (!(receiverNode.instanceFields.includes(fieldName))) return null;
    receiverNode = receiverNode.instanceFields.get(fieldName)
  }
  return receiverNode;
};

class MethodResolver {
  searchMethod(node, reduce) {
    let names = node.nameOrExpression.value;
    let name = names[0];
    let methodName = names[names.length - 1];

    if (EnvManager.localIncludes(name)) {
      let variable = EnvManager.get(name);
      let receiverNode = reduce(variable, names.slice(1, names.length-1), name !== 'this');
      if (receiverNode) {
        let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters);
        if (receiverNode && methodNode) {
          if (!(names.length === 2 && name === 'this')) {
            if (!(methodNode.isPublic())) {
              throw `Method is not visible: ${methodNode.name} at line ${node.lineno}`;
            }
          }
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }

    if (EnvManager.localIncludes('this')) {
      let variable = EnvManager.get('this');
      let receiverNode = reduce(variable, names.slice(0, names.length-1), false);
      if (receiverNode) {
        let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters);
        if (receiverNode && methodNode) {
          if (names.length !== 1 && !(methodNode.isPublic())) {
            throw `Method is not visible: ${methodNode.name} at line ${node.lineno}`;
          }
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }

    if (names.length == 1) {
      if (EnvManager.localIncludes('_class')) {
        let classNode = EnvManager.getValue('_class');
        if (classNode) {
          let methodNode = this.searchStaticMethod(classNode, name, node.parameters);
          if (methodNode) {
            if (!methodNode.isPublic()) {
              throw `Method is not visible: ${methodNode.name} at line ${node.lineno}`;
            }
            return new MethodSearchResult(classNode, methodNode)
          }
        }
      }
      // TODO: (this_class.)static_field.method
      // TODO: (this_class.)static_field.field...method
    }

    if (names.length == 2) {
      let classInfo = ApexClassStore.get(name);
      if (classInfo) {
        let methodNode = this.searchStaticMethod(classInfo, names[1], node.parameters);
        if (classInfo && methodNode) {
          if (!(methodNode.isPublic())) {
            throw `Method is not visible: ${methodNode.name} at line ${node.lineno}`;
          }
          return new MethodSearchResult(classInfo, methodNode);
        }
      }
      if (NameSpaceStore.includes('System', name)) {
        const classInfo = NameSpaceStore.get('System', name);
        if (classInfo) {
          let methodNode = this.searchStaticMethod(classInfo, names[1], node.parameters);
          if (classInfo && methodNode) {
            if (!(methodNode.isPublic())) {
              throw `Method is not visible: ${methodNode.name} at line ${node.lineno}`;
            }
            return new MethodSearchResult(classInfo, methodNode);
          }
        }
      }
    }

    if (names.length >= 3) {
      let classNode = ApexClassStore.get(name);
      if (classNode) {
        let staticFieldName = names[1];
        if (classNode.staticFields.includes(staticFieldName)) {
          const field = ClassStaticFields.get(classNode.name, staticFieldName);
          let receiverNode = reduce(field, names.slice(2, names.length-1));
          if (receiverNode) {
            let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters);
            if (receiverNode && methodNode) {
              if (!methodNode.isPublic()) {
                throw `Method is not visible: ${methodNode.name} at line ${node.lineno}`;
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
        if (classNode.staticFields.includes(staticFieldName)) {
          const field = ClassStaticFields.get(classNode.name, staticFieldName);
          let receiverNode = reduce(field, names.slice(3, names.length-1));

          let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters);
          if (receiverNode && methodNode) {
            if (!methodNode.isPublic()) {
              throw `Method is not visible: ${methodNode.name} at line ${node.lineno}`;
            }
            return new MethodSearchResult(receiverNode, methodNode);
          }
        }
      }
    }
  }

  searchMethodByType(node) {
    if (!(node.nameOrExpression instanceof Ast.NameNode)) {
      const fieldAccess = node.nameOrExpression;
      const receiverType = fieldAccess.expression.type();
      const methodNode = this.searchInstanceMethod(receiverType, fieldAccess.fieldName, node.parameters);
      if (!methodNode) {
        throw `Method is not defined: ${fieldAccess.fieldName} at line ${node.lineno}`;
      }
      return new MethodSearchResult(fieldAccess.expression, methodNode);
    } else {
      return this.searchMethod(node, reduceTypeByInstanceField);
    }
  }

  searchMethodByValue(node, visitor) {
    if (!(node.nameOrExpression instanceof Ast.NameNode)) {
      const fieldAccess = node.nameOrExpression;
      const receiverNode = fieldAccess.expression.accept(visitor);
      const methodNode = this.searchInstanceMethod(receiverNode, fieldAccess.fieldName, node.parameters);
      if (!methodNode.isPublic()) {
        throw `Method is not visible: ${methodNode.name} at line ${node.lineno}`;
      }
      return new MethodSearchResult(receiverNode, methodNode);
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

    return argumentChecker(receiverNode, methodNodes, parameters);
  }

  searchStaticMethod(classNode, methodName, parameters) {
    const methodNodes = (() => {
      if (methodName in classNode.staticMethods) {
        return classNode.staticMethods[methodName];
      } else if (classNode.superClass) {
        return this.searchStaticMethod(classNode.superClass, methodName);
      } else {
        return null;
      }
    })();
    if (methodNodes == null) return null;

    return argumentChecker(classNode, methodNodes, parameters);
  }
}

module.exports = new MethodResolver();
