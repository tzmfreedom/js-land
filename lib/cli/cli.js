const antlr4 = require('antlr4');
const ApexParser = require('../apexParser');
const ApexLexer = require('../apexLexer');
const ApexInterpreter = require('../visitor/apex-interpreter');
const ApexAstBuilder = require('../visitor/apex-ast-builder');
const SymbolDeclarator = require('../visitor/symbol-declarator');
const ApexBuilder = require('../visitor/apex-builder');
const TypeBuilder = require('../visitor/type-builder');
const MethodInvocationNode = require('../node/ast').MethodInvocationNode;
const NameNode = require('../node/ast').NameNode;
const NameSpaceStore = require('../store/name-space-store')
const ApexClassStore = require('../store/apex-class-store')
const util = require('util');
const fs = require('fs');
const ClassStaticFields = require('../store/class-static-fields')
const path = require('path')

const runtimeFiles = fs.readdirSync(path.resolve(__dirname, '../runtime'))
runtimeFiles.forEach((runtimeFile) => {
  require(`../runtime/${runtimeFile}`)
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
  'Process',
]

class Cli {
  constructor(filename, dirname) {
    this.filename = filename
    this.dirname = dirname
    this.readFile = (fileName) => {
      const input = fs.readFileSync(fileName, 'utf8');
      const chars = new antlr4.InputStream(input);
      const lexer = new ApexLexer.apexLexer(chars);
      const tokens = new antlr4.CommonTokenStream(lexer);
      const parser = new ApexParser.apexParser(tokens);
      parser.buildParseTrees = true;
      const tree = parser.compilationUnit();

      try {
        const visitor = new ApexAstBuilder(fileName);
        const top = visitor.visit(tree);

        const declarator = new SymbolDeclarator();
        // console.log(`End ReadFile: ${fileName}`);
        return declarator.visit(top);
      } catch (e) {
        console.log(e);
        throw `${e}`
      }
    }

    // prepare global
    this.prepareClass = (classInfo) => {
      classInfo.staticFields.keys().forEach((fieldName) => {
        const staticField = classInfo.staticFields.get(fieldName)
        ClassStaticFields.put(classInfo.name, staticField.type, fieldName)
      })
    }

    this.buildTypeClass = (classInfo) => {
      const typeBuilder = new TypeBuilder();
      typeBuilder.visit(classInfo);
    }

    this.buildClass = (classInfo) => {
      const apexBuilder = new ApexBuilder();
      apexBuilder.visit(classInfo);
    }
  }
  run(className, actionName) {
    this.parse()
    this.prepareAllClass()
    this.buildAllClass()
    this.execute(className, actionName)
  }

  // Create CST with ANTLR
  parse() {
    let fileList
    if (this.dirname) {
      fileList = fs.readdirSync(this.dirname)
                   .filter((file) => {
                     return fs.statSync(`${this.dirname}/${file}`).isFile() && /.*\.cls$/.test(file);
                   })
        .filter((file) => {
          return !(/Metadata/i.test(file)) &&
            !(/Twilio/i.test(file)) &&
            !(/Mastodon/i.test(file)) &&
            !(/^Q/i.test(file)) &&
            !(/^BoxDataSource/i.test(file)) &&
            !(/^RemoteSiteHelper/i.test(file));
        })
                   .map((file) => { return `${this.dirname}/${file}` });
    } else {
      fileList = [this.filename]
    }

    this.classes = fileList.map((fileName) => {
      return this.readFile(fileName);
    });
  }

  prepareAllClass() {
    AllNameSpaces.forEach((namespace) => {
      const classes = NameSpaceStore.getClasses(namespace);
      Object.keys(classes).forEach((className) => {
        this.prepareClass(classes[className])
      })
    })

    this.classes.forEach((classInfo) => {
      this.prepareClass(classInfo);
    });
  }

  buildAllClass() {
    AllNameSpaces.forEach((namespace) => {
      const classes = NameSpaceStore.getClasses(namespace);
      Object.keys(classes).forEach((className) => {
        this.buildTypeClass(classes[className])
      })
    })

    this.classes.forEach((classInfo) => {
      console.log(classInfo.name)
      if (classInfo.name == 'HttpFormBuilder') return
      this.buildTypeClass(classInfo);
    });

    AllNameSpaces.forEach((namespace) => {
      const classes = NameSpaceStore.getClasses(namespace);
      Object.keys(classes).forEach((className) => {
        this.buildClass(classes[className])
      })
    })

    this.classes.forEach((classInfo) => {
      console.log(classInfo.name)
      this.buildClass(classInfo);
    });
  }

  execute(className, actionName) {
    const interpreter = new ApexInterpreter();
    const invokeNode = new MethodInvocationNode(
      new NameNode([className, actionName]),
      [],
    );
    interpreter.visit(invokeNode);
  }

  reloadFile(file, className) {
    ApexClassStore.deregister(className);
    const classInfo = this.readFile(`examples/${file}`);
    this.prepareClass(classInfo)
    this.buildTypeClass(classInfo)
    this.buildClass(classInfo)
  }
}

module.exports = Cli
