const assert = require('power-assert')
const Cli = require('../lib/apex-runner')
const request = require('request')
const EnvManager = require('../lib/env-manager')
const ApexClassStore = require('../lib/store/apex-class-store')
const Ast = require('../lib/node/ast')

const testCases = [
  {
    name: 'variable declaration',
    filePath: './test/test_cases/VariableDeclaration.cls',
    className: 'VariableDeclaration'
  },
]

const basicTests = [
  {
    name: 'variable declaration',
    methodName: 'testVariableDeclaration',
    expected: ['abc', 1, 1.23, false, null],
  },
  {
    name: 'variable assignment',
    methodName: 'testVariableAssignment',
    expected: ['def', 2, 3.45, true, null],
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
  beforeEach(() => {
    ApexClassStore.deregisterAll()
  })

  basicTests.forEach((testCase) => {
    it(testCase.name, (done) => {
      const cli = new Cli('./test/test_cases/Basic.cls', null)
      cli.stdout = {
        buffer: '',
        write: (obj) => {
          this.buffer += obj
        }
      }
      const origin = console.log
      let output = []
      console.log = (data) => {
        output.push(data)
      }
      cli.run('Basic', testCase.methodName, null)
        .then(() => {
          console.log = origin
          assert.deepStrictEqual(testCase.expected, output)
        })
        .then(done, done)
    })
  })
  testCases.forEach((testCase) => {
    it(testCase.name, (done) => {
      getActualResult(testCase.className, (err, response, body) => {
        if (err) {
          console.error(err)
          return
        }

        const actual = JSON.parse(body)

        const cli = new Cli(null, './test/test_cases')
        cli.run('TestCaseHandler', 'run', [new Ast.StringNode(testCase.className)])
          .then((data) => {
            console.log(actual)
            console.log(data)
          }).then(done, done)
      })
    })
  })
})
