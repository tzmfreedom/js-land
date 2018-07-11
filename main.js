const antlr4 = require('antlr4');
const ApexParser = require('./apexParser');
const ApexLexer = require('./apexLexer');
const ApexInterpreter = require('./apex_interpreter');
const ApexAstBuilder = require('./ApexAstBuilder');
const SymbolDeclarator = require('./symbol_declarator');
const ApexBuilder = require('./apex_builder');
const TypeBuilder = require('./type_builder');
const MethodInvocationNode = require('./node/ast').MethodInvocationNode;
const NameNode = require('./node/ast').NameNode;
const util = require('util');
const fs = require('fs');

// Create CST with ANTLR
const fileList = fs.readdirSync('examples')
                   .filter((file) => {
                     return fs.statSync(`examples/${file}`).isFile() && /.*\.cls$/.test(file);
                   });

setTimeout(()=>{}, 10);
const classes = fileList.map((fileName) => {
  return readFile(`examples/${fileName}`);
});

classes.forEach((classInfo) => {
  build(classInfo);
});

run('Hoge', 'action');

function readFile(fileName) {
  // console.log(`Start ReadFile: ${fileName}`);
  const input = fs.readFileSync(fileName, 'utf8');
  const chars = new antlr4.InputStream(input);
  const lexer = new ApexLexer.apexLexer(chars);
  const tokens  = new antlr4.CommonTokenStream(lexer);
  const parser = new ApexParser.apexParser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.compilationUnit();

// Create AST from CST with Visitor
  const classInfo = [];
  try {
    const visitor = new ApexAstBuilder();
    const top = visitor.visit(tree);

// console.log(util.inspect(top, {depth: 13, colors: true}));

    const declarator = new SymbolDeclarator();
    // console.log(`End ReadFile: ${fileName}`);
    return declarator.visit(top);
  } catch (e) {
    console.log(e);
  }
}

function build(classInfo) {
  console.log(`Start Build: ${classInfo.name}`);
  // const builder = new ApexBuilder();
  const typeBuilder = new TypeBuilder();
  typeBuilder.visit(classInfo);
  const apexBuilder = new ApexBuilder();
  apexBuilder.visit(classInfo);
  console.log(`End Build: ${classInfo.name}`);
}

function run(className, actionName) {
  const interpreter = new ApexInterpreter();
  const invokeNode = new MethodInvocationNode(
    new NameNode([className, actionName]),
    [],
  );
  interpreter.visit(invokeNode);
}
