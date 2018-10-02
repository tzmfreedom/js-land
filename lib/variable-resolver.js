'use strict'

const ApexClassStore = require('./store/apex-class-store')
const ApexClass = require('./node/apex-class');
const NameSpaceStore = require('./store/name-space-store')
const ClassStaticFields = require('./store/class-static-fields')
const Ast = require('./node/ast')
const EnvManager = require('./env-manager')
const VariableResolveResult = require('./variable-resolve-result')
const modifier = require('./modifier-enum')

class VariableResolver {
  _resolve(node) {
    let names = node.value;
    let name = names[0];

    // variable.field...field
    if (EnvManager.localIncludes(name)) {
      if (names.length == 1) {
        return new VariableResolveResult(name, null);
      }
      let variable = EnvManager.get(name);
      let receiverNode = this.reduce(variable, names.slice(1), name !== 'this', node);
      if (receiverNode) return receiverNode;
    }

    // this_field.field...field
    if (EnvManager.localIncludes('this')) {
      let thisReceiverNode = EnvManager.get('this');
      let receiverNode = this.reduce(thisReceiverNode, names, false, node);
      if (receiverNode) return receiverNode;
    }

    if (names.length == 1) {
      if (EnvManager.localIncludes('_class')) {
        let classNode = EnvManager.getValue('_class');
        if (classNode && classNode.staticFields.includes(name)) {
          const field = ClassStaticFields.get(classNode.name, name);
          let receiverNode = this.reduce(field, names.slice(1), false, node);
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
        let receiverNode = this.reduce(field, names.slice(1), false, node);
        if (receiverNode) return receiverNode;
      }
    }

    // system.class.static_field...field
    if (names.length > 1) {
      let classNode = NameSpaceStore.get('System', name);
      let staticFieldName = names[1];
      if (classNode && classNode.staticFields.includes(staticFieldName)) {
        if (names.length == 2) return new VariableResolveResult(classNode, staticFieldName)
        const field = ClassStaticFields.get(classNode.name, staticFieldName);
        let receiverNode = this.reduce(field, names.slice(2), false, node);
        if (receiverNode) return receiverNode;
      }
    }

    // namespace.class.static_field...field
    if (names.length > 2) {
      let classNode = NameSpaceStore.get(name, names[1]);
      if (classNode) {
        let staticFieldName = names[2];
        if (classNode.staticFields.includes(staticFieldName)) {
          if (names.length === 3) return new VariableResolveResult(classNode, staticFieldName)
          const field = ClassStaticFields.get(classNode.name, staticFieldName);
          let receiverNode = this.reduce(field, names.slice(3), false, node);
          if (receiverNode) return receiverNode;
        }
      }
    }
    throw `Variable is not exist ${names.join('.')} at line ${node.lineno}`
  }

  resolve(node) {
    if (node instanceof Ast.FieldAccessNode) {
      return new VariableResolveResult(node.expression, node.fieldName);
    }
    return this._resolve(node);
  }

  resolveType(node) {
    const result = this._resolve(node);

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
        const instanceField = this.resolveInstanceField(receiverNode, result.key, modifier.PUBLIC)
        return instanceField.type;
      }
    } else {
      return EnvManager.get(result.receiverNode).type();
    }
  }
}

module.exports = VariableResolver;
