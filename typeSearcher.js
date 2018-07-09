'use strict'

const ApexClassStore = require('./apexClass').ApexClassStore;
const NameSpaceStore = require('./apexClass').NameSpaceStore;

class TypeSearcher {
  search(node, visitor) {
    const names = node.name
    const name = names[0];

    if (names.length == 1) {
      let classInfo = ApexClassStore.get(name);
      if (classInfo) return classInfo;

      const nameSpace = NameSpaceStore.get('System');
      if (nameSpace && name in nameSpace) return nameSpace[name];

      throw 'Undefined Type';
    } else {
      const className = names[1];
      const classInfo = ApexClassStore.get(name);
      if (classInfo && className in classInfo.innerClasses) {
        return classInfo.innerClasses[className];
      }
      const nameSpace = NameSpaceStore.get(name);
      if (nameSpace && className in nameSpace) {
        return nameSpace[className];
      }
      throw 'Undefined Type';
    }
  }
}

module.exports = new TypeSearcher();
