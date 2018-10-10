'use strict'

const ApexClassStore = require('../store/apex-class-store')
const NameSpaceStore = require('../store/name-space-store')
const ClassStaticFields = require('../store/class-static-fields')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const VariableResolveResult = require('./variable-resolve-result')
const modifier = require('./modifier-enum')

class VariableResolver {
  _resolve (node) {
    const names = node.value
    const name = names[0]

    // variable.field...field
    if (EnvManager.localIncludes(name)) {
      if (names.length == 1) {
        return new VariableResolveResult(name, null)
      }
      const variable = EnvManager.get(name)
      const conditionState = name === 'this' ? modifier.PRIVATE : modifier.PUBLIC
      const receiverNode = this.reduce(variable, names.slice(1), conditionState, node)
      if (receiverNode) return receiverNode
    }

    // this_field.field...field
    if (EnvManager.localIncludes('this')) {
      const thisReceiverNode = EnvManager.get('this')
      const receiverNode = this.reduce(thisReceiverNode, names, modifier.PRIVATE, node)
      if (receiverNode) return receiverNode
    }

    if (names.length == 1) {
      if (EnvManager.localIncludes('_class')) {
        const classNode = EnvManager.getValue('_class')
        if (classNode && classNode.staticFields.includes(name)) {
          const field = ClassStaticFields.get(classNode.name, name)
          const receiverNode = this.reduce(field, names.slice(1), modifier.PUBLIC, node)
          if (receiverNode) return receiverNode
        }
      }
      // TODO: (this_class.)static_field.method
      // TODO: (this_class.)static_field.field...method
    }

    // class.static_field...field
    if (names.length > 1) {
      const classNode = ApexClassStore.get(name)
      const staticFieldName = names[1]
      if (classNode && classNode.staticFields.includes(staticFieldName)) {
        const field = ClassStaticFields.get(classNode.name, staticFieldName)
        const receiverNode = this.reduce(field, names.slice(1), modifier.PUBLIC, node)
        if (receiverNode) return receiverNode
      }
    }

    // system.class.static_field...field
    if (names.length > 1) {
      const classNode = NameSpaceStore.get('System', name)
      const staticFieldName = names[1]
      if (classNode && classNode.staticFields.includes(staticFieldName)) {
        if (names.length == 2) return new VariableResolveResult(classNode, staticFieldName)
        const field = ClassStaticFields.get(classNode.name, staticFieldName)
        const receiverNode = this.reduce(field, names.slice(2), modifier.PUBLIC, node)
        if (receiverNode) return receiverNode
      }
    }

    // namespace.class.static_field...field
    if (names.length > 2) {
      const classNode = NameSpaceStore.get(name, names[1])
      if (classNode) {
        const staticFieldName = names[2]
        if (classNode.staticFields.includes(staticFieldName)) {
          if (names.length === 3) return new VariableResolveResult(classNode, staticFieldName)
          const field = ClassStaticFields.get(classNode.name, staticFieldName)
          const receiverNode = this.reduce(field, names.slice(3), modifier.PUBLIC, node)
          if (receiverNode) return receiverNode
        }
      }
    }
    throw `Variable is not exist ${names.join('.')} at line ${node.lineno}`
  }

  resolve (node) {
    if (node instanceof Ast.FieldAccessNode) {
      return new VariableResolveResult(node.expression, node.fieldName)
    }
    return this._resolve(node)
  }

  resolveType (node) {
    const result = this._resolve(node)

    if (result.key) {
      if (result.receiverNode instanceof Ast.ApexClass) {
        return ClassStaticFields.get(result.receiverNode.name, result.key).type()
      } else {
        let receiverNode
        if (result.receiverNode instanceof Ast.TypeNode) {
          receiverNode = result.receiverNode
        } else {
          receiverNode = result.receiverNode.type()
        }
        const instanceField = this.resolveInstanceField(receiverNode, result.key)
        return instanceField.type
      }
    } else {
      return EnvManager.get(result.receiverNode).type()
    }
  }
}

module.exports = VariableResolver
