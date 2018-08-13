// Generated from apex.g4 by ANTLR 4.7.1
// jshint ignore: start
var ApexVisitor = require('../apexVisitor').apexVisitor;
var Ast = require('../node/ast');

let ApexAstBuilder = function(filename) {
  this.filename = filename
  ApexVisitor.call(this); // inherit default listener
  return this;
};
ApexAstBuilder.prototype = Object.create(ApexVisitor.prototype);

// Visit a parse tree produced by apexParser#compilationUnit.
ApexAstBuilder.prototype.visitCompilationUnit = function(ctx) {
  return ctx.typeDeclaration().accept(this);
};


// Visit a parse tree produced by apexParser#typeDeclaration.
ApexAstBuilder.prototype.visitTypeDeclaration = function(ctx) {
  let modifiers = ctx.classOrInterfaceModifier().map((modifier) => {
    return modifier.accept(this);
  });
  if (ctx.classDeclaration()) {
    let classDeclaration = ctx.classDeclaration().accept(this);
    classDeclaration.modifier = modifiers;
    return classDeclaration;
  } else if (ctx.enumDeclaration()) {
    let enumDeclaration = ctx.enumDeclaration().accept(this);
    enumDeclaration.modifier = modifiers;
    return enumDeclaration;
  } else if (ctx.interfaceDeclaration()) {
    let interfaceBodyDeclaration = ctx.interfaceBodyDeclaration().accept(this);
    interfaceBodyDeclaration.modifier = modifiers;
    return interfaceBodyDeclaration;
  } else if (ctx.triggerDeclaration()) {
    return ctx.triggerDeclaration().accept(this);
  }
};


// Visit a parse tree produced by apexParser#modifier.
ApexAstBuilder.prototype.visitModifier = function(ctx) {
  if (ctx.classOrInterfaceModifier()) {
    return ctx.classOrInterfaceModifier().accept(this);
  }
  return new Ast.ModifierNode(ctx.getText(), ctx.start.line);
};


// Visit a parse tree produced by apexParser#classOrInterfaceModifier.
ApexAstBuilder.prototype.visitClassOrInterfaceModifier = function(ctx) {
  if (ctx.annotation()) {
    return ctx.annotation().accept(this);
  }
  return new Ast.ModifierNode(ctx.getText(), ctx.start.line);
};


// Visit a parse tree produced by apexParser#variableModifier.
ApexAstBuilder.prototype.visitVariableModifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#classDeclaration.
ApexAstBuilder.prototype.visitClassDeclaration = function(ctx) {
  let className = ctx.apexIdentifier().getText();
  let superClass;
  if (ctx.type()) {
    superClass = ctx.type().accept(this);
  }
  let implementClasses = [];
  if (ctx.typeList()) {
    implementClasses = ctx.typeList().accept(this);
  }
  let declarations = ctx.classBody().accept(this);
  let constructor = declarations.filter((declaration) => {
    return declaration instanceof Ast.ConstructorDeclarationNode;
  });
  let instanceMethods = declarations.filter((declaration) => {
    return (
      declaration instanceof Ast.MethodDeclarationNode
      && declaration.modifiers.every((modifier) => {
        return modifier.name != 'static';
      })
    );
  });
  let staticMethods = declarations.filter((declaration) => {
    return (
      declaration instanceof Ast.MethodDeclarationNode
      && declaration.modifiers.some((modifier) => {
        return modifier.name == 'static';
      })
    );
  });
  let instanceFields = declarations.filter((declaration) => {
    return (
      declaration instanceof Ast.FieldDeclarationNode
      && declaration.modifiers.every((modifier) => {
        return modifier.name != 'static';
      })
    );
  });
  let staticFields = declarations.filter((declaration) => {
    return (
      declaration instanceof Ast.FieldDeclarationNode
      && declaration.modifiers.some((modifier) => {
        return modifier.name == 'static';
      })
    );
  });
  let instanceProperties = declarations.filter((declaration) => {
    return (
      declaration instanceof Ast.PropertyDeclarationNode
      && declaration.modifiers.some((modifier) => {
        return modifier.name != 'static';
      })
    );
  });
  let staticProperties = declarations.filter((declaration) => {
    return (
      declaration instanceof Ast.PropertyDeclarationNode
      && declaration.modifiers.some((modifier) => {
        return modifier.name == 'static';
      })
    );
  });
  let innerClasses = declarations.filter((declaration) => {
    return declaration instanceof Ast.ClassNode;
  });

  return new Ast.ClassNode(
    null,
    null,
    className,
    superClass,
    implementClasses,
    constructor,
    instanceFields.concat(instanceProperties),
    instanceMethods,
    staticFields.concat(staticProperties),
    staticMethods,
    innerClasses,
    ctx.start.line
  );
};

// Visit a parse tree produced by apexParser#enumDeclaration.
ApexAstBuilder.prototype.visitEnumDeclaration = function(ctx) {
  return new Ast.ClassNode(
    null,
    null,
    ctx.apexIdentifier().accept(this),
    null,
    [],
    [],
    [],
    [],
    ctx.enumConstants().accept(this),
    [],
    [],
    ctx.start.line
  )
};


// Visit a parse tree produced by apexParser#enumConstants.
ApexAstBuilder.prototype.visitEnumConstants = function(ctx) {
  return ctx.enumConstant().map((enumConstant) => {
    return enumConstant.accept(this)
  })
};


// Visit a parse tree produced by apexParser#enumConstant.
ApexAstBuilder.prototype.visitEnumConstant = function(ctx) {
  return new Ast.FieldDeclarationNode(
    new Ast.TypeNode(['Integer'], []),
    [
      new Ast.ModifierNode('public')
    ],
    [
      new Ast.VariableDeclaratorNode(
        ctx.apexIdentifier().accept(this),
        new Ast.IntegerNode(),
        ctx.start.line
      )
    ],
    ctx.start.line
  )
};


// Visit a parse tree produced by apexParser#enumBodyDeclarations.
ApexAstBuilder.prototype.visitEnumBodyDeclarations = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#interfaceDeclaration.
ApexAstBuilder.prototype.visitInterfaceDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeList.
ApexAstBuilder.prototype.visitTypeList = function(ctx) {
  return ctx.type().map((type) => { return type.accept(this); });
};


// Visit a parse tree produced by apexParser#classBody.
ApexAstBuilder.prototype.visitClassBody = function(ctx) {
  return ctx.classBodyDeclaration().map((declaration) => {
    return declaration.accept(this);
  });
};


// Visit a parse tree produced by apexParser#interfaceBody.
ApexAstBuilder.prototype.visitInterfaceBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#classBodyDeclaration.
ApexAstBuilder.prototype.visitClassBodyDeclaration = function(ctx) {
  let declaration = ctx.memberDeclaration();
  if (declaration) {
    let decl = declaration.accept(this);
    decl.modifiers = ctx.modifier().map((modifier) => {
      return modifier.accept(this)
    });
    return decl;
  }
};


// Visit a parse tree produced by apexParser#memberDeclaration.
ApexAstBuilder.prototype.visitMemberDeclaration = function(ctx) {
  return this.visitChildren(ctx)[0];
};


// Visit a parse tree produced by apexParser#methodDeclaration.
ApexAstBuilder.prototype.visitMethodDeclaration = function(ctx) {
  let methodName = ctx.apexIdentifier().getText();
  let returnType = ctx.type() ? ctx.type().accept(this) : 'void';
  let parameters = ctx.formalParameters().accept(this);
  let throws = ctx.qualifiedNameList() ? ctx.qualifiedNameList().accept(this) : [];
  let statements = ctx.methodBody() ? ctx.methodBody().accept(this) : null;

  return new Ast.MethodDeclarationNode(
    methodName,
    null,
    returnType,
    parameters,
    throws,
    statements
  );
};


// Visit a parse tree produced by apexParser#constructorDeclaration.
ApexAstBuilder.prototype.visitConstructorDeclaration = function(ctx) {
  let name = ctx.apexIdentifier().accept(this);
  let formalParameters = ctx.formalParameters().accept(this);
  let throws = ctx.qualifiedNameList() ? ctx.qualifiedNameList().accept(this) : [];
  let constructorBody = ctx.constructorBody().accept(this);
  return new Ast.ConstructorDeclarationNode(
    name,
    null,
    throws,
    formalParameters,
    constructorBody
  )
};


// Visit a parse tree produced by apexParser#fieldDeclaration.
ApexAstBuilder.prototype.visitFieldDeclaration = function(ctx) {
  let type = ctx.type().accept(this);
  let declarators = ctx.variableDeclarators().accept(this);
  return new Ast.FieldDeclarationNode(type, null, declarators)
};


// Visit a parse tree produced by apexParser#propertyDeclaration.
ApexAstBuilder.prototype.visitPropertyDeclaration = function(ctx) {
  const type = ctx.type().accept(this);
  const variableDeclaratorId = ctx.variableDeclaratorId().accept(this);
  const propertyBodyDeclaration = ctx.propertyBodyDeclaration().accept(this);
  return new Ast.PropertyDeclarationNode(null, type, variableDeclaratorId, propertyBodyDeclaration);
};


// Visit a parse tree produced by apexParser#propertyBodyDeclaration.
ApexAstBuilder.prototype.visitPropertyBodyDeclaration = function(ctx) {
  return ctx.propertyBlock().map((propertyBlock) => {
    return propertyBlock.accept(this);
  });
};


// Visit a parse tree produced by apexParser#interfaceBodyDeclaration.
ApexAstBuilder.prototype.visitInterfaceBodyDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#interfaceMemberDeclaration.
ApexAstBuilder.prototype.visitInterfaceMemberDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#constDeclaration.
ApexAstBuilder.prototype.visitConstDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#constantDeclarator.
ApexAstBuilder.prototype.visitConstantDeclarator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#interfaceMethodDeclaration.
ApexAstBuilder.prototype.visitInterfaceMethodDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#variableDeclarators.
ApexAstBuilder.prototype.visitVariableDeclarators = function(ctx) {
  return ctx.variableDeclarator().map((declarator) => {
    return declarator.accept(this);
  });
};


// Visit a parse tree produced by apexParser#variableDeclarator.
ApexAstBuilder.prototype.visitVariableDeclarator = function(ctx) {
  let declaratorId = ctx.variableDeclaratorId().getText();
  let expression;
  if (ctx.variableInitializer()) {
    expression = ctx.variableInitializer().accept(this);
  } else {
    expression = new Ast.NullNode(ctx.start.line);
  }

  return new Ast.VariableDeclaratorNode(declaratorId, expression, ctx.start.line);
};


// Visit a parse tree produced by apexParser#variableDeclaratorId.
ApexAstBuilder.prototype.visitVariableDeclaratorId = function(ctx) {
  return ctx.apexIdentifier().getText();
};


// Visit a parse tree produced by apexParser#variableInitializer.
ApexAstBuilder.prototype.visitVariableInitializer = function(ctx) {
  if (ctx.arrayInitializer()) {
    return ctx.arrayInitializer().accept(this);
  } else {
    return ctx.expression().accept(this);
  }
};


// Visit a parse tree produced by apexParser#arrayInitializer.
ApexAstBuilder.prototype.visitArrayInitializer = function(ctx) {
  if (ctx.variableInitializer()) {
    const initializers = ctx.variableInitializer().map((initializer) => {
      return initializer.accept(this);
    });
    return new Ast.ArrayInitializerNode(initializers);
  }
  return null;
};


// Visit a parse tree produced by apexParser#enumConstantName.
ApexAstBuilder.prototype.visitEnumConstantName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#type.
ApexAstBuilder.prototype.visitType = function(ctx) {
  if (ctx.classOrInterfaceType()) {
    let type = ctx.classOrInterfaceType().accept(this);
    if (ctx.typedArray()) {
      for (let i = 0; i < ctx.typedArray().length; i++) {
        type = new Ast.TypeNode(['Array'], [type]);
      }
    }
    return type;
  } else if (ctx.primitiveType()) {
    let type = ctx.primitiveType().accept(this);
    if (ctx.typedArray()) {
      for (let i = 0; i < ctx.typedArray().length; i++) {
        type = new Ast.TypeNode(['Array'], [type]);
      }
    }
    return type;
  }
};


// Visit a parse tree produced by apexParser#classOrInterfaceType.
ApexAstBuilder.prototype.visitClassOrInterfaceType = function(ctx) {
  if (ctx.typeIdentifier()) {
    let parameters = [];
    if (ctx.typeArguments() && ctx.typeArguments().length > 0) {
      parameters = ctx.typeArguments()[0].accept(this);
    }
    let name = ctx.typeIdentifier().map((identifier) => {
      return identifier.getText();
    });
    return new Ast.TypeNode(name, parameters, ctx.start.line);
  } else if (ctx.SET()) {
    let parameters = ctx.typeArguments().accept(this);
    return new Ast.TypeNode(ctx.SET().getText(), parameters, ctx.start.line)
  }
};


// Visit a parse tree produced by apexParser#primitiveType.
ApexAstBuilder.prototype.visitPrimitiveType = function(ctx) {
  return new Ast.TypeNode([ctx.getText()], [], ctx.start.line);
};


// Visit a parse tree produced by apexParser#typeArguments.
ApexAstBuilder.prototype.visitTypeArguments = function(ctx) {
  return ctx.typeArgument().map((argument) => {
    return argument.accept(this);
  })
};


// Visit a parse tree produced by apexParser#typeArgument.
ApexAstBuilder.prototype.visitTypeArgument = function(ctx) {
  return ctx.type().accept(this);
};


// Visit a parse tree produced by apexParser#qualifiedNameList.
ApexAstBuilder.prototype.visitQualifiedNameList = function(ctx) {
  return ctx.qualifiedName().map((qualifiedName) => {
    return qualifiedName.accept(this);
  })
};


// Visit a parse tree produced by apexParser#formalParameters.
ApexAstBuilder.prototype.visitFormalParameters = function(ctx) {
  return ctx.formalParameterList() ? ctx.formalParameterList().accept(this) : [];
};


// Visit a parse tree produced by apexParser#formalParameterList.
ApexAstBuilder.prototype.visitFormalParameterList = function(ctx) {
  return ctx.formalParameter().map((parameter) => {
    return parameter.accept(this);
  });
};


// Visit a parse tree produced by apexParser#formalParameter.
ApexAstBuilder.prototype.visitFormalParameter = function(ctx) {
  let modifiers = ctx.variableModifier().map((modifier) => {
    return modifier.accept(this);
  });
  let type = ctx.type().accept(this);
  let variableDeclaratorId = ctx.variableDeclaratorId().accept(this);
  return new Ast.ParameterNode(modifiers, type, variableDeclaratorId, ctx.start.line);
};


// Visit a parse tree produced by apexParser#lastFormalParameter.
ApexAstBuilder.prototype.visitLastFormalParameter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#methodBody.
ApexAstBuilder.prototype.visitMethodBody = function(ctx) {
  return ctx.block().accept(this);
};


// Visit a parse tree produced by apexParser#constructorBody.
ApexAstBuilder.prototype.visitConstructorBody = function(ctx) {
  return ctx.block().accept(this);
};


// Visit a parse tree produced by apexParser#qualifiedName.
ApexAstBuilder.prototype.visitQualifiedName = function(ctx) {
  let value = ctx.apexIdentifier().map((identifier) => {
    return identifier.getText();
  });
  return new Ast.NameNode(value, ctx.start.line);
};


// Visit a parse tree produced by apexParser#literal.
ApexAstBuilder.prototype.visitLiteral = function(ctx) {
  const lineNo = ctx.start.line;
  if (ctx.IntegerLiteral()) {
    return new Ast.IntegerNode(parseInt(ctx.IntegerLiteral().getText()), lineNo);
  } else if (ctx.FloatingPointLiteral()) {
    return new Ast.DoubleNode(parseFloat(ctx.FloatingPointLiteral().getText()), lineNo);
  } else if (ctx.StringLiteral()) {
    let text = ctx.StringLiteral().getText();
    return new Ast.StringNode(text.substring(1, text.length - 1), lineNo);
  } else if (ctx.BooleanLiteral()) {
    return new Ast.BooleanNode(ctx.BooleanLiteral().getText() == 'true', lineNo);
  } else if (ctx.NullLiteral()) {
    return new Ast.NullNode(lineNo, lineNo);
  }
  throw 'Invalid Literal';
};


// Visit a parse tree produced by apexParser#annotation.
ApexAstBuilder.prototype.visitAnnotation = function(ctx) {
  let name = ctx.annotationName().accept(this);
  let parameters;
  if (ctx.elementValuePairs()) {
    parameters = ctx.elementValuePairs().accept(this);
  } else if (ctx.elementValue()) {
    parameters = ctx.elementValue().accept(this);
  }
  return new Ast.AnnotationNode(name, parameters, ctx.start.line);
};


// Visit a parse tree produced by apexParser#annotationName.
ApexAstBuilder.prototype.visitAnnotationName = function(ctx) {
  return ctx.qualifiedName().accept(this);
};


// Visit a parse tree produced by apexParser#elementValuePairs.
ApexAstBuilder.prototype.visitElementValuePairs = function(ctx) {
  return ctx.elementValuePair().map((pair) => {
    return pair.accept(this);
  });
};


// Visit a parse tree produced by apexParser#elementValuePair.
ApexAstBuilder.prototype.visitElementValuePair = function(ctx) {
  let identifier = ctx.apexIdentifier().getText();
  let expression = ctx.elementValue().accept(this);
  return {
    identifier: identifier,
    expression: expression,
  };
};


// Visit a parse tree produced by apexParser#elementValue.
ApexAstBuilder.prototype.visitElementValue = function(ctx) {
  if (ctx.expression()) {
    return ctx.expression().accept(this);
  } else if (ctx.annotation()) {
    return ctx.annotation().accept(this);
  } else if (ctx.elementValueArrayInitializer()) {
    return ctx.elementValueArrayInitializer().accept(this);
  }
  throw 'Invalid ElementValue';
};


// Visit a parse tree produced by apexParser#elementValueArrayInitializer.
ApexAstBuilder.prototype.visitElementValueArrayInitializer = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#block.
ApexAstBuilder.prototype.visitBlock = function(ctx) {
  const statements = ctx.blockStatement().map((statement) => {
    return statement.accept(this);
  }).filter((statement) => {
    return statement !== null;
  });

  return new Ast.BlockNode(statements, ctx.start.line);
};


// Visit a parse tree produced by apexParser#blockStatement.
ApexAstBuilder.prototype.visitBlockStatement = function(ctx) {
  if (ctx.statement()) {
    return ctx.statement().accept(this);
  } else if (ctx.localVariableDeclarationStatement()) {
    return ctx.localVariableDeclarationStatement().accept(this);
  } else if (ctx.typeDeclaration()) {
    return ctx.typeDeclaration().accept(this);
  } else {
    const method = ctx.specialComment().accept(this).match(/\/\/(.*)/)[1].trim();
    if (method !== 'debugger') return null;

    return new Ast.SpecialCommentNode(method, ctx.start.line, this.filename);
  }
};


// Visit a parse tree produced by apexParser#localVariableDeclarationStatement.
ApexAstBuilder.prototype.visitLocalVariableDeclarationStatement = function(ctx) {
  return ctx.localVariableDeclaration().accept(this);
};


// Visit a parse tree produced by apexParser#localVariableDeclaration.
ApexAstBuilder.prototype.visitLocalVariableDeclaration = function(ctx) {
  let modifiers = ctx.variableModifier().map((modifier) => {
    return modifier.accept(this);
  });
  let type = ctx.type().accept(this);
  let declarators = ctx.variableDeclarators().accept(this);
  return new Ast.VariableDeclarationNode(modifiers, type, declarators, ctx.start.line);
};


// Visit a parse tree produced by apexParser#statement.
ApexAstBuilder.prototype.visitStatement = function(ctx) {
  const lineNo = ctx.start.line;
  if (ctx.TRY()) {
    let block = ctx.block().accept(this);
    let catchClause = ctx.catchClause() ? ctx.catchClause().map((catchClause) => {
        return catchClause.accept(this);
    }) : null;
    let finallyBlock = ctx.finallyBlock() ? ctx.finallyBlock().accept(this) : null;
    return new Ast.TryNode(block, catchClause, finallyBlock, lineNo);
  } else if (ctx.IF()) {
    let condition = ctx.parExpression().accept(this);
    let if_statement = ctx.statement()[0].accept(this);
    let else_statement = ctx.statement().length > 1 ? ctx.statement()[1].accept(this) : null;
    return new Ast.IfNode(condition, if_statement, else_statement, lineNo);
  } else if (ctx.SWITCH()) {
    const expression = ctx.expression().accept(this);
    let whenStatements, elseStatement;
    [whenStatements, elseStatement] = ctx.whenStatements().accept(this);
    return new Ast.SwitchNode(expression, whenStatements, elseStatement, lineNo);
  } else if (ctx.FOR()) {
    let forControl = ctx.forControl().accept(this);
    let statement = ctx.statement()[0].accept(this);
    return new Ast.ForNode(forControl, statement, lineNo);
  } else if (ctx.WHILE()) {
    let doFlag = ctx.DO() != null;
    let condition = ctx.parExpression().accept(this);
    let statements = ctx.statement().map((statement) => {
      return statement.accept(this)
    });
    return new Ast.WhileNode(condition, statements, doFlag, lineNo);
  } else if (ctx.RETURN()) {
    let expression = ctx.expression() ? ctx.expression().accept(this) : new Ast.NullNode(ctx.start.line);
    return new Ast.ReturnNode(expression, lineNo);
  } else if (ctx.THROW()) {
    let expression = ctx.expression().accept(this);
    return new Ast.ThrowNode(expression, lineNo);
  } else if (ctx.BREAK()) {
    return new Ast.BreakNode(lineNo);
  } else if (ctx.CONTINUE()) {
    return new Ast.ContinueNode(lineNo);
  } else if (ctx.statementExpression()) {
    return ctx.statementExpression().accept(this);
  } else if (ctx.apexDbExpression()) {
    return ctx.apexDbExpression().accept(this);
  } else if (ctx.block()) {
    return ctx.block().accept(this);
  } else {
    return new Ast.NothingStatementNode(lineNo);
  }
};


// Visit a parse tree produced by apexParser#propertyBlock.
ApexAstBuilder.prototype.visitPropertyBlock = function(ctx) {
  const modifiers = ctx.modifier().map((modifier) => { return modifier.accept(this); });
  const type = ctx.getter() ? 'getter' : 'setter';
  return new Ast.GetterSetterNode(type, modifiers, null, ctx.start.line);
};


// Visit a parse tree produced by apexParser#catchClause.
ApexAstBuilder.prototype.visitCatchClause = function(ctx) {
  let modifiers = ctx.variableModifier().map((modifier) => {
    return modifier.accept(this);
  });
  let catchType = ctx.catchType().accept(this);
  let block = ctx.block().accept(this);
  let identifier = ctx.apexIdentifier().getText();
  return new Ast.CatchNode(modifiers, catchType, identifier, block, ctx.start.line);
};


// Visit a parse tree produced by apexParser#catchType.
ApexAstBuilder.prototype.visitCatchType = function(ctx) {
  return ctx.qualifiedName().map((name) => {
    return name.accept(this);
  });
};


// Visit a parse tree produced by apexParser#finallyBlock.
ApexAstBuilder.prototype.visitFinallyBlock = function(ctx) {
  return ctx.block().accept(this);
};


// Visit a parse tree produced by apexParser#forControl.
ApexAstBuilder.prototype.visitForControl = function(ctx) {
  if (ctx.enhancedForControl()) {
    return ctx.enhancedForControl().accept(this);
  } else {
    let forInit = ctx.forInit() ? ctx.forInit().accept(this) : null;
    let expression = ctx.expression() ? ctx.expression().accept(this) : null;
    let forUpdate = ctx.forUpdate() ? ctx.forUpdate().accept(this) : null;
    return new Ast.ForControlNode(forInit, expression, forUpdate, ctx.start.line);
  }
};


// Visit a parse tree produced by apexParser#forInit.
ApexAstBuilder.prototype.visitForInit = function(ctx) {
  if (ctx.localVariableDeclaration()) {
    return ctx.localVariableDeclaration().accept(this);
  } else {
    return ctx.expressionList().accept(this);
  }
};


// Visit a parse tree produced by apexParser#enhancedForControl.
ApexAstBuilder.prototype.visitEnhancedForControl = function(ctx) {
  let modifiers = ctx.variableModifier().map((modifier) => {
    return modifier.accept(this);
  });
  let type = ctx.type().accept(this);
  let variableDeclaratorId = ctx.variableDeclaratorId().accept(this);
  let expression = ctx.expression().accept(this);

  return new Ast.EnhancedForControlNode(modifiers, type, variableDeclaratorId, expression, ctx.start.line)
};


// Visit a parse tree produced by apexParser#forUpdate.
ApexAstBuilder.prototype.visitForUpdate = function(ctx) {
  return ctx.expressionList().accept(this);
};


// Visit a parse tree produced by apexParser#parExpression.
ApexAstBuilder.prototype.visitParExpression = function(ctx) {
  return ctx.expression().accept(this);
};


// Visit a parse tree produced by apexParser#expressionList.
ApexAstBuilder.prototype.visitExpressionList = function(ctx) {
  return ctx.expression().map((expression) => {
    return expression.accept(this);
  });
};


// Visit a parse tree produced by apexParser#statementExpression.
ApexAstBuilder.prototype.visitStatementExpression = function(ctx) {
  return ctx.expression().accept(this);
};


// Visit a parse tree produced by apexParser#constantExpression.
ApexAstBuilder.prototype.visitConstantExpression = function(ctx) {
  return ctx.expression().accept(this);
};



// Visit a parse tree produced by apexParser#apexDbExpressionShort.
ApexAstBuilder.prototype.visitApexDbExpressionShort = function(ctx) {
  let dml = ctx.dml ? ctx.dml.text : 'upsert';
  let expression = ctx.expression().accept(this);
  let upsertKey = ctx.apexIdentifier() ? ctx.apexIdentifier().accept(this) : null
  return new Ast.DmlNode(dml, expression, upsertKey, ctx.start.line)
};


// Visit a parse tree produced by apexParser#apexDbExpression.
ApexAstBuilder.prototype.visitApexDbExpression = function(ctx) {
  return ctx.apexDbExpressionShort().accept(this);
};



// Visit a parse tree produced by apexParser#PrimaryExpression.
ApexAstBuilder.prototype.visitPrimaryExpression = function(ctx) {
  return ctx.primary().accept(this);
};


// Visit a parse tree produced by apexParser#OpExpression.
ApexAstBuilder.prototype.visitOpExpression = function(ctx) {
  let op = ctx.op.text;
  let left = ctx.expression()[0].accept(this);
  let right = ctx.expression().length > 1 ? ctx.expression()[1].accept(this) : ctx.type().accept(this);
  return new Ast.BinaryOperatorNode(op, left, right, ctx.start.line);
};

// Visit a parse tree produced by apexParser#PostUnaryExpression.
ApexAstBuilder.prototype.visitPostUnaryExpression = function(ctx) {
  let op = ctx.op.text;
  let expression  = ctx.expression().accept(this);
  return new Ast.UnaryOperatorNode(op, expression, true, ctx.start.line);
};

ApexAstBuilder.prototype.visitUnaryExpression = function(ctx) {
  let op = ctx.op.text;
  let expression  = ctx.expression().accept(this);
  return new Ast.UnaryOperatorNode(op, expression, true, ctx.start.line);
};

// Visit a parse tree produced by apexParser#PostUnaryExpression.
ApexAstBuilder.prototype.visitPostUnaryExpression = function(ctx) {
  let op = ctx.op.text;
  let expression  = ctx.expression().accept(this);
  return new Ast.UnaryOperatorNode(op, expression, false, ctx.start.line);
};

ApexAstBuilder.prototype.visitPreUnaryExpression = function(ctx) {
  let op = ctx.op.text;
  let expression  = ctx.expression().accept(this);
  return new Ast.UnaryOperatorNode(op, expression, true, ctx.start.line);
}


// Visit a parse tree produced by apexParser#NewExpression.
ApexAstBuilder.prototype.visitNewExpression = function(ctx) {
  return ctx.creator().accept(this);
};


// Visit a parse tree produced by apexParser#MethodInvocation.
ApexAstBuilder.prototype.visitMethodInvocation = function(ctx) {
  let receiver = ctx.expression().accept(this);
  let arguments = [];
  if (ctx.expressionList()) {
    arguments = ctx.expressionList().accept(this);
  }
  return new Ast.MethodInvocationNode(receiver, arguments, ctx.start.line);
};



// Visit a parse tree produced by apexParser#CastExpression.
ApexAstBuilder.prototype.visitCastExpression = function(ctx) {
  let type = ctx.type().accept(this);
  let expression = ctx.expression().accept(this);
  return new Ast.CastExpressionNode(type, expression, ctx.start.line);
};


// Visit a parse tree produced by apexParser#ShiftExpression.
ApexAstBuilder.prototype.visitShiftExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#FieldAccess.
ApexAstBuilder.prototype.visitFieldAccess = function(ctx) {
  let expression = ctx.expression().accept(this);
  let fieldName = ctx.apexIdentifier().accept(this);
  if (expression instanceof Ast.NameNode) {
    return new Ast.NameNode(expression.value.concat(fieldName), ctx.start.line)
  }
  return new Ast.FieldAccessNode(expression, fieldName, ctx.start.line);
};


// Visit a parse tree produced by apexParser#primary.
ApexAstBuilder.prototype.visitPrimary = function(ctx) {
  if (ctx.expression()) {
    return ctx.expression().accept(this);
  } else if (ctx.THIS()) {
    return new Ast.NameNode([ctx.THIS().getText()], ctx.start.line);
  } else if (ctx.SUPER()) {
    return new Ast.NameNode([ctx.SUPER().getText()], ctx.start.line);
  } else if (ctx.literal()) {
    return ctx.literal().accept(this);
  } else if (ctx.apexIdentifier()) {
    return new Ast.NameNode([ctx.apexIdentifier().accept(this)], ctx.start.line);
  } else if (ctx.soqlLiteral()) {
    return ctx.soqlLiteral().accept(this);
  } else if (ctx.soslLiteral()) {
    return ctx.soslLiteral().accept(this);
  } else if (ctx.type()) {
    return ctx.type().accept(this)
  } else if (ctx.VOID()) {
    return ctx.VOID().accept(this)
  } else {
    return new Ast.NameNode([ctx.primitiveType().getText()], ctx.start.line);
  }
};


// Visit a parse tree produced by apexParser#creator.
ApexAstBuilder.prototype.visitCreator = function(ctx) {
  if (ctx.nonWildcardTypeArguments()) {
    let createdName = ctx.createdName().accept(this);
    let classCreatorRest = ctx.classCreatorRest().accept(this);
    return new Ast.NewNode(createdName, classCreatorRest, ctx.start.line);
  } else {
    let createdName = ctx.createdName().accept(this);
    let arrayCreatorRest = ctx.arrayCreatorRest() ? ctx.arrayCreatorRest().accept(this) : null;
    let classCreatorRest = ctx.classCreatorRest() ? ctx.classCreatorRest().accept(this) : null;
    let mapCreatorRest = ctx.mapCreatorRest() ? ctx.mapCreatorRest().accept(this) : null;
    let setCreatorRest = ctx.setCreatorRest() ? ctx.setCreatorRest().accept(this) : null;
    return new Ast.NewNode(createdName, classCreatorRest || arrayCreatorRest || mapCreatorRest || setCreatorRest, ctx.start.line);
  }
};


// Visit a parse tree produced by apexParser#createdName.
ApexAstBuilder.prototype.visitCreatedName = function(ctx) {
  if (ctx.apexIdentifier()) {
    let name = ctx.apexIdentifier().map((identifier) => {
      return identifier.getText();
    });
    let arguments = ctx.typeArgumentsOrDiamond().length > 0 ? ctx.typeArgumentsOrDiamond()[0].accept(this) : [];
    return new Ast.TypeNode(name, arguments, ctx.start.line);
  }
};


// Visit a parse tree produced by apexParser#innerCreator.
ApexAstBuilder.prototype.visitInnerCreator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#arrayCreatorRest.
ApexAstBuilder.prototype.visitArrayCreatorRest = function(ctx) {
  const dim = ctx.typedArray().length;
  const expressions = ctx.expression() ? ctx.expression().map((expression) => {
    return expression.accept(this);
  }) : null;
  const arrayInitializer = ctx.arrayInitializer() ? ctx.arrayInitializer().accept(this) : null;
  return new Ast.ArrayCreatorNode(dim, expressions, arrayInitializer);
};


// Visit a parse tree produced by apexParser#mapCreatorRest.
ApexAstBuilder.prototype.visitMapCreatorRest = function(ctx) {
  return new Ast.MapCreatorNode(ctx.start.line)
};


// Visit a parse tree produced by apexParser#setCreatorRest.
ApexAstBuilder.prototype.visitSetCreatorRest = function(ctx) {
  return new Ast.SetCreatorNode(ctx.start.line)
};


// Visit a parse tree produced by apexParser#classCreatorRest.
ApexAstBuilder.prototype.visitClassCreatorRest = function(ctx) {
  return ctx.arguments().accept(this);
};


// Visit a parse tree produced by apexParser#explicitGenericInvocation.
ApexAstBuilder.prototype.visitExplicitGenericInvocation = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#nonWildcardTypeArguments.
ApexAstBuilder.prototype.visitNonWildcardTypeArguments = function(ctx) {
  return ctx.typeList().accept(this);
};


// Visit a parse tree produced by apexParser#typeArgumentsOrDiamond.
ApexAstBuilder.prototype.visitTypeArgumentsOrDiamond = function(ctx) {
  return ctx.typeArguments().accept(this);
};


// Visit a parse tree produced by apexParser#nonWildcardTypeArgumentsOrDiamond.
ApexAstBuilder.prototype.visitNonWildcardTypeArgumentsOrDiamond = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#superSuffix.
ApexAstBuilder.prototype.visitSuperSuffix = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#explicitGenericInvocationSuffix.
ApexAstBuilder.prototype.visitExplicitGenericInvocationSuffix = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#arguments.
ApexAstBuilder.prototype.visitArguments = function(ctx) {
  return ctx.expressionList() ? ctx.expressionList().accept(this) : [];
};

ApexAstBuilder.prototype.visitArrayAccess = function(ctx) {
  const receiverNode = ctx.expression()[0].accept(this);
  const key = ctx.expression()[1].accept(this);
  return new Ast.ArrayAccessNode(receiverNode, key, ctx.start.line)
};

ApexAstBuilder.prototype.visitTriggerDeclaration = function(ctx) {
  const timings = ctx.triggerTimings().accept(this);
  const name = ctx.apexIdentifier()[0].getText();
  const object = ctx.apexIdentifier()[1].getText();
  const block = ctx.block().accept(this);
  return new Ast.TriggerNode(name, object, timings, block, ctx.start.line);
};

ApexAstBuilder.prototype.visitTriggerTimings = function(ctx) {
  return ctx.triggerTiming().map((timing) => {
    return timing.accept(this);
  })
};

ApexAstBuilder.prototype.visitTriggerTiming = function(ctx) {
  return { timing: ctx.timing.text, dml: ctx.dml.text };
};

ApexAstBuilder.prototype.visitWhenStatements = function(ctx) {
  const whenStatements = ctx.whenStatement().map((whenStatement) => {
    return whenStatement.accept(this);
  });
  const elseStatement = ctx.block().accept(this);
  return [whenStatements, elseStatement];
};

ApexAstBuilder.prototype.visitWhenStatement = function(ctx) {
  const whenExpression = ctx.whenExpression().accept(this);
  const statements = ctx.block().accept(this);
  return new Ast.WhenNode(whenExpression, statements, ctx.start.line);
};

ApexAstBuilder.prototype.visitWhenExpression = function(ctx) {
  if (ctx.literal()){
    return ctx.literal().map((literal) => {
      return literal.accept(this);
    });
  } else {
    const type = ctx.type().accept(this);
    const identifier = ctx.apexIdentifier().getText();
    return new Ast.WhenTypeNode(type, identifier);
  }
};

ApexAstBuilder.prototype.visitSpecialComment = function(ctx) {
  return ctx.LINE_COMMENT().getText();
};

ApexAstBuilder.prototype.visitSoqlLiteral = function(ctx) {
  const soqlNode = ctx.query().accept(this);
  soqlNode.lineno = ctx.start.line
  return soqlNode
}

ApexAstBuilder.prototype.visitQuery = function(ctx) {
  const selectFields = ctx.selectClause().accept(this)
  const fromObject   = ctx.fromClause().accept(this)
  const where        = ctx.whereClause() ? ctx.whereClause().accept(this) : null
  const order        = ctx.orderClause() ? ctx.orderClause().accept(this) : null
  const soql = new Ast.SoqlNode()
  soql.selectFields = selectFields
  soql.fromObject = fromObject
  soql.where = where || []
  soql.order = order
  return soql
}

ApexAstBuilder.prototype.visitSelectClause = function(ctx) {
  return ctx.fieldList().accept(this)
}

ApexAstBuilder.prototype.visitFieldList = function(ctx) {
  return ctx.selectField().map((selectField) => {
    return selectField.accept(this)
  })
}

ApexAstBuilder.prototype.visitSelectField = function(ctx) {
  if (ctx.soqlField()) {
    return ctx.soqlField().accept(this);
  } else if (ctx.subquery()) {

  } else {

  }
}

ApexAstBuilder.prototype.visitSoqlFunctionCall = function(ctx) {
  const funcName = ctx.apexIdentifier().getText()
  const args = ctx.soqlField().map((soqlField) => {
    return soqlField.accept(this)
  })
  return {
    funcName,
    args
  }
}

ApexAstBuilder.prototype.visitSoqlFieldReference = function(ctx) {
  const path = ctx.apexIdentifier().map((identifier) => {
    return identifier.getText()
  })
  return {
    path
  }
}

ApexAstBuilder.prototype.visitSubquery = function(ctx) {
  return ctx.query().accept(this)
}

ApexAstBuilder.prototype.visitFromClause = function(ctx) {
  return ctx.apexIdentifier().getText()
}

ApexAstBuilder.prototype.visitWhereClause = function(ctx) {
  return ctx.whereField().map((whereField) => {
    return whereField.accept(this)
  })
}

ApexAstBuilder.prototype.visitWhereField = function(ctx) {
  if (ctx.soqlField()) {
    const field = ctx.soqlField().accept(this)
    const value = ctx.soqlValue().accept(this)
    const op = ctx.op.text;
    return {
      field,
      value,
      op
    }
  } else {
    return ctx.whereField().map((whereField) => {
      return whereField.accept(this)
    })
  }
}

ApexAstBuilder.prototype.visitSoqlValue = function(ctx) {
  if (ctx.literal()) {
    return ctx.literal().accept(this)
  } else {
    return ctx.bindVariable().accept(this)
  }
}

ApexAstBuilder.prototype.visitBindVariable = function(ctx) {
  const expression = ctx.expression().accept(this)
  return new Ast.SoqlBindVariable(expression, ctx.start.line)
}

ApexAstBuilder.prototype.visitOrderClause = function(ctx) {
  const field = ctx.soqlField().accept(this)
  const asc_desc = ctx.asc_desc ? ctx.asc_desc.text : 'ASC'
  const nulls = ctx.nulls ? ctx.nulls.text : null
  return {
    asc_desc,
    nulls
  }
}

ApexAstBuilder.prototype.visitLimitClause = function(ctx) {
  const limit = ctx.IntegerLiteral().getText()
  const bindVariable = ctx.bindVariable().accept(this)
  return {
    limit,
    bindVariable
  }
}

ApexAstBuilder.prototype.visitSoslLiteral = function(ctx) {
  const soslNode = ctx.soslQuery().accept(this);
  soslNode.lineno = ctx.start.line
  return soslNode
}

ApexAstBuilder.prototype.visitSoslQuery = function(ctx) {
  const literal = ctx.literal().accept(this)
  const soslReturningObject = ctx.soslReturningObject().map((object) => {
    return object.accept(this)
  })
  return new Ast.SoslNode()
}

ApexAstBuilder.prototype.visitSoslReturningObject = function(ctx) {
  return ctx.Identifier().map((identifier) =>  {
    return identifier.accept(this)
  })
}

ApexAstBuilder.prototype.visitApexIdentifier = function(ctx) {
  if (ctx.Identifier()) {
    return ctx.Identifier().getText()
  } else if (ctx.primitiveType()) {
    return ctx.primitiveType().getText()
  } else {
    return ctx.getText()
  }
}

ApexAstBuilder.prototype.visitTypeIdentifier = function(ctx) {
  if (ctx.Identifier()) {
    return ctx.Identifier().getText()
  } else if (ctx.GET()) {
    return ctx.GET().getText()
  } else if (ctx.SET()) {
    return ctx.GET().getText()
  } else if (ctx.DATA()) {
    return ctx.DATA().getText()
  } else if (ctx.GROUP()) {
    return ctx.GROUP().getText()
  } else if (ctx.SCOPE()) {
    return ctx.SCOPE().getText()
  }
}

ApexAstBuilder.prototype.visitTernalyExpression = function(ctx) {
  const expressions = ctx.expression().map((expression) => {
    return expression.accept(this)
  })
  return new Ast.TernalyExpression(
    expressions[0],
    expressions[1],
    expressions[2],
    ctx.start.line
  )
}

module.exports = ApexAstBuilder;
