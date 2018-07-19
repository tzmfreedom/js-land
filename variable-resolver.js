'use strict'

const ApexClassStore = require('./apexClass').ApexClassStore;
const ApexClass = require('./apexClass').ApexClass;
const NameSpaceStore = require('./apexClass').NameSpaceStore;
const Ast = require('./node/ast');
const EnvManager = require('./env-manager');
const Variable = require('./variable');

const reduceTypeByInstanceField = (init, fieldNames, privateCheck) => {
  let receiverNode = init.type();
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i]
    if (!receiverNode) return null;
    if (!(fieldName in receiverNode.classNode.instanceFields)) return null;
    const instanceField = receiverNode.classNode.instanceFields[fieldName];
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
    receiverNode = instanceField.type();
  }
  return receiverNode;
};

const reduceValueByInstanceField = (init, fieldNames) => {
  let receiverNode = init.value;
  let instanceField;
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i]
    if (receiverNode instanceof Ast.NullNode) {
      throw `Null pointer exception : ${instanceField.name}`;
    }
    if (!(fieldName in receiverNode.instanceFields)) return null;
    receiverNode = receiverNode.instanceFields[fieldName]
  }
  return receiverNode;
};

class VariableSearchResult {
  constructor(receiverNode, key) {
    this.receiverNode = receiverNode;
    this.key = key;
  }
}

class VariableResolver {
  searchField(node, reduce, fieldIncludes) {
    let names = node.value;
    let name = names[0];

    // variable.field...field
    if (EnvManager.localIncludes(name)) {
      if (names.length == 1) {
        return { receiverNode: name, key: null };
      }
      let variable = EnvManager.get(name);
      let receiverNode = reduce(variable, names.slice(1, names.length-1));

      let key = names[names.length - 1];
      if (receiverNode && fieldIncludes(key, receiverNode)) {
        return new VariableSearchResult(receiverNode, key);
      }
    }

    // this_field.field...field
    if (EnvManager.localIncludes('this')) {
      let thisReceiverNode = EnvManager.get('this');
      if (names.length == 1 && name in thisReceiverNode.type().classNode.instanceFields) {
        return { receiverNode: thisReceiverNode.value, key: name };
      }
      if (name in thisReceiverNode.type().classNode.instanceFields) {
        let field = thisReceiverNode.instanceFields[name];
        let receiverNode = reduce(field, names.slice(0, names.length-1));
        let key = names[names.length - 1];
        if (receiverNode && fieldIncludes(key, receiverNode)) {
          return new VariableSearchResult(receiverNode, key);
        }
      }
    }

    // class.static_field...field
    if (names.length > 1) {
      let apexClass = ApexClassStore.get(name);
      let staticFieldName = names[1];
      if (apexClass && staticFieldName in apexClass.staticFields) {
        const field =apexClass.staticFields[staticFieldName];
        let receiverNode = reduce(field, names.slice(1, names.length-1));

        let key = names[names.length - 1];
        if (receiverNode && fieldIncludes(key, receiverNode)) {
          return new VariableSearchResult(receiverNode, key);
        }
      }
    }

    if (names.length > 2) {
      let classNode = NameSpaceStore.get(name, names[1]);
      if (classNode) {
        let staticFieldName = names[2];
        if (staticFieldName in classNode.staticFields) {
          let receiverNode = reduce(field, names.slice(2, names.length-1));

          let key = names[names.length - 1];
          if (receiverNode && fieldIncludes(key, receiverNode)) {
            return new VariableSearchResult(receiverNode, key);
          }
        }
      }
    }
  }

  searchFieldByValue(node) {
    return this.searchField(node, reduceValueByInstanceField, (key, receiver) => {
      return key in receiver.instanceFields;
    });
  }

  searchFieldByType(node) {
    return this.searchField(node, reduceTypeByInstanceField, (key, receiver) => {
      return key in receiver.classNode.instanceFields;
    });
  }

  searchFieldType(node) {
    const result = this.searchField(node, reduceTypeByInstanceField, (key, receiver) => {
      return key in receiver.classNode.instanceFields;
    });

    if (result.key) {
      if (result.receiverNode instanceof ApexClass) {
        return result.receiverNode.staticFields[result.key].type;
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
