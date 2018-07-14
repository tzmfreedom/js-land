let typeStore = {};
class TypeStore {
  static get(typeName) {
    return typeStore[typeName];
  }

  static set(typeName, typeNode) {
    typeStore[typeName] = typeNode;
  }
}

module.exports = TypeStore;

