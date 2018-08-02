'use strict'

const EnvManager = require('./env-manager')
const ApexClassStore = require('./store/apex-class-store')
const NameSpaceStore = require('./store/name-space-store')

const resolveType = (node) => {
  const names = node.name;
  const name = names[0];

  if (names.length == 1) {
    const genericsMatcher = name.match(/^T:\d$/)
    if (genericsMatcher) return;

    if (name == 'void') return null;
    let classInfo = ApexClassStore.get(name);
    if (classInfo) return classInfo;

    classInfo = NameSpaceStore.get('System', name);
    if (classInfo) return classInfo;

    const parentClass = EnvManager.getValue('_class')
    if (parentClass) {
      const innerClass = parentClass.innerClasses.get(name)
      if (innerClass) return innerClass
    }

    throw `Undefined Type ${names.join('.')} at line ${node.lineno}`;
  } else {
    const className = names[1];
    let classInfo = ApexClassStore.get(name);
    if (classInfo && className in classInfo.innerClasses) {
      return classInfo.innerClasses[className];
    }
    classInfo = NameSpaceStore.get(name, className);
    if (classInfo) return classInfo;

    const parentClass = resolveType({ name: [name], lineno: node.lineno })
    if (parentClass) {
      const innerClass = parentClass.innerClasses.get(className)
      if (innerClass) return innerClass
    }

    throw `Undefined Type ${names.join('.')} at line ${node.lineno}`;
  }
};

module.exports = resolveType;
