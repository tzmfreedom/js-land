let antlr4 = require('antlr4');
let ApexParser = require('./apexParser');
let ApexLexer = require('./apexLexer');
let ApexInterpreter = require('./apex_interpreter');
let ApexAstBuilder = require('./ApexAstBuilder');

// Create CST with ANTLR
let input = require('fs').readFileSync(process.argv[2], 'utf8');
let chars = new antlr4.InputStream(input);
let lexer = new ApexLexer.apexLexer(chars);
let tokens  = new antlr4.CommonTokenStream(lexer);
let parser = new ApexParser.apexParser(tokens);
parser.buildParseTrees = true;
let tree = parser.compilationUnit();

// Create AST from CST with Visitor
let visitor = new ApexAstBuilder();
let top = visitor.visit(tree);
// console.log(top);

let interpreter = new ApexInterpreter();

let method = top.staticMethods.find((method) => { return method.name == 'action'; });
method.statements.forEach((statement) => {
    statement.accept(interpreter);
});
