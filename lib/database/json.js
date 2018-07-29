'use strict'

const DatabaseAdapterRegister = require('./database-adapter-register')
const MemoryAdapter = require('./memory-adapter')

class JsonAdapter extends MemoryAdapter {
  loadRecords(soql) {
    const objectName = 'account';

    const records = require(`../data/${soql.fromObject}.json`).map((record) => {
      return new CaseIgnoredStore(record)
    })
    this.records.set(soql.fromObject, records)
    return records
  }
}

DatabaseAdapterRegister.set('json', new JsonAdapter())
