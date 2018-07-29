'use strict'

const CaseIgnoredStore = require('../store/case-ignored-store')

class MemoryAdapter {
  constructor() {
    this.records = new CaseIgnoredStore()
  }

  load(soql) {
    const records = this.loadRecords(soql)
    const filteredRecords = records.filter((record) => {
      return soql.where.every((where) => {
        const fieldPath = where.field.path.join('.')
        return record.get(fieldPath).value == where.value.value
      })
    })
    const selectFields = soql.selectFields
      .filter((selectField) => {
        return selectField.path
      })
      .map((selectField) => {
        return selectField.path.join('.')
      })
    filteredRecords.forEach((record) => {
      record.keys().forEach((field) => {
        if (!selectFields.includes(field)) {
          delete record.get(field)
        }
      })
    })
    return filteredRecords
  }

  insert(sObject) {
    const sObjectName = sObject.type().name.join('.')
    if (!this.records.includes(sObjectName)) {
      this.records.set(sObjectName, [])
    }
    const record = new CaseIgnoredStore()
    sObject.instanceFields.keys().forEach((key) => {
      record.set(key, sObject.instanceFields.get(key).value)
    })
    this.records.get(sObjectName).push(record)
  }

  update(sObject) {
    const sObjectName = sObject.type().name.join('.')
    const records = this.records.get(sObjectName)
    const updateRecord = records.find((record) => {
      return record.get('Id') === sObject.instanceFields.get('Id').value
    })
    if (!updateRecord) throw `Record is not found ${sObject.instanceFields.get('Id').value}`
    sObject.instanceFields.keys().forEach((field) => {
      updateRecord.set(field, sObject.instanceFields.get(field).value)
    })
  }

  upsert(sObject) {
    const records = this.records[sObject.type().name.join('.')]
    const updateRecord = records.find((record) => {
      return record.instanceFields.get('Id').value === sObject.instanceFields.get('Id').value
    })
    if (updateRecord) {
      this.records[sObject.type().name.join('.')].push(sObject)
    } else {
      sObject.instanceFields.keys().forEach((field) => {
        updateRecord.instanceFields.set(field, sObject.instanceFields.get(field))
      })
    }
  }

  delete(sObject) {
    const sObjectName = sObject.type().name.join('.')
    const records = this.records.get(sObjectName)
    for (let i = 0; i < records.length; i++) {
      const recordId = records[i].instanceFields.get('Id').value
      const sObjectId = sObject.instanceFields.get('Id').value
      if (recordId == sObjectId) {
        this.records.splice(i, 0)
        return
      }
    }
  }

  updelete() {

  }
}

module.exports = MemoryAdapter

