const TypeStore = require('./type_store');
const Ast = require('./node/ast');
const Variable = require('./variable');
const fs = require('fs');
const csvSync = require('csv-parse/lib/sync');

const dataLoader = () => {
  const file = 'input.csv';
  let data = fs.readFileSync('./data/account.csv');
  let csvRecords = csvSync(data, { columns: true });

  const list = new Ast.ApexObjectNode(TypeStore.get('List'), [], []);
  const records = [];
  csvRecords.forEach((csvRecord) => {
    Object.keys(csvRecord).forEach((key) => {
      csvRecord[key] = new Variable(null, csvRecord[key]);
    });
    records.push(
      new Variable(
        null,
        new Ast.ApexObjectNode(TypeStore.get('SObject'), csvRecord, [])
      )
    );
  });
  list._records = records;
  return list;
};
module.exports = dataLoader;