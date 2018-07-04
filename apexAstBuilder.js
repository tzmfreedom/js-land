// Generated from apex.g4 by ANTLR 4.7.1
// jshint ignore: start
var ApexVisitor = require('./apexVisitor').apexVisitor;
var Ast = require('./node/ast');

let ApexAstBuilder = function() {
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
  } else if (ctx.interfaceBodyDeclaration()) {
    let interfaceBodyDeclaration = ctx.interfaceBodyDeclaration().accept(this);
    interfaceBodyDeclaration.modifier = modifiers;
    return interfaceBodyDeclaration;
  }
};


// Visit a parse tree produced by apexParser#modifier.
ApexAstBuilder.prototype.visitModifier = function(ctx) {
  if (ctx.classOrInterfaceModifier()) {
    return ctx.classOrInterfaceModifier().accept(this);
  }
  return new Ast.ModifierNode(ctx.getText());
};


// Visit a parse tree produced by apexParser#classOrInterfaceModifier.
ApexAstBuilder.prototype.visitClassOrInterfaceModifier = function(ctx) {
  if (ctx.annotation()) {
    return ctx.annotation().accept(this);
  }
  return new Ast.ModifierNode(ctx.getText());
};


// Visit a parse tree produced by apexParser#variableModifier.
ApexAstBuilder.prototype.visitVariableModifier = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#classDeclaration.
ApexAstBuilder.prototype.visitClassDeclaration = function(ctx) {
  let className = ctx.Identifier().getText();
  let superClass;
  if (ctx.type()) {
    superClass = ctx.type().accept(this);
  }
  let implementClasses = [];
  if (ctx.typeList()) {
    implementClasses = ctx.typeList().map((type) => { return type.accept(this); });
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

  return new Ast.ClassNode(
    null,
    null,
    className,
    superClass,
    implementClasses,
    constructor,
    instanceFields,
    instanceMethods,
    staticFields,
    staticMethods
  );
};


// Visit a parse tree produced by apexParser#typeParameters.
ApexAstBuilder.prototype.visitTypeParameters = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeParameter.
ApexAstBuilder.prototype.visitTypeParameter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeBound.
ApexAstBuilder.prototype.visitTypeBound = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enumDeclaration.
ApexAstBuilder.prototype.visitEnumDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enumConstants.
ApexAstBuilder.prototype.visitEnumConstants = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enumConstant.
ApexAstBuilder.prototype.visitEnumConstant = function(ctx) {
  return this.visitChildren(ctx);
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
  let decl = declaration.accept(this);
  decl.modifiers = ctx.modifier().map((modifier) => { return modifier.accept(this) });
  return decl;
};


// Visit a parse tree produced by apexParser#memberDeclaration.
ApexAstBuilder.prototype.visitMemberDeclaration = function(ctx) {
  return this.visitChildren(ctx)[0];
};


// Visit a parse tree produced by apexParser#methodDeclaration.
ApexAstBuilder.prototype.visitMethodDeclaration = function(ctx) {
  let methodName = ctx.Identifier().getText();
  let returnType = ctx.type() ? ctx.type().accept(this) : 'void';
  let parameters = ctx.formalParameters().accept(this);
  let throws = ctx.qualifiedNameList() ? ctx.qualifiedNameList().accept(this) : [];
  let statements = ctx.methodBody().accept(this);

  return new Ast.MethodDeclarationNode(
    methodName,
    null,
    returnType,
    parameters,
    throws,
    statements
  );
};


// Visit a parse tree produced by apexParser#genericMethodDeclaration.
ApexAstBuilder.prototype.visitGenericMethodDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#constructorDeclaration.
ApexAstBuilder.prototype.visitConstructorDeclaration = function(ctx) {
  let name = ctx.Identifier().accept(this);
  let formalParameters = ctx.formalParameters().accept(this);
  let throws = ctx.qualifiedNameList().accept(this);
  let constructorBody = ctx.constructorBody().accept(this);
  return new Ast.ConstructorDeclarationNode(
    name,
    null,
    throws,
    formalParameters,
    constructorBody
  )
};


// Visit a parse tree produced by apexParser#genericConstructorDeclaration.
ApexAstBuilder.prototype.visitGenericConstructorDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#fieldDeclaration.
ApexAstBuilder.prototype.visitFieldDeclaration = function(ctx) {
  let type = ctx.type().accept(this);
  let declarators = ctx.variableDeclarators().accept(this);
  return new Ast.FieldDeclarationNode(type, null, declarators)
};


// Visit a parse tree produced by apexParser#propertyDeclaration.
ApexAstBuilder.prototype.visitPropertyDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#propertyBodyDeclaration.
ApexAstBuilder.prototype.visitPropertyBodyDeclaration = function(ctx) {
  return this.visitChildren(ctx);
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


// Visit a parse tree produced by apexParser#genericInterfaceMethodDeclaration.
ApexAstBuilder.prototype.visitGenericInterfaceMethodDeclaration = function(ctx) {
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
    expression = new Ast.NullNode();
  }

  return new Ast.VariableDeclaratorNode(declaratorId, expression);
};


// Visit a parse tree produced by apexParser#variableDeclaratorId.
ApexAstBuilder.prototype.visitVariableDeclaratorId = function(ctx) {
  return ctx.Identifier().getText();
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
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enumConstantName.
ApexAstBuilder.prototype.visitEnumConstantName = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#type.
ApexAstBuilder.prototype.visitType = function(ctx) {
  if (ctx.classOrInterfaceType()) {
    return ctx.classOrInterfaceType().accept(this);
  } else if (ctx.primitiveType()) {
    return ctx.primitiveType().accept(this);
  }
};


// Visit a parse tree produced by apexParser#classOrInterfaceType.
ApexAstBuilder.prototype.visitClassOrInterfaceType = function(ctx) {
  if (ctx.Identifier()) {
    let parameters = [];
    if (ctx.typeArguments() && ctx.typeArguments().length > 0) {
      parameters = ctx.typeArguments()[0].accept(this);
    }
    let name = ctx.Identifier().map((identifier) => {
      return identifier.getText();
    });
    return new Ast.TypeNode(name, parameters);
  } else if (ctx.SET()) {
    let parameters = ctx.typeArguments().accept(this);
    return new Ast.TypeNode(ctx.SET().getText(), parameters)
  }
};


// Visit a parse tree produced by apexParser#primitiveType.
ApexAstBuilder.prototype.visitPrimitiveType = function(ctx) {
  return new Ast.TypeNode([ctx.getText()], []);
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
  return this.visitChildren(ctx);
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
  return new Ast.ParameterNode(modifiers, type, variableDeclaratorId);
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
  let value = ctx.Identifier().map((identifier) => {
    return identifier.getText();
  });
  return new Ast.NameNode(value);
};


// Visit a parse tree produced by apexParser#literal.
ApexAstBuilder.prototype.visitLiteral = function(ctx) {
  if (ctx.IntegerLiteral()) {
    return new Ast.IntegerNode(ctx.IntegerLiteral().getText());
  } else if (ctx.FloatingPointLiteral()) {
    return new Ast.DoubleNode(ctx.IntegerLiteral().getText());
  } else if (ctx.StringLiteral()) {
    let text = ctx.StringLiteral().getText();
    return new Ast.StringNode(text.substring(1, text.length - 1));
  } else if (ctx.BooleanLiteral()) {
    return new Ast.BooleanNode(ctx.BooleanLiteral().getText());
  } else if (ctx.NullLiteral()) {
    return new Ast.NullNode();
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
  return new Ast.AnnotationNode(name, parameters);
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
  let identifier = ctx.Identifier().getText();
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
  return ctx.blockStatement().map((statement) => {
    return statement.accept(this);
  });
};


// Visit a parse tree produced by apexParser#blockStatement.
ApexAstBuilder.prototype.visitBlockStatement = function(ctx) {
  if (ctx.statement()) {
    return ctx.statement().accept(this);
  } else if (ctx.localVariableDeclarationStatement()) {
    return ctx.localVariableDeclarationStatement().accept(this);
  } else if (ctx.typeDeclaration()) {
    return ctx.typeDeclaration().accept(this);
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
  return new Ast.VariableDeclarationNode(modifiers, type, declarators);
};


// Visit a parse tree produced by apexParser#statement.
ApexAstBuilder.prototype.visitStatement = function(ctx) {
  if (ctx.block()) {
    return ctx.block().accept(this);
  } else if (ctx.IF()) {
    let condition = ctx.parExpression().accept(this);
    let if_statement = ctx.statement()[0];
    let else_statement = ctx.statement().length > 1 ? ctx.statement()[1] : null;
    return new Ast.IfNode(condition, if_statement, else_statement);
  } else if (ctx.FOR()) {
    let forControl = ctx.forControl().accept(this);
    let statement = ctx.statement().accept(this);
    return new Ast.ForNode(forControl, statement);
  } else if (ctx.WHILE()) {
    let doFlag = ctx.DO() != null;
    let condition = ctx.parExpression().accept(this);
    let statements = ctx.statement().accept(this);
    return new Ast.WhileNode(condition, statements, doFlag);
  } else if (ctx.TRY()) {
    let block = ctx.block().accept(this);
    let catchClause = ctx.catchClause() ? ctx.catchClause().accept(this) : null;
    let finallyBlock = ctx.finallyBlock() ? ctx.finallyBlock().accept(this) : null;
    return new Ast.TryNode(block, catchClause, finallyBlock);
  } else if (ctx.RETURN()) {
    let expression = ctx.expression().accept(this);
    return new Ast.ReturnNode(expression);
  } else if (ctx.THROW()) {
    let expression = ctx.expression().accept(this);
    return new Ast.ThrowNode(expression);
  } else if (ctx.BREAK()) {
    let expression = ctx.expression().accept(this);
    return new Ast.ReturnNode(expression);
  } else if (ctx.CONTINUE()) {
    let expression = ctx.expression().accept(this);
    return new Ast.ReturnNode(expression);
  } else if (ctx.statementExpression()) {
    return ctx.statementExpression().accept(this);
  } else if (ctx.apexDbExpression()) {
    return ctx.apexDbExpression().accept(this);
  } else {
    return new Ast.NothingStatementNode();
  }
};


// Visit a parse tree produced by apexParser#propertyBlock.
ApexAstBuilder.prototype.visitPropertyBlock = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#getter.
ApexAstBuilder.prototype.visitGetter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#setter.
ApexAstBuilder.prototype.visitSetter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#catchClause.
ApexAstBuilder.prototype.visitCatchClause = function(ctx) {
  let modifiers = ctx.variableModifier().map((modifier) => {
    return modifier.accept(this);
  });
  let catchType = ctx.catchType().accept(this);
  let block = ctx.block().accept(this);
  let identifier = ctx.Identifier().getText();
  return new Ast.CatchNode(modifiers, catchType, identifier, block);
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
    let forInit = ctx.forInit().accept(this);
    let expression = ctx.expression().accept(this);
    let forUpdate = ctx.forUpdate().accept(this);
    return new Ast.ForControl(forInit, expression, forUpdate);
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
  return new Ast.EnhancedForControl(modifiers, type, variableDeclaratorId, expression)
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
  let dml = ctx.dml().getText();
  let expression = ctx.expression().accept(this);
  return new Ast.DmlNode(dml, expression);
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
  let right = ctx.expression()[1].accept(this);
  return new Ast.BinaryOperatorNode(op, left, right);
};


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
  return new Ast.MethodInvocationNode(receiver, arguments, null);
};



// Visit a parse tree produced by apexParser#CastExpression.
ApexAstBuilder.prototype.visitCastExpression = function(ctx) {
  let type = ctx.type().accept(this);
  let expression = ctx.expression().accept(this);
  return new Ast.CastExpressionNode(type, expression);
};


// Visit a parse tree produced by apexParser#ShiftExpression.
ApexAstBuilder.prototype.visitShiftExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#FieldAccess.
ApexAstBuilder.prototype.visitFieldAccess = function(ctx) {
  let expression = ctx.expression().accept(this);
  let fieldName = ctx.Identifier().getText();
  if (expression instanceof Ast.NameNode) {
    return new Ast.NameNode(expression.value.concat(fieldName))
  } else if (expression instanceof Ast.StringNode) {
    return new Ast.NameNode([expression.value, fieldName])
  }
  return new Ast.FieldAccessNode(expression, fieldName);
};


// Visit a parse tree produced by apexParser#primary.
ApexAstBuilder.prototype.visitPrimary = function(ctx) {
  if (ctx.expression()) {
    return ctx.expression().accept(this);
  } else if (ctx.THIS()) {
    return new Ast.NameNode([ctx.THIS().getText()]);
  } else if (ctx.SUPER()) {
    return new Ast.NameNode([ctx.SUPER().getText()]);
  } else if (ctx.literal()) {
    return ctx.literal().accept(this);
  } else if (ctx.Identifier()) {
    return new Ast.NameNode([ctx.Identifier().getText()]);
  } else if (ctx.SoqlLiteral()) {
    return new Ast.SoqlNode(ctx.SoqlLiteral().getText());
  }
};


// Visit a parse tree produced by apexParser#creator.
ApexAstBuilder.prototype.visitCreator = function(ctx) {
  if (ctx.nonWildcardTypeArguments()) {
    let createdName = ctx.createdName().accept(this);
    let classCreatorRest = ctx.classCreatorRest().accept(this);
    return new Ast.NewNode(createdName, classCreatorRest);
  } else {

  }
};


// Visit a parse tree produced by apexParser#createdName.
ApexAstBuilder.prototype.visitCreatedName = function(ctx) {
  if (ctx.Identifier()) {
    let name = ctx.Identifier().getText();
    let arguments = ctx.typeArgumentsOrDiamond().map((type) => {
      return type.accept(this);
    });
    return new Ast.TypeNode(name, arguments);
  }
};


// Visit a parse tree produced by apexParser#innerCreator.
ApexAstBuilder.prototype.visitInnerCreator = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#arrayCreatorRest.
ApexAstBuilder.prototype.visitArrayCreatorRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#mapCreatorRest.
ApexAstBuilder.prototype.visitMapCreatorRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#setCreatorRest.
ApexAstBuilder.prototype.visitSetCreatorRest = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#classCreatorRest.
ApexAstBuilder.prototype.visitClassCreatorRest = function(ctx) {
  return this.visitChildren(ctx);
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
  return this.visitChildren(ctx);
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
  return this.visitChildren(ctx);
};


module.exports = ApexAstBuilder;
