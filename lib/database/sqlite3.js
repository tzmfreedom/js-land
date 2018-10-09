'use strict'

const CaseIgnoredStore = require('../store/case-ignored-store')
const DatabaseAdapterRegister = require('./database-adapter-register')
var Database = require('better-sqlite3')
const fs = require('fs')

class Sqlite3Adapter {
  constructor () {
    this.db = new Database('./test-db', { memory: true })
    this.setupDB()
  }

  load (soql, visitor) {
    const stmt = this.db.prepare(soql.toString(visitor))
    const rows = stmt.all()
    return rows.map((row) => {
      return new CaseIgnoredStore(row)
    })
  }

  insert (sObject) {
    const sObjectName = sObject.type().name.join('.').toUpperCase()
    const fieldNames = sObject.instanceFields.keys().map((key) => {
      return key.toUpperCase()
    }).join(', ')
    const binds = sObject.instanceFields.keys().map((_) => {
      return '?'
    }).join(', ')
    const fieldValues = sObject.instanceFields.keys().map((key) => {
      return sObject.instanceFields.get(key).value
    })

    const stmt = this.db.prepare(`INSERT INTO ${sObjectName}(${fieldNames}) VALUES (${binds})`)
    stmt.run(fieldValues)
  }

  update (sObject) {
    const sObjectName = sObject.type().name.join('.').toUpperCase()
    const setFields = sObject.instanceFields.keys().map((key) => {
      return `${key.toUpperCase()} = ?`
    }).join(', ')
    const fieldValues = sObject.instanceFields.keys().map((key) => {
      return sObject.instanceFields.get(key).value
    })

    const Id = sObject.instanceFields.get('Id').value
    const stmt = this.db.prepare(`UPDATE ${sObjectName} SET ${setFields} WHERE ID = '${Id}'`)
    stmt.run(fieldValues)
  }

  upsert (sObject, key) {
    const sObjectName = sObject.type().name.join('.').toUpperCase()
    const setFields = sObject.instanceFields.keys().map((key) => {
      return `${key.toUpperCase()} = ?`
    }).join(', ')
    const fieldValues = sObject.instanceFields.keys().map((key) => {
      return sObject.instanceFields.get(key).value
    })

    const value = sObject.instanceFields.get(key).value
    const stmt = this.db.prepare(`UPDATE ${sObjectName} SET ${setFields} WHERE ${key} = '${value}'`)
    stmt.run(fieldValues)
  }

  delete (sObject) {
    const sObjectName = sObject.type().name.join('.').toUpperCase()
    const Id = sObject.instanceFields.get('Id').value
    const stmt = this.db.prepare(`DELETE ${sObjectName} WHERE ID = '${Id}'`)
    stmt.run()
  }

  setupDB () {
    this.createDb()
    this.seed()
  }

  dropDb () {
    fs.unlinkSync('test-db')
  }

  createDb () {}

  seed () {}
}

const FieldTypeMapper = {
  reference: 'VARCHAR(255)',
  id: 'VARCHAR(255)',
  boolean: 'BOOLEAN',
  string: 'VARCHAR(255)',
  textarea: 'TEXT',
  picklist: 'VARCHAR(255)',
  double: 'DOUBLE',
  address: 'VARCHAR(255)',
  phone: 'VARCHAR(255)',
  url: 'VARCHAR(255)',
  currency: 'DOUBLE',
  date: 'DATE',
  datetime: 'DATETIME',
  email: 'VARCHAR(255)'
}

// new Sqlite3Adapter().setupDB()

DatabaseAdapterRegister.set('sqlite3', new Sqlite3Adapter())

module.exports = Sqlite3Adapter
