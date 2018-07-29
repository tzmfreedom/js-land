const Ast = require('./node/ast');
const TypeStore = require('./store/type-store')
const fs = require('fs');
const DatabaseAdapterRegister = require('./database/database-adapter-register')
const NameSpaceStore = require('./store/name-space-store')
const CaseIgnoredStore = require('./store/case-ignored-store')
const path = require('path')
const adapterFiles = fs.readdirSync(path.resolve(__dirname, './database'))
adapterFiles.forEach((adapterFile) => {
  require(`./database/${adapterFile}`)
})

class DataManager {
  constructor(type) {
    this.adapter = DatabaseAdapterRegister.get(type)
    this.records = new CaseIgnoredStore()
  }

  load(soql) {
    // console.log(require('util').inspect(soql, { colors: true, depth: 10 }))
    const listObject = new Ast.ApexObjectNode()
    listObject.classType = new Ast.TypeNode(
      ['List'],
      [
        new Ast.TypeNode([soql.fromObject], [])
      ]
    )
    listObject.classType.classNode = NameSpaceStore.get('System', 'List')
    listObject.instanceFields = new CaseIgnoredStore()
    const records = this.adapter.load(soql)
    listObject._records = records.map((record) => {
      const fields = {}
      record.keys().forEach((key) => {
        const value = record.get(key)
        if (parseInt(value) && value.match(/^(\-|\+)?\d*$/)) {
          fields[key] = new Ast.IntegerNode(parseInt(value))
        } else {
          fields[key] = new Ast.StringNode(value)
        }
      })
      return new Ast.ApexObjectNode(
        TypeStore.get('SObject'),
        new CaseIgnoredStore(fields),
        []
      )
    })
    return listObject
  }

  insert(sObject) {
    this.adapter.insert(sObject)
  }

  update(sObject) {
    this.adapter.update(sObject)
  }

  delete(sObject) {
    this.adapter.delete(sObject)
  }

  undelete(sObject) {
    this.adapter.updelete(sObject)
  }

  upsert(sObject) {
    this.adapter.upsert(sObject)
  }
}

module.exports = new DataManager('sqlite3');