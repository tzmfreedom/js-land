const antlr4 = require('antlr4');
const ApexParser = require('./apexParser');
const ApexLexer = require('./apexLexer');
const ApexInterpreter = require('./apex_interpreter');
const ApexAstBuilder = require('./ApexAstBuilder');
const ApexBuilder = require('./apex_builder');
const util = require('util');

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
console.log(util.inspect(top, {depth: 6, colors: true}));

const builder = new ApexBuilder();
const interpreter = new ApexInterpreter();

// Build
builder.visit(top);

// Execute
const method = top.staticMethods.find((method) => {
  return method.name == 'action';
});
method.statements.forEach((statement) => {
  statement.accept(interpreter);
});
