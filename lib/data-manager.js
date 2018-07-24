const TypeStore = require('./store/type-store');
const Ast = require('./node/ast');
const Variable = require('./node/variable');
const fs = require('fs');
const csvSync = require('csv-parse/lib/sync');
const NameSpaceStore = require('./store/name-space-store')
const SoqlParser = require('./soql-parser')
const CaseIgnoredStore = require('./store/case-ignored-store')

class DataManager {
  constructor(loadFunction) {
    this.loadFunction = loadFunction
    this.records = new CaseIgnoredStore()
  }

  load(soql) {
    const parseResult = new SoqlParser(soql).parse()
    const listObject = new Ast.ApexObjectNode()
    listObject.classType = new Ast.TypeNode(
      ['List'],
      [
        new Ast.TypeNode([parseResult.sobject], [])
      ]
    )
    listObject.classType.classNode = NameSpaceStore.get('System', 'List')
    listObject.instanceFields = {}
    let records = []
    if (this.records.includes(parseResult.sobject)) {
      records = this.records.get(parseResult.sobject)
    } else {
      this.records.set(parseResult.sobject, this.loadFunction.call(this, parseResult.sobject))
      records = this.records.get(parseResult.sobject)
    }
    listObject._records = records.filter((record) => {
      return Object.keys(parseResult.where).every((field) => {
        return record.instanceFields[field].value == parseResult.where[field]
      })
    })
    listObject._records.map((record) => {
      Object.keys(record.instanceFields).forEach((field) => {
        if (!parseResult.fields.includes(field)) {
          delete record.instanceFields[field]
        }
      })
    })
    return listObject
  }

  insert(sObject) {
    const sObjectName = sObject.type().name.join('.')
    if (!this.records.includes(sObjectName)) {
      this.records.set(sObjectName, [])
    }
    this.records.get(sObjectName).push(sObject)
  }

  update(sObject) {
    const sObjectName = sObject.type().name.join('.')
    const records = this.records.get(sObjectName)
    const updateRecord = records.find((record) => {
      return record.instanceFields.Id.value === sObject.instanceFields.Id.value
    })
    if (!updateRecord) `Record is not found ${sObject.instanceFields.Id}`
    Object.keys(sObject.instanceFields).forEach((field) => {
      updateRecord.instanceFields[field] = sObject.instanceFields[field]
    })
  }

  upsert(sObject) {
    const records = this.records[sObject.type().name.join('.')]
    const updateRecord = records.find((record) => {
      return record.instanceFields.Id.value === sObject.instanceFields.Id.value
    })
    if (updateRecord) {
      this.records[sObject.type().name.join('.')].push(sObject)
    } else {
      Object.keys(sObject.instanceFields).forEach((field) => {
        updateRecord.instanceFields[field] = sObject.instanceFields[field]
      })
    }
  }

  delete(sObject) {
    const sObjectName = sObject.type().name.join('.')
    const records = this.records.get(sObjectName)
    for (let i = 0; i < records.length; i++) {
      const recordId = records[i].instanceFields.Id.value
      const sObjectId = sObject.instanceFields.Id.value
      if (recordId == sObjectId) {
        this.records.splice(i, 0)
        return
      }
    }
  }

  undelete() {

  }
}

const loadCsv = (sobject) => {
  let data = fs.readFileSync(`./data/${sobject}.csv`);
  let csvRecords = csvSync(data, { columns: true });

  return csvRecords.map((csvRecord) => {
    Object.keys(csvRecord).forEach((key) => {
      csvRecord[key] = ((value) => {
        if (parseInt(value)) {
          return new Ast.IntegerNode(parseInt(value))
        } else {
          return new Ast.StringNode(value)
        }
      })(csvRecord[key])
    });
    return new Ast.ApexObjectNode(TypeStore.get('SObject'), csvRecord, [])
  });
};

const loadJson = (soql) => {
  const objectName = 'account';
  return require(`../data/${objectName}.json`).map((record) => {
    Object.keys(record).forEach((key) => {
      record[key] = ((value) => {
        if (parseInt(value)) {
          return new Ast.IntegerNode(parseInt(value))
        } else {
          return new Ast.StringNode(value)
        }
      })(record[key])
    });
    return new Ast.ApexObjectNode(TypeStore.get('SObject'), record, [])
  });
};

module.exports = new DataManager(loadCsv);