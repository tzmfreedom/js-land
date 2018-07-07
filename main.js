const antlr4 = require('antlr4');
const ApexParser = require('./apexParser');
const ApexLexer = require('./apexLexer');
const ApexInterpreter = require('./apex_interpreter');
const ApexAstBuilder = require('./ApexAstBuilder');
const SymbolDeclarator = require('./symbol_declarator');
const ApexBuilder = require('./apex_builder');
const MethodInvocationNode = require('./node/ast').MethodInvocationNode;
const NameNode = require('./node/ast').NameNode;
require('./apexClassCreator');

// Create CST with ANTLR
const input = require('fs').readFileSync(process.argv[2], 'utf8');
const chars = new antlr4.InputStream(input);
const lexer = new ApexLexer.apexLexer(chars);
const tokens  = new antlr4.CommonTokenStream(lexer);
const parser = new ApexParser.apexParser(tokens);
parser.buildParseTrees = true;
const tree = parser.compilationUnit();

// Create AST from CST with Visitor
const visitor = new ApexAstBuilder();
const top = visitor.visit(tree);
// console.log(util.inspect(top, {depth: 13, colors: true}));

const declarator = new SymbolDeclarator();
const classInfo = declarator.visit(top);

const builder = new ApexBuilder();

// Build
builder.visit(classInfo);

// Execute
const interpreter = new ApexInterpreter();
invokeNode = new MethodInvocationNode(
  new NameNode(['Hoge', 'action']),
  [],
);
interpreter.visit(invokeNode);
