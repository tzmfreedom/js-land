'use strict'

const CaseIgnoredStore = require('../store/case-ignored-store')
const DatabaseAdapterRegister = require('./database-adapter-register')
const request = require('sync-request')
const escape = require('escape-html')
const parser = require('fast-xml-parser')

class SalesforceAdapter {
  constructor() {
    const loginResult = this.login()
    this.sessId = loginResult.sessionId
    const re = /https:\/\/(.*\.salesforce\.com)\//i
    const m = loginResult.serverUrl.match(re)
    this.endpoint = m[1]
    this.version = '38.0'
    this.batchSize = 500
  }

  login() {
    const username = process.env.SALESFORCE_USERNAME
    const password = process.env.SALESFORCE_PASSWORD
    const endpoint = process.env.SALESFORCE_ENDPOINT || 'login.salesforce.com'
    const loginEndpoint = `https://${endpoint}/services/Soap/u/30.0`
    const body = `<?xml version="1.0" encoding="utf-8"?>
<env:Envelope xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:env="http://schemas.xmlsoap.org/soap/envelope/">
  <env:Body>
    <n1:login xmlns:n1="urn:partner.soap.sforce.com">
      <n1:username>${escape(username)}</n1:username>
      <n1:password>${escape(password)}</n1:password>
    </n1:login>
  </env:Body>
</env:Envelope>`
    const res = request('POST', loginEndpoint, {
      headers: {
        'SOAPAction': '""',
        'Content-Type': 'text/xml',
      },
      body: body,
    })
    const jsonObj = parser.parse(res.body.toString())
    return jsonObj['soapenv:Envelope']['soapenv:Body'].loginResponse.result
  }

  load(soql, visitor) {
    const queryEndpoint = `https://${this.endpoint}/services/data/v${this.version}/query?q=${encodeURIComponent(soql.toString(visitor))}`
    const res = request('GET', queryEndpoint, {
      headers: {
        'Authorization': `Bearer ${this.sessId}`,
        'Sforce-Query-Options': `batchSize=${this.batchSize}`
      },
    })
    let result = JSON.parse(res.body.toString())
    const records = result.records
    while (!result.done) {
      console.log(result)
      const queryEndpoint = `https://${this.endpoint}${result.nextRecordsUrl}`
      const res = request('GET', queryEndpoint, {
        headers: {
          'Authorization': `Bearer ${this.sessId}`
        },
      })
      result = JSON.parse(res.body.toString())
      records.push(...result.records)
    }
    return records.map((record) => {
      delete record.attributes
      return new CaseIgnoredStore(record)
    })
  }

  insert(sObject) {
  }

  update(sObject) {
  }

  upsert(sObject, key) {
  }

  delete(sObject) {
  }
}

DatabaseAdapterRegister.set('salesforce', new SalesforceAdapter())
