const TypeStore = require('./type-store');
const Ast = require('./node/ast');
const Variable = require('./node/variable');
const fs = require('fs');
const csvSync = require('csv-parse/lib/sync');

const dataLoader = () => {
  const list = new Ast.ApexObjectNode(TypeStore.get('List'), [], []);
  // records = loadCsv();
  records = loadJson();
  list._records = records;
  return list;
};

const loadCsv = (soql) => {
  const objectName = 'account';
  let data = fs.readFileSync(`./data/${objectName}.csv`);
  let csvRecords = csvSync(data, { columns: true });

  return csvRecords.map((csvRecord) => {
    Object.keys(csvRecord).forEach((key) => {
      csvRecord[key] = new Variable(null, csvRecord[key]);
    });
    return new Variable(
      null,
      new Ast.ApexObjectNode(TypeStore.get('SObject'), csvRecord, [])
    );
  });
};

const loadJson = (soql) => {
  const objectName = 'account';
  return require(`./data/${objectName}.json`).map((record) => {
    Object.keys(record).forEach((key) => {
      record[key] = new Variable(null, record[key]);
    });
    return new Variable(
      null,
      new Ast.ApexObjectNode(TypeStore.get('SObject'), record, [])
    );
  });
};

module.exports = dataLoader;