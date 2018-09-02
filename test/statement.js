const assert = require('power-assert')
const Cli = require('../lib/cli/cli')
const request = require('request')
const EnvManager = require('../lib/env-manager')
const Ast = require('../lib/node/ast')

const testCases = [
  {
    name: 'variable declaration',
    filePath: './test/test_cases/VariableDeclaration.cls',
    className: 'VariableDeclaration',
  },
]

const ACTUAL_RESULT_URI = `https://land-developer-edition.ap4.force.com/services/apexrest/land.json`

const getActualResult = (className, callback) => {
  const options = {
    url: ACTUAL_RESULT_URI,
    method: 'GET',
    json: true,
    qs: { 'class': className }
  }
  request(options, callback)
}

describe('parse', () => {
  testCases.forEach((testCase) => {
    it (testCase.name, () => {
      getActualResult(testCase.className, (err, response, body) => {
        if (err) {
          console.error(err)
          return
        }

        const actual = JSON.parse(body)

        const cli = new Cli(null, './test/test_cases')
        try {
          const hoge = cli.run('TestCaseHandler', 'run', [new Ast.StringNode(testCase.className)])
          console.log(hoge)
        } catch (e) {
          console.log(e)
        }
      })
    })
  })
})
