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
  } else if (names.length == 2) {
    const className = names[1];
    // ClassName.InnerClass
    let classInfo = ApexClassStore.get(name);
    if (classInfo && classInfo.innerClasses.includes(className)) {
      return classInfo.innerClasses.get(className);
    }
    // NameSpace.ClassName
    classInfo = NameSpaceStore.get(name, className);
    if (classInfo) return classInfo;
  } else {
    // NameSpace.ClassName.InnerClass
    const classInfo = NameSpaceStore.get(name, names[1]);
    if (classInfo && classInfo.innerClasses.includes(names[2])) {
      const innerClass = classInfo.innerClasses.get(names[2]);
      if (innerClass) return innerClass
    }
  }
  throw `Undefined Type ${names.join('.')} at line ${node.lineno}`;
};

module.exports = resolveType;
