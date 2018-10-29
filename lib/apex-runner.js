// ANTLR Parser/Lexor
const antlr4 = require('antlr4')
const ApexParser = require('./apexParser')
const ApexLexer = require('./apexLexer')

// AST Builder/Interpreter
const Ast = require('./node/ast')
const ApexInterpreter = require('./visitor/apex-interpreter')
const ApexAstBuilder = require('./visitor/apex-ast-builder')
const SymbolDeclarator = require('./visitor/symbol-declarator')
const ApexBuilder = require('./visitor/apex-builder')
const TypeBuilder = require('./visitor/type-builder')
const PreProcessor = require('./pre-processor')

// required modules for builder/interpreter
const MethodInvocationNode = require('./node/ast').MethodInvocationNode
const NameSpaceStore = require('./store/name-space-store')
const ApexClassStore = require('./store/apex-class-store')
const ClassStaticFields = require('./store/class-static-fields')
const loadSObject = require('./runtime/sobject')

const fs = require('fs')
const path = require('path')
const runtimeFiles = fs.readdirSync(path.resolve(__dirname, './runtime'))
runtimeFiles.forEach((runtimeFile) => {
  require(`./runtime/${runtimeFile}`)
})

const AllNameSpaces = [
  'System',
  'ApexPages',
  'Messaging',
  'Auth',
  'ChatterAnswers',
  'ConnectApi',
  'DataSource',
  'Database',
  'EventBus',
  'Flow',
  'TxnSecurity',
  'Site',
  'Schema',
  'Reports',
  'QuickAction',
  'Process'
]

class ApexRunner {
  constructor (filename, dirname) {
    this.filename = filename
    this.dirname = dirname
    this.classes = []
    this.loaded = false
  }

  run (className, actionName, parameters) {
    if (this.loaded) {
      ApexClassStore.deregisterAll()
      this.loaded = false
    }
    return new Promise((resolve, reject) => {
      this._parse().then(() => {
        this._registerStaticFieldAll()
        loadSObject(() => {
          this._buildTypeAll()
          this._buildApexAll()
          this.loaded = true
          const result = this.execute(className, actionName, parameters)
          resolve(result)
        })
      })
    })
  }

  preload () {
    if (this.loaded) {
      ApexClassStore.deregisterAll()
      this.loaded = false
    }
    return new Promise((resolve, reject) => {
      this._parse().then(() => {
        this._registerStaticFieldAll()
        loadSObject(() => {
          this._buildTypeAll()
          this._buildApexAll()
          this.loaded = true
          resolve()
        })
      })
    })
  }

  /**
   * 1. Read File
   * 2. Build CST by ANTLR
   * 3. Build AST from CST
   * 4. SymbolDeclaration with SymbolDeclarator Class and AST
   *
   * @param fileName
   */
  _readFile (fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, (err, input) => {
        const source = new PreProcessor().run(input.toString())
        const chars = new antlr4.InputStream(source)
        const lexer = new ApexLexer.apexLexer(chars)
        const tokens = new antlr4.CommonTokenStream(lexer)
        const parser = new ApexParser.apexParser(tokens)
        parser.buildParseTrees = true
        const tree = parser.compilationUnit()

        const visitor = new ApexAstBuilder(fileName)
        const top = visitor.visit(tree)

        const declarator = new SymbolDeclarator()
        const classInfo = declarator.visit(top)
        this.classes.push(classInfo)
        resolve(classInfo)
      })
    })
  }

  /**
   * Parse All files and SymbolDeclaration
   * @private
   */
  _parse () {
    let fileList
    if (this.dirname) {
      fileList = fs.readdirSync(this.dirname)
        .filter((file) => {
          return fs.statSync(`${this.dirname}/${file}`).isFile() && /.*\.cls$/.test(file)
        })
        .map((file) => { return `${this.dirname}/${file}` })
    } else {
      fileList = [this.filename]
    }

    return Promise.all(
      fileList.map((fileName) => {
        return this._readFile(fileName)
      })
    )
  }

  /**
   * Register ClassStaticField to ClassStaticFields for All Class
   * @private
   */
  _registerStaticFieldAll () {
    AllNameSpaces.forEach((namespace) => {
      const classes = NameSpaceStore.getClasses(namespace)
      Object.keys(classes).forEach((className) => {
        this._registerStaticField(classes[className])
      })
    })

    this.classes.forEach((classInfo) => {
      this._registerStaticField(classInfo)
    })
  }

  /**
   * Register ClassStaticField to ClassStaticFields
   * @param classInfo
   * @private
   */
  _registerStaticField (classInfo) {
    if (!(classInfo instanceof Ast.ApexClass)) return

    classInfo.staticFields.keys().forEach((fieldName) => {
      const staticField = classInfo.staticFields.get(fieldName)
      ClassStaticFields.put(classInfo.name, staticField.type, fieldName)
    })
  }

  /**
   * Build Type for All Class
   * @private
   */
  _buildTypeAll () {
    AllNameSpaces.forEach((namespace) => {
      const classes = NameSpaceStore.getClasses(namespace)
      Object.keys(classes).forEach((className) => {
        this._buildType(classes[className])
      })
    })

    this.classes.forEach((classInfo) => {
      this._buildType(classInfo)
    })
  }

  /**
   * Build Apex Code for All Class
   * @private
   */
  _buildApexAll () {
    AllNameSpaces.forEach((namespace) => {
      const classes = NameSpaceStore.getClasses(namespace)
      Object.keys(classes).forEach((className) => {
        this._buildApex(classes[className])
      })
    })

    this.classes.forEach((classInfo) => {
      this._buildApex(classInfo)
    })
  }

  /**
   * Build Type
   * @param classInfo
   * @private
   */
  _buildType (classInfo) {
    const typeBuilder = new TypeBuilder()
    typeBuilder.visit(classInfo)
  }

  /**
   * Build Apex Code
   * @param classInfo
   * @private
   */
  _buildApex (classInfo) {
    const apexBuilder = new ApexBuilder()
    apexBuilder.visit(classInfo)
  }

  /**
   * Run Interpreter from bootstrap Class#method.
   * @param className
   * @param actionName
   * @param parameters
   * @private
   */
  execute (className, actionName, parameters) {
    parameters = parameters || []
    const interpreter = new ApexInterpreter()
    const invokeNode = new MethodInvocationNode(
      new Ast.NameNode([className, actionName]),
      parameters
    )
    return interpreter.visit(invokeNode)
  }

  reloadFile (file, className) {
    ApexClassStore.deregister(className)
    this._readFile(`examples/${file}`).then((classInfo) => {
      this._registerStaticField(classInfo)
      this._buildType(classInfo)
      this._buildApex(classInfo)
    })
  }
}

module.exports = ApexRunner
