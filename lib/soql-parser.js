class ParseResult {
  constructor(fields, sobject, where) {
    this.fields = fields
    this.sobject = sobject
    this.where = where
  }
}

class SoqlParser {
  constructor(soql) {
    this.soql = soql
  }

  parse() {
    const m = this.soql.match(/^\[\s*SELECT\s+(.*)\s+FROM\s+([^\s]+)(\s+WHERE\s+(.*))?\]$/i)
    if (!m) throw 'SOQL Syntax Error'
    const fields = m[1].split(',').map((field) => {
      return field.trim()
    })
    const sobject = m[2]
    const whereObject = {}
    if (m[4]) {
      m[4].split('AND').forEach((where) => {
        const kv = where.split('=')
        whereObject[kv[0].trim()] = kv[1].trim()
      })
    }

    return new ParseResult(fields, sobject, whereObject)
  }
}

module.exports = SoqlParser