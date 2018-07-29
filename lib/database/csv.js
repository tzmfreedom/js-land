'use strict'

const fs = require('fs');
const csvSync = require('csv-parse/lib/sync');
const CaseIgnoredStore = require('../store/case-ignored-store')
const DatabaseAdapterRegister = require('./database-adapter-register')
const MemoryAdapter = require('./memory-adapter')

class CsvAdapter extends MemoryAdapter {
  loadRecords(soql) {
    if (this.records.includes(soql.fromObject)) {
      return this.records.get(soql.fromObject)
    }
    let data = fs.readFileSync(`./data/${soql.fromObject}.csv`);
    let records = csvSync(data, { columns: true }).map((record) => {
      return new CaseIgnoredStore(record)
    });
    this.records.set(soql.fromObject, records)
    return records
  }
}

DatabaseAdapterRegister.set('csv', new CsvAdapter())

