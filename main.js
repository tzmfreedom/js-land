var antlr4 = require('antlr4');
var ApexParser = require('./apexParser');
var ApexLexer = require('./apexLexer');
var ApexListener = require('./apexListener');
var ApexVisitor = require('./apexVisitor');

var Tree = require('antlr4/tree')
var INVALID_INTERVAL = Tree.INVALID_INTERVAL;
var TerminalNode = Tree.TerminalNode;
var TerminalNodeImpl = Tree.TerminalNodeImpl;

// var input = require('fs').readFileSync('/dev/stdin', 'utf8');
var input = require('fs').readFileSync(process.argv[2], 'utf8');
var chars = new antlr4.InputStream(input);
var lexer = new ApexLexer.apexLexer(chars);
var tokens  = new antlr4.CommonTokenStream(lexer);
var parser = new ApexParser.apexParser(tokens);
parser.buildParseTrees = true;
var tree = parser.compilationUnit();

var visitor = new ApexVisitor.apexVisitor();
console.log(visitor.visit(tree));

/*
walk(tree, 0);
function walk(node, indent) {
    if (node.constructor.name == 'TerminalNodeImpl') {
        console.log(" ".repeat(indent) + node.constructor.name + "[" + node.toString() + "]");
    } else{
        console.log(" ".repeat(indent) + node.constructor.name);
    }
    if (node.children !== undefined) {
        indent += 2;
        node.children.forEach(function (child) {
            walk(child, indent);
        });
    }
}
*/
