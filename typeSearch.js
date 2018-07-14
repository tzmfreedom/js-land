'use strict'

const ApexClassStore = require('./apexClass').ApexClassStore;
const NameSpaceStore = require('./apexClass').NameSpaceStore;

const typeSearch = (node) => {
  const names = node.name;
  const name = names[0];

  if (names.length == 1) {
    if (name == 'void') return null;
    let classInfo = ApexClassStore.get(name);
    if (classInfo) return classInfo;

    classInfo = NameSpaceStore.get('System', name);
    if (classInfo) return classInfo;

    throw `Undefined Type ${name}`;
  } else {
    const className = names[1];
    let classInfo = ApexClassStore.get(name);
    if (classInfo && className in classInfo.innerClasses) {
      return classInfo.innerClasses[className];
    }
    classInfo = NameSpaceStore.get(name, className);
    if (classInfo) return classInfo;

    throw `Undefined Type ${name}`;
  }
};

module.exports = typeSearch;
