'use strict'

const ApexClassStore = require('./node/apexClass').ApexClassStore;
const ApexClass = require('./node/apexClass').ApexClass;
const NameSpaceStore = require('./store/name-space-store')
const ClassStaticFields = require('./store/class-static-fields')
const Ast = require('./node/ast');
const EnvManager = require('./env-manager');

const reduceTypeByInstanceField = (checkSetterGetter, isSetter) => {
  return (init, fieldNames, privateCheck, node) => {
    let receiverNode = init.type();
    for (let i = 0; i < fieldNames.length - 1; i++) {
      const fieldName = fieldNames[i]
      if (!receiverNode) return null;
      if (!(fieldName in receiverNode.classNode.instanceFields)) return null;
      const instanceField = receiverNode.classNode.instanceFields[fieldName];
      if (i === 0 && privateCheck && !(instanceField.isPublic())) {
        throw `Field is not visible: ${instanceField.name} at line ${node.lineno}`;
      }
      if (i !== 0) {
        if (!(instanceField.isPublic())) {
          throw `Field is not visible: ${instanceField.name} at line ${node.lineno}`;
        }
        if (instanceField.getter && !instanceField.getter.isPublic()) {
          throw `Field is not visible: ${instanceField.name} at line ${node.lineno}`;
        }
      }
      receiverNode = instanceField.type;
    }

    let key = fieldNames[fieldNames.length - 1];
    if (receiverNode && key in receiverNode.classNode.instanceFields) {
      if (checkSetterGetter && privateCheck) {
        const instanceField = receiverNode.classNode.instanceFields[key]
        if (!(instanceField.isPublic())) {
          throw `Field is not visible: ${key} at line ${node.lineno}`;
        }
        if (isSetter && instanceField.setter && !instanceField.setter.isPublic()) {
          throw `Field is not visible: ${key} at line ${node.lineno}`;
        }
        if (!isSetter && instanceField.getter && !instanceField.getter.isPublic()) {
          throw `Field is not visible: ${key} at line ${node.lineno}`;
        }
      }
      return new VariableSearchResult(receiverNode, key);
    }
  };
};

const reduceValueByInstanceField = (init, fieldNames, node) => {
  let receiverNode = init.value;
  for (let i = 0; i < fieldNames.length - 1; i++) {
    const fieldName = fieldNames[i]
    if (receiverNode instanceof Ast.NullNode) {
      throw `Null pointer exception : ${fieldName} at line ${node.lineno}`;
    }
    if (!(fieldName in receiverNode.instanceFields)) return null;
    receiverNode = receiverNode.instanceFields[fieldName]
  }
  let key = fieldNames[fieldNames.length - 1];
  if (receiverNode instanceof Ast.NullNode) {
    throw `Null pointer exception : ${key} at line ${node.lineno}`
  }
  if (receiverNode && key in receiverNode.instanceFields) {
    return new VariableSearchResult(receiverNode, key);
  }
};

class VariableSearchResult {
  constructor(receiverNode, key) {
    this.receiverNode = receiverNode;
    this.key = key;
  }
}

class VariableResolver {
  searchField(node, reduce) {
    let names = node.value;
    let name = names[0];

    // variable.field...field
    if (EnvManager.localIncludes(name)) {
      if (names.length == 1) {
        return new VariableSearchResult(name, null);
      }
      let variable = EnvManager.get(name);
      let receiverNode = reduce(variable, names.slice(1), name !== 'this', node);
      if (receiverNode) return receiverNode;
    }

    // this_field.field...field
    if (EnvManager.localIncludes('this')) {
      let thisReceiverNode = EnvManager.get('this');
      if (name in thisReceiverNode.type().classNode.instanceFields) {
        let receiverNode = reduce(thisReceiverNode, names, false, node);
        if (receiverNode) return receiverNode;
      }
    }

    // class.static_field...field
    if (names.length > 1) {
      let classNode = ApexClassStore.get(name);
      let staticFieldName = names[1];
      if (classNode && staticFieldName in classNode.staticFields) {
        const field = ClassStaticFields.get(classNode.name, staticFieldName);
        let receiverNode = reduce(field, names.slice(1), false, node);
        if (receiverNode) return receiverNode;
      }
    }

    // system.class.static_field...field
    if (names.length > 1) {
      let classNode = NameSpaceStore.get('System', name);
      let staticFieldName = names[1];
      if (classNode && staticFieldName in classNode.staticFields) {
        if (names.length == 2) return new VariableSearchResult(classNode, staticFieldName)
        const field = ClassStaticFields.get(classNode.name, staticFieldName);
        let receiverNode = reduce(field, names.slice(2), false, node);
        if (receiverNode) return receiverNode;
      }
    }

    // namespace.class.static_field...field
    if (names.length > 2) {
      let classNode = NameSpaceStore.get(name, names[1]);
      if (classNode) {
        let staticFieldName = names[2];
        if (staticFieldName in classNode.staticFields) {
          if (names.length === 3) return new VariableSearchResult(classNode, staticFieldName)
          const field = ClassStaticFields.get(classNode.name, staticFieldName);
          let receiverNode = reduce(field, names.slice(3), false, node);
          if (receiverNode) return receiverNode;
        }
      }
    }
    throw `Variable is not exist ${names.join('.')} at line ${node.lineno}`
  }

  searchFieldByValue(node) {
    if (node instanceof Ast.FieldAccessNode) {
      return new VariableSearchResult(node.expression, node.fieldName);

    } else {
      return this.searchField(node, reduceValueByInstanceField);
    }
  }

  searchFieldByType(node, isSetter) {
    if (node instanceof Ast.FieldAccessNode) {
      return new VariableSearchResult(node.expression, node.fieldName);
    } else {
      return this.searchField(node, reduceTypeByInstanceField(true, isSetter));
    }
  }

  searchFieldType(node, isSetter) {
    const result = this.searchField(node, reduceTypeByInstanceField(false, isSetter));

    if (result.key) {
      if (result.receiverNode instanceof ApexClass) {
        return ClassStaticFields.get(result.receiverNode.name, result.key).type()
      } else {
        const receiverNode = (() => {
          if (result.receiverNode instanceof Ast.TypeNode) {
            return result.receiverNode;
          } else {
            return result.receiverNode.type();
          }
        })();
        return receiverNode.classNode.instanceFields[result.key].type;
      }
    } else {
      return EnvManager.get(result.receiverNode).type();
    }
  }
}

module.exports = new VariableResolver();
