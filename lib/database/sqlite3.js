'use strict'

const CaseIgnoredStore = require('../store/case-ignored-store')
const DatabaseAdapterRegister = require('./database-adapter-register')
var Database = require('better-sqlite3');
const db = new Database('/path/to/file', { memory: true });

class Sqlite3Adapter {
  loadRecords(soql) {
    const objectName = 'account';

    const records = require(`../data/${soql.fromObject}.json`).map((record) => {
      return new CaseIgnoredStore(record)
    })
    this.records.set(soql.fromObject, records)
    return records
  }

  load(soql) {
    const stmt = db.prepare(soql.toString().toUpperCase())
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

  migrate() {
    db.exec("CREATE TABLE ACCOUNT (ID Integer, NAME VARCHAR)")
    for (let i = 0; i < 10; i++) {
      const stmt = db.prepare("INSERT INTO ACCOUNT(ID, NAME) VALUES (?, ?)")
      stmt.run(i+1, 'hoge')
    }
  }
}

new Sqlite3Adapter().migrate()

DatabaseAdapterRegister.set('sqlite3', new Sqlite3Adapter())
