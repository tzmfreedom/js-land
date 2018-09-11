'use strict'

const ApexClassStore = require('./store/apex-class-store')
const ApexClass = require('./node/apex-class');
const NameSpaceStore = require('./store/name-space-store')
const ClassStaticFields = require('./store/class-static-fields')
const Ast = require('./node/ast');
const EnvManager = require('./env-manager');

const reduceTypeByInstanceField = (checkSetterGetter, isSetter) => {
  return (init, fieldNames, conditionState) => {
    let receiverNode = init.type();
    for (let i = 0; i < fieldNames.length - 1; i++) {
      const fieldName = fieldNames[i]
      if (!receiverNode) return null;
      const instanceField = searchInstanceField(receiverNode, fieldName, conditionState)
      if (!instanceField) return null;
      receiverNode = instanceField.type;
    }

    let key = fieldNames[fieldNames.length - 1];
    const instanceField = searchInstanceField(receiverNode, key, conditionState)
    if (receiverNode && instanceField) {
      return new VariableSearchResult(receiverNode, key);
    }
  };
};

const condition = {
  PRIVATE: Symbol(),
  PUBLIC: Symbol(),
  PROTECTED: Symbol(),
}

const searchInstanceField = (receiverNode, fieldName, conditionState) => {
  const classNode = (() => {
    if (receiverNode instanceof Ast.TypeNode) {
      return receiverNode.classNode;
    } else {
      return receiverNode.type().classNode;
    }
  })();

  if (classNode.instanceFields.includes(fieldName)) {
    const instanceField = classNode.instanceFields.get(fieldName);
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
    if (instanceField) return instanceField
  }
  if (classNode.superClass) {
    if (conditionState == condition.PRIVATE) {
      conditionState = condition.PROTECTED
    }
    const instanceField = searchInstanceField(classNode.superClass, fieldName, conditionState);
    if (instanceField) return instanceField
  }
}

const reduceValueByInstanceField = (init, fieldNames, node, conditionState) => {
  let receiverNode = init.value;
  for (let i = 0; i < fieldNames.length - 1; i++) {
    const fieldName = fieldNames[i]
    if (receiverNode instanceof Ast.NullNode) {
      throw `Null pointer exception : ${fieldName} at line ${node.lineno}`;
    }
    // TODO: value/typeでsearchInstanceFieldをわける必要がある
    receiverNode = searchInstanceField(receiverNode, fieldName, conditionState)
    if (!receiverNode) return null;
  }
  let key = fieldNames[fieldNames.length - 1];
  if (receiverNode instanceof Ast.NullNode) {
    throw `Null pointer exception : ${key} at line ${node.lineno}`
  }
  if (receiverNode && receiverNode.instanceFields.includes(key)) {
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
      let receiverNode = reduce(thisReceiverNode, names, false, node);
      if (receiverNode) return receiverNode;
    }

    if (names.length == 1) {
      if (EnvManager.localIncludes('_class')) {
        let classNode = EnvManager.getValue('_class');
        if (classNode && classNode.staticFields.includes(name)) {
          const field = ClassStaticFields.get(classNode.name, name);
          let receiverNode = reduce(field, names.slice(1), false, node);
          if (receiverNode) return receiverNode;
        }
      }
      // TODO: (this_class.)static_field.method
      // TODO: (this_class.)static_field.field...method
    }

    // class.static_field...field
    if (names.length > 1) {
      let classNode = ApexClassStore.get(name);
      let staticFieldName = names[1];
      if (classNode && classNode.staticFields.includes(staticFieldName)) {
        const field = ClassStaticFields.get(classNode.name, staticFieldName);
        let receiverNode = reduce(field, names.slice(1), false, node);
        if (receiverNode) return receiverNode;
      }
    }

    // system.class.static_field...field
    if (names.length > 1) {
      let classNode = NameSpaceStore.get('System', name);
      let staticFieldName = names[1];
      if (classNode && classNode.staticFields.includes(staticFieldName)) {
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
        if (classNode.staticFields.includes(staticFieldName)) {
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
        const instanceField = searchInstanceField(receiverNode, result.key, condition.PUBLIC)
        return instanceField.type;
      }
    } else {
      return EnvManager.get(result.receiverNode).type();
    }
  }
}

module.exports = new VariableResolver();
