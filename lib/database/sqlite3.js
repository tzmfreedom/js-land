'use strict'

const CaseIgnoredStore = require('../store/case-ignored-store')
const DatabaseAdapterRegister = require('./database-adapter-register')
var Database = require('better-sqlite3');
// const db = new Database('/path/to/file', { memory: true });
const db = new Database('./test-db');

class Sqlite3Adapter {
  load(soql, visitor) {
    const stmt = db.prepare(soql.toString(visitor))
    const rows = stmt.all()
    return rows.map((row) => {
      return new CaseIgnoredStore(row)
    })
  }

  insert(sObject) {
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

    const stmt = db.prepare(`INSERT INTO ${sObjectName}(${fieldNames}) VALUES (${binds})`)
    stmt.run(fieldValues)
  }

  update(sObject) {
    const sObjectName = sObject.type().name.join('.').toUpperCase()
    const setFields = sObject.instanceFields.keys().map((key) => {
      return `${key.toUpperCase()} = ?`
    }).join(', ')
    const fieldValues = sObject.instanceFields.keys().map((key) => {
      return sObject.instanceFields.get(key).value
    })

    const Id = sObject.instanceFields.get('Id').value
    const stmt = db.prepare(`UPDATE ${sObjectName} SET ${setFields} WHERE ID = '${Id}'`)
    stmt.run(fieldValues)
  }

  upsert(sObject, key) {
    const sObjectName = sObject.type().name.join('.').toUpperCase()
    const setFields = sObject.instanceFields.keys().map((key) => {
      return `${key.toUpperCase()} = ?`
    }).join(', ')
    const fieldValues = sObject.instanceFields.keys().map((key) => {
      return sObject.instanceFields.get(key).value
    })

    const keyValue = sObject.instanceFields.get(key).value
    const stmt = db.prepare(`UPDATE ${sObjectName} SET ${setFields} WHERE ${key} = '${keyValue}'`)
    stmt.run(fieldValues)
  }

  delete(sObject) {
    const sObjectName = sObject.type().name.join('.').toUpperCase()
    const Id = sObject.instanceFields.get('Id').value
    const stmt = db.prepare(`DELETE ${sObjectName} WHERE ID = '${Id}'`)
    stmt.run()
  }

  setupDB() {
    this.createDb()
    this.seed()
  }

  createDb() {
    // read from metadata xml
    const sObjectName = 'account'
    const accountMeta = require(`../../${sObjectName}.meta.json`)
    const fields = accountMeta.fields.map((field) => {
      const fieldName = field.name
      const fieldType = FieldTypeMapper[field.type]
      return `${fieldName} ${fieldType}`
    }).join(', ')
    db.exec(`CREATE TABLE ${sObjectName.toUpperCase()} (${fields})`)
  }

  seed() {
    const sObjectName = 'account'
    const records = require(`../../${sObjectName}.seed.json`)
    const fields = Object.keys(records[0]).map((key) => {
      return key.toUpperCase()
    })
    const binds = Object.keys(records[0]).map((key) => {
      return '?'
    }).join(', ')
    const stmt = db.prepare(`INSERT INTO ${sObjectName}(${fields}) VALUES (${binds})`)
    records.forEach((record) => {
      stmt.run(Object.values(record))
    })
  }
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
  email: 'VARCHAR(255)',
}

// new Sqlite3Adapter().setupDB()

DatabaseAdapterRegister.set('sqlite3', new Sqlite3Adapter())
