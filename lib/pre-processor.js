'use strict'

class PreProcessor {
  run(text) {
    const debuggerRegexp = /\/\/\s+#debugger/g
    return text.replace(debuggerRegexp, "_Debugger.debug();")
  }
}

module.exports = PreProcessor
