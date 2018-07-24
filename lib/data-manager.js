const TypeStore = require('./store/type-store');
const Ast = require('./node/ast');
const Variable = require('./node/variable');
const fs = require('fs');
const csvSync = require('csv-parse/lib/sync');
const NameSpaceStore = require('./store/name-space-store')
const SoqlParser = require('./soql-parser')

class DataManager {
  constructor(loadFunction) {
    this.loadFunction = loadFunction
    this.records = {}
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
    if (parseResult.sobject in this.records) {
      records = this.records[parseResult.sobject]
    } else {
      records = this.records[parseResult.sobject] = this.loadFunction.call(this, parseResult.sobject)
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

  insert() {

  }

  update() {

  }

  upsert() {

  }

  delete() {

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