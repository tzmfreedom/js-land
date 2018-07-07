let Ast = require('./node/ast');
let ApexClassStore = require('./apexClass').ApexClassStore;
let ApexClass = require('./apexClass').ApexClass;
let LocalEnvironment = require('./localEnv');
let methodSearcher = require('./methodSearcher');
let ApexObject = require('./apexClass').ApexObject;

class SymbolDeclarator {
  visit(node) {
    return node.accept(this);
  }

  visitClass(node) {
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
    node.staticFields.forEach((field) => {
      let field_name = field.name;
      if (field_name in staticFields) {
        // TODO: lineno
        throw `Compile Error: duplicate static field name ${field_name} at line : `
      }
      staticFields[field_name] = field;
    });

    let instanceFields = {};
    node.instanceFields.forEach((field) => {
      field.declarators.forEach((declarator) => {
        if (declarator.name in instanceFields) {
          // TODO: lineno
          throw `Compile Error: duplicate instance field name ${declarator.name} at line : `
        }
        instanceFields[declarator.name] = declarator;
      });
    });

    const classInfo = new ApexClass(
      node.name,
      node.superClass,
      node.implementClasses,
      instanceFields,
      staticFields,
      instanceMethods,
      staticMethods,
    );

    ApexClassStore.register(classInfo);
    return classInfo;
  }

  visitTrigger(node) {

  }
}

module.exports = SymbolDeclarator;
