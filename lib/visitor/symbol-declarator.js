const Ast = require('../node/ast')
const ApexClassStore = require('../store/apex-class-store')
const ApexClass = require('../node/apex-class')
const ApexInterface = require('../node/apex-interface')
const TriggerStore = require('../store/trigger-store')

class SymbolDeclarator {
  visit (node) {
    const classInfo = node.accept(this)
    ApexClassStore.register(classInfo)
    return classInfo
  }

  visitClass (node) {
    const constructors = []
    node.constructor.forEach((method) => {
      // TODO: duplication error
      // if (parameterHash in constructors) {
      //   throw `Compile Error: duplicate method name ${method.name} at line : ${method.lineno}`
      // }
      constructors.push(method)
    })

    const staticMethods = {}
    node.staticMethods.forEach((method) => {
      if (!staticMethods[method.name]) staticMethods[method.name] = []
      // if (parameterHash in staticMethods[method.name]) {
      //   throw `Compile Error: duplicate method name ${method.name} at line : ${method.lineno}`
      // }
      staticMethods[method.name].push(method)
    })

    const instanceMethods = {}
    node.instanceMethods.forEach((method) => {
      if (!instanceMethods[method.name]) instanceMethods[method.name] = []
      // let parameterHash = methodSearcher.calculateMethodParameterHash(method);
      // if (parameterHash in instanceMethods[method.name]) {
      //   throw `Compile Error: duplicate static method name ${method.name} at line : ${method.lineno}`
      // }
      instanceMethods[method.name].push(method)
    })

    const staticFields = {}
    node.staticFields.forEach((declaration) => {
      if (declaration instanceof Ast.PropertyDeclarationNode) {
        const fieldName = declaration.identifier
        if (fieldName in staticFields) {
          throw `Compile Error: duplicate instance field name ${fieldName} at line : ${declaration.lineno}`
        }
        staticFields[fieldName] = new Ast.FieldVariableNode(
          declaration.type,
          declaration.modifiers,
          new Ast.NullNode(declaration.lineno),
          declaration.lineno
        )
        declaration.getter_setters.forEach((getter_setter) => {
          if (getter_setter.type == 'setter') {
            staticFields[fieldName].setter = getter_setter
          } else {
            staticFields[fieldName].getter = getter_setter
          }
        })
      } else {
        declaration.declarators.forEach((declarator) => {
          const fieldName = declarator.name
          if (fieldName in staticFields) {
            throw `Compile Error: duplicate static field name ${fieldName} at line : ${declarator.lineno}`
          }
          staticFields[fieldName] = new Ast.FieldVariableNode(
            declaration.type,
            declaration.modifiers,
            declarator.expression,
            declarator.lineno
          )
        })
      }
    })

    const instanceFields = {}
    node.instanceFields.forEach((declaration) => {
      if (declaration instanceof Ast.PropertyDeclarationNode) {
        const fieldName = declaration.identifier
        if (fieldName in instanceFields) {
          throw `Compile Error: duplicate instance field name ${fieldName} at line : ${declaration.lineno}`
        }
        instanceFields[fieldName] = new Ast.FieldVariableNode(
          declaration.type,
          declaration.modifiers,
          new Ast.NullNode(declaration.lineno),
          declaration.lineno
        )
        declaration.getter_setters.forEach((getter_setter) => {
          if (getter_setter.type == 'setter') {
            instanceFields[fieldName].setter = getter_setter
          } else {
            instanceFields[fieldName].getter = getter_setter
          }
        })
      } else {
        declaration.declarators.forEach((declarator) => {
          const fieldName = declarator.name
          if (fieldName in instanceFields) {
            throw `Compile Error: duplicate instance field name ${fieldName} at line : ${declarator.lineno}`
          }
          instanceFields[fieldName] = new Ast.FieldVariableNode(
            declaration.type,
            declaration.modifiers,
            declarator.expression,
            declarator.lineno
          )
        })
      }
    })

    const innerClasses = {}
    node.innerClasses.forEach((innerClass) => {
      const innerClassName = innerClass.name
      if (innerClassName in innerClasses) {
        throw `Compile Error: duplicate class name ${innerClassName} at line : ${innerClass.lineno}`
      }
      innerClasses[innerClassName] = innerClass.accept(this)
    })

    const classInfo = new ApexClass(
      node.name,
      node.superClass,
      node.implementClasses,
      constructors,
      instanceFields,
      staticFields,
      instanceMethods,
      staticMethods,
      innerClasses,
      node.modifiers
    )

    return classInfo
  }

  visitTrigger (node) {
    TriggerStore.add(node.object, node)
    return node
  }

  visitInterface (node) {
    const staticMethods = {}
    node.staticMethods.forEach((method) => {
      if (!staticMethods[method.name]) staticMethods[method.name] = []
      // if (parameterHash in staticMethods[method.name]) {
      //   throw `Compile Error: duplicate method name ${method.name} at line : ${method.lineno}`
      // }
      staticMethods[method.name].push(method)
    })

    const instanceMethods = {}
    node.instanceMethods.forEach((method) => {
      if (!instanceMethods[method.name]) instanceMethods[method.name] = []
      // let parameterHash = methodSearcher.calculateMethodParameterHash(method);
      // if (parameterHash in instanceMethods[method.name]) {
      //   throw `Compile Error: duplicate static method name ${method.name} at line : ${method.lineno}`
      // }
      instanceMethods[method.name].push(method)
    })

    const interfaceInfo = new ApexInterface(
      node.name,
      node.superClass,
      instanceMethods,
      staticMethods
    )

    return interfaceInfo
  }
}

module.exports = SymbolDeclarator
