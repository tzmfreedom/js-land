let Ast = require('./node/ast');
let ApexClassStore = require('./apexClass').ApexClassStore;
let ApexClass = require('./apexClass').ApexClass;
let methodSearcher = require('./methodSearcher');
let TriggerStore = require('./trigger_store');

class SymbolDeclarator {
  visit(node) {
    return node.accept(this);
  }

  visitClass(node) {
    let constructors = {};
    node.constructor.forEach((method) => {
      let parameterHash = methodSearcher.calculateMethodParameterHash(method);
      if (parameterHash in constructors) {
        // TODO: lineno
        throw `Compile Error: duplicate method name ${method.name} at line : `
      }
      constructors[parameterHash] = method;
    });

    let staticMethods = {};
    node.staticMethods.forEach((method) => {
      if (!staticMethods[method.name]) staticMethods[method.name] = {};
      let parameterHash = methodSearcher.calculateMethodParameterHash(method);
      if (parameterHash in staticMethods[method.name]) {
        // TODO: lineno
        throw `Compile Error: duplicate method name ${method.name} at line : `
      }
      staticMethods[method.name][parameterHash] = method;
    });

    let instanceMethods = {};
    node.instanceMethods.forEach((method) => {
      if (!instanceMethods[method.name]) instanceMethods[method.name] = {};
      let parameterHash = methodSearcher.calculateMethodParameterHash(method);
      if (parameterHash in instanceMethods[method.name]) {
        // TODO: lineno
        throw `Compile Error: duplicate static method name ${method.name} at line : `
      }
      instanceMethods[method.name][parameterHash] = method;
    });

    let staticFields = {};
    node.staticFields.forEach((declaration) => {
      declaration.declarators.forEach((declarator) => {
        let fieldName = declarator.name;
        if (fieldName in staticFields) {
          // TODO: lineno
          throw `Compile Error: duplicate static field name ${fieldName} at line : `
        }
        staticFields[fieldName] = {
          type: declaration.type,
          expression: declarator.expression,
        };
      });
    });

    let instanceFields = {};
    node.instanceFields.forEach((declaration) => {
      if (declaration instanceof Ast.PropertyDeclarationNode) {
        let fieldName = declaration.identifier;
        if (fieldName in instanceFields) {
          // TODO: lineno
          throw `Compile Error: duplicate instance field name ${fieldName} at line : `
        }
        instanceFields[fieldName] = {
          type: declaration.type,
          setter: declaration.setter,
          getter: declaration.getter,
        };
        if (declaration.getter_or_setter.type == 'setter') {
          instanceFields[fieldName].setter = declaration.getter_or_setter.methodBody
        } else {
          instanceFields[fieldName].getter = declaration.getter_or_setter.methodBody
        }
      } else {
        declaration.declarators.forEach((declarator) => {
          let fieldName = declarator.name;
          if (fieldName in instanceFields) {
            // TODO: lineno
            throw `Compile Error: duplicate instance field name ${fieldName} at line : `
          }
          instanceFields[fieldName] = {
            type: declaration.type,
            expression: declarator.expression,
          };
        });
      }
    });

    let innerClasses = {};
    node.innerClasses.forEach((innerClass) => {
      let innerClassName = innerClass.name;
      if (innerClassName in innerClasses) {
        // TODO: lineno
        throw `Compile Error: duplicate instance field name ${innerClassName} at line : `
      }
      innerClasses[innerClassName] = innerClass.accept(this);
    });

    const classInfo = new ApexClass(
      node.name,
      node.superClass,
      node.implementClasses,
      constructors,
      instanceFields,
      staticFields,
      instanceMethods,
      staticMethods,
      innerClasses
    );

    ApexClassStore.register(classInfo);
    return classInfo;
  }

  visitTrigger(node) {
    TriggerStore.add(node.object, node);
    return node;
  }
}

module.exports = SymbolDeclarator;
