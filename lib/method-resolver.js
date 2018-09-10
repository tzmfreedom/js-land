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

function reduceTypeByInstanceField(init, fieldNames, conditionState) {
  let receiverNode = init.type();
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i]
    if (!receiverNode) return null;
    const instanceField = searchInstanceField(receiverNode.classNode, fieldName, conditionState)
    if (!instanceField) {
      return null
    }

    receiverNode = instanceField.type;
  }
  return receiverNode;
};

function reduceValueByInstanceField(init, fieldNames) {
  let receiverNode = init.value;
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i]
    if (!receiverNode) return null;
    if (!(receiverNode.instanceFields.includes(fieldName))) return null;
    receiverNode = receiverNode.instanceFields.get(fieldName)
  }
  return receiverNode;
}

function searchInstanceField(classNode, fieldName, conditionState) {
  const instanceFields = classNode.instanceFields
  if (!(instanceFields.includes(fieldName))) {
    if (conditionState == condition.PRIVATE) {
      conditionState = condition.PROTECTED
    }
    if (classNode.superClass) {
      return searchInstanceField(classNode.superClass.classNode, fieldName, conditionState)
    }
  } else {
    const instanceField = instanceFields.get(fieldName)
    if (instanceField) {
      if (conditionState == condition.PUBLIC) {
        if (!(instanceField.isPublic())) {
          throw `Field is not visible: ${instanceField.name}`
        }
        if (instanceField.getter && !instanceField.getter.isPublic()) {
          throw `Field is not visible: ${instanceField.name}`
        }
      }
      if (conditionState == condition.PROTECTED) {
        if (instanceField.isPrivate()) {
          throw `Field is not visible: ${instanceField.name}`
        }
      }
      return instanceField
    }
  }
}

const condition = {
  PUBLIC: Symbol(),
  PROTECTED: Symbol(),
  PRIVATE: Symbol(),
}

class MethodResolver {
  searchMethod(node, reduce) {
    let names = node.nameOrExpression.value;
    let name = names[0];
    let methodName = names[names.length - 1];

    if (EnvManager.localIncludes(name)) {
      let variable = EnvManager.get(name);
      let receiverNode = reduce(variable, names.slice(1, names.length-1), name !== 'this');
      if (receiverNode) {
        const conditionState = (() => {
          if (name === 'this' && names.length == 2) {
            return condition.PRIVATE
          }
          return condition.PUBLIC
        })()
        let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters, conditionState);
        if (receiverNode && methodNode) {
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }

    if (EnvManager.localIncludes('this')) {
      let variable = EnvManager.get('this');
      let receiverNode = reduce(variable, names.slice(0, names.length-1), false);
      if (receiverNode) {
        const conditionState = (() => {
          if (names.length === 1) {
            return condition.PRIVATE
          }
          return condition.PUBLIC
        })()
        let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters, conditionState);
        if (receiverNode && methodNode) {
          return new MethodSearchResult(receiverNode, methodNode);
        }
      }
    }

    if (names.length == 1) {
      if (EnvManager.localIncludes('_class')) {
        let classNode = EnvManager.getValue('_class');
        if (classNode) {
          let methodNode = this.searchStaticMethod(classNode, name, node.parameters, condition.PRIVATE);
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
        let methodNode = this.searchStaticMethod(classInfo, names[1], node.parameters, condition.PUBLIC);
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
          let methodNode = this.searchStaticMethod(classInfo, names[1], node.parameters, condition.PUBLIC);
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
          let receiverNode = reduce(field, names.slice(2, names.length-1), false);
          if (receiverNode) {
            let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters, condition.PUBLIC);
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
          let receiverNode = reduce(field, names.slice(3, names.length-1), false);

          let methodNode = this.searchInstanceMethod(receiverNode, methodName, node.parameters, condition.PUBLIC);
          if (receiverNode && methodNode) {
            if (!methodNode.isPublic()) {
              throw `Method is not visible: ${methodNode.name} at line ${node.lineno}`;
            }
            return new MethodSearchResult(receiverNode, methodNode);
          }
        }

        if (names.length == 3) {
          let methodNode = this.searchStaticMethod(classNode, names[2], node.parameters, condition.PUBLIC);
          if (methodNode) {
            return new MethodSearchResult(classNode, methodNode);
          }
        }
      }
    }
  }

  searchMethodByType(node) {
    if (!(node.nameOrExpression instanceof Ast.NameNode)) {
      const fieldAccess = node.nameOrExpression;
      const receiverType = fieldAccess.expression.type();
      const methodNode = this.searchInstanceMethod(receiverType, fieldAccess.fieldName, node.parameters, condition.PUBLIC);
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
      const methodNode = this.searchInstanceMethod(receiverNode, fieldAccess.fieldName, node.parameters, condition.PUBLIC);
      return new MethodSearchResult(receiverNode, methodNode);
    } else {
      return this.searchMethod(node, reduceValueByInstanceField);
    }
  }

  searchInstanceMethod(receiverNode, methodName, parameters, conditionState) {
    const classNode = (() => {
      if (receiverNode instanceof Ast.TypeNode) {
        return receiverNode.classNode;
      } else {
        return receiverNode.type().classNode;
      }
    })();

    if (classNode.instanceMethods.includes(methodName)) {
      const methodNodes = classNode.instanceMethods.get(methodName);
      const methodNode = argumentChecker(receiverNode, methodNodes, parameters)
      if (methodNode) {
        this.checkMethodModifier(receiverNode, methodNode, conditionState)
        return methodNode
      }
    }
    if (classNode.superClass) {
      if (conditionState === condition.PRIVATE) {
        conditionState = condition.PROTECTED
      }
      const methodNode = this.searchInstanceMethod(classNode.superClass, methodName, parameters, conditionState);
      if (methodNode) {
        this.checkMethodModifier(receiverNode, methodNode, conditionState)
        return methodNode
      }
    }
  }

  searchStaticMethod(classNode, methodName, parameters, conditionState) {
    if (classNode.staticMethods.includes(methodName)) {
      const methodNodes = classNode.staticMethods.get(methodName);
      if (methodNodes == null) return null;

      const methodNode = argumentChecker(classNode, methodNodes, parameters)
      if (methodNode) {
        this.checkMethodModifier(classNode, methodNode, conditionState)
        return methodNode
      }
    } else {
      if (classNode.superClass) {
        if (conditionState === condition.PRIVATE) {
          conditionState = condition.PROTECTED
        }
        return this.searchStaticMethod(classNode.superClass.classNode, methodName, parameters, conditionState);
      }
      if (classNode.name != 'Object') {
        const ApexObject = NameSpaceStore.get('System', 'Object')
        return this.searchStaticMethod(ApexObject, methodName, parameters);
      }
    }
  }

  checkMethodModifier(receiverNode, methodNode, conditionState) {
    if (conditionState.PUBLIC && !methodNode.isPublic()) {
      throw `Method is not visible: ${methodNode.name} at line ${receiverNode.lineno}`;
    }
    if (conditionState.PROTECTED && methodNode.isPrivate()) {
      throw `Method is not visible: ${methodNode.name} at line ${receiverNode.lineno}`;
    }
  }
}


module.exports = new MethodResolver();
