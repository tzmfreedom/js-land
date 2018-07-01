let antlr4 = require('antlr4');
let ApexParser = require('./apexParser');
let ApexLexer = require('./apexLexer');
let ApexVisitor = require('./apexVisitor');
let ApexInterpreter = require('./apexInterpreter');
let Apex = require('./apexClass');
let ApexClassCreator = require('./ApexClassCreator');

let input = require('fs').readFileSync(process.argv[2], 'utf8');
let chars = new antlr4.InputStream(input);
let lexer = new ApexLexer.apexLexer(chars);
let tokens  = new antlr4.CommonTokenStream(lexer);
let parser = new ApexParser.apexParser(tokens);
parser.buildParseTrees = true;
let tree = parser.compilationUnit();

let visitor = new ApexInterpreter.apexInterpreter();
console.log(visitor.visit(tree));

let staticMethods = Apex.ApexClassStore.get('Hoge').staticMethods;
visitor.visit(staticMethods.action.statements);
