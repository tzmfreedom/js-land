const process = require('process');
const jsforce = require('jsforce')
const conn = new jsforce.Connection()
const prompt = require('prompt')
const fs = require('fs')

prompt.start()

const schema = {
  properties: {
    username: {
      default: process.env.SALESFORCE_USERNAME
    },
    password: {
      required: true,
      hidden: true,
    }
  }
}

const sobject = process.argv[2]
const filePath = process.argv[3]
if (!sobject || !filePath)  {
  console.error('input sobject name and output file path')
  process.exit(1)
}

prompt.get(schema, (err, result) => {
  conn.login(result.username, result.password, (err, userInfo) => {
    if (err) { return console.error(err) }
    conn.sobject(sobject).describe((err, meta) => {
      if (err) { return console.error(err) }
      fs.writeFileSync(filePath, JSON.stringify(meta))
    })
  })
})
