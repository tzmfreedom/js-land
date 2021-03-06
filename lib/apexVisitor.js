// Generated from lib/apex.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index')

// This class defines a complete generic visitor for a parse tree produced by apexParser.

function apexVisitor () {
  antlr4.tree.ParseTreeVisitor.call(this)
  return this
}

apexVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype)
apexVisitor.prototype.constructor = apexVisitor

// Visit a parse tree produced by apexParser#compilationUnit.
apexVisitor.prototype.visitCompilationUnit = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#typeDeclaration.
apexVisitor.prototype.visitTypeDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#triggerDeclaration.
apexVisitor.prototype.visitTriggerDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#triggerTimings.
apexVisitor.prototype.visitTriggerTimings = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#triggerTiming.
apexVisitor.prototype.visitTriggerTiming = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#modifier.
apexVisitor.prototype.visitModifier = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#classOrInterfaceModifier.
apexVisitor.prototype.visitClassOrInterfaceModifier = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#variableModifier.
apexVisitor.prototype.visitVariableModifier = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#classDeclaration.
apexVisitor.prototype.visitClassDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#enumDeclaration.
apexVisitor.prototype.visitEnumDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#enumConstants.
apexVisitor.prototype.visitEnumConstants = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#enumConstant.
apexVisitor.prototype.visitEnumConstant = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#enumBodyDeclarations.
apexVisitor.prototype.visitEnumBodyDeclarations = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#interfaceDeclaration.
apexVisitor.prototype.visitInterfaceDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#typeList.
apexVisitor.prototype.visitTypeList = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#classBody.
apexVisitor.prototype.visitClassBody = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#interfaceBody.
apexVisitor.prototype.visitInterfaceBody = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#classBodyDeclaration.
apexVisitor.prototype.visitClassBodyDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#memberDeclaration.
apexVisitor.prototype.visitMemberDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#methodDeclaration.
apexVisitor.prototype.visitMethodDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#constructorDeclaration.
apexVisitor.prototype.visitConstructorDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#fieldDeclaration.
apexVisitor.prototype.visitFieldDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#propertyDeclaration.
apexVisitor.prototype.visitPropertyDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#propertyBodyDeclaration.
apexVisitor.prototype.visitPropertyBodyDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#interfaceBodyDeclaration.
apexVisitor.prototype.visitInterfaceBodyDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#interfaceMemberDeclaration.
apexVisitor.prototype.visitInterfaceMemberDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#constDeclaration.
apexVisitor.prototype.visitConstDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#constantDeclarator.
apexVisitor.prototype.visitConstantDeclarator = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#interfaceMethodDeclaration.
apexVisitor.prototype.visitInterfaceMethodDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#variableDeclarators.
apexVisitor.prototype.visitVariableDeclarators = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#variableDeclarator.
apexVisitor.prototype.visitVariableDeclarator = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#variableDeclaratorId.
apexVisitor.prototype.visitVariableDeclaratorId = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#variableInitializer.
apexVisitor.prototype.visitVariableInitializer = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#arrayInitializer.
apexVisitor.prototype.visitArrayInitializer = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#enumConstantName.
apexVisitor.prototype.visitEnumConstantName = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#type.
apexVisitor.prototype.visitType = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#typedArray.
apexVisitor.prototype.visitTypedArray = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#classOrInterfaceType.
apexVisitor.prototype.visitClassOrInterfaceType = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#primitiveType.
apexVisitor.prototype.visitPrimitiveType = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#typeArguments.
apexVisitor.prototype.visitTypeArguments = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#typeArgument.
apexVisitor.prototype.visitTypeArgument = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#qualifiedNameList.
apexVisitor.prototype.visitQualifiedNameList = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#formalParameters.
apexVisitor.prototype.visitFormalParameters = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#formalParameterList.
apexVisitor.prototype.visitFormalParameterList = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#formalParameter.
apexVisitor.prototype.visitFormalParameter = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#lastFormalParameter.
apexVisitor.prototype.visitLastFormalParameter = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#methodBody.
apexVisitor.prototype.visitMethodBody = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#constructorBody.
apexVisitor.prototype.visitConstructorBody = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#qualifiedName.
apexVisitor.prototype.visitQualifiedName = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#literal.
apexVisitor.prototype.visitLiteral = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#annotation.
apexVisitor.prototype.visitAnnotation = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#annotationName.
apexVisitor.prototype.visitAnnotationName = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#elementValuePairs.
apexVisitor.prototype.visitElementValuePairs = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#elementValuePair.
apexVisitor.prototype.visitElementValuePair = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#elementValue.
apexVisitor.prototype.visitElementValue = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#elementValueArrayInitializer.
apexVisitor.prototype.visitElementValueArrayInitializer = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#block.
apexVisitor.prototype.visitBlock = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#blockStatement.
apexVisitor.prototype.visitBlockStatement = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#localVariableDeclarationStatement.
apexVisitor.prototype.visitLocalVariableDeclarationStatement = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#localVariableDeclaration.
apexVisitor.prototype.visitLocalVariableDeclaration = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#statement.
apexVisitor.prototype.visitStatement = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#propertyBlock.
apexVisitor.prototype.visitPropertyBlock = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#getter.
apexVisitor.prototype.visitGetter = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#setter.
apexVisitor.prototype.visitSetter = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#catchClause.
apexVisitor.prototype.visitCatchClause = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#catchType.
apexVisitor.prototype.visitCatchType = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#finallyBlock.
apexVisitor.prototype.visitFinallyBlock = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#whenStatements.
apexVisitor.prototype.visitWhenStatements = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#whenStatement.
apexVisitor.prototype.visitWhenStatement = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#whenExpression.
apexVisitor.prototype.visitWhenExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#forControl.
apexVisitor.prototype.visitForControl = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#forInit.
apexVisitor.prototype.visitForInit = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#enhancedForControl.
apexVisitor.prototype.visitEnhancedForControl = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#forUpdate.
apexVisitor.prototype.visitForUpdate = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#parExpression.
apexVisitor.prototype.visitParExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#expressionList.
apexVisitor.prototype.visitExpressionList = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#statementExpression.
apexVisitor.prototype.visitStatementExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#constantExpression.
apexVisitor.prototype.visitConstantExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#apexDbExpressionShort.
apexVisitor.prototype.visitApexDbExpressionShort = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#apexDbExpression.
apexVisitor.prototype.visitApexDbExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#TernalyExpression.
apexVisitor.prototype.visitTernalyExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#PreUnaryExpression.
apexVisitor.prototype.visitPreUnaryExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#ArrayAccess.
apexVisitor.prototype.visitArrayAccess = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#PostUnaryExpression.
apexVisitor.prototype.visitPostUnaryExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#PrimaryExpression.
apexVisitor.prototype.visitPrimaryExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#OpExpression.
apexVisitor.prototype.visitOpExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#NewExpression.
apexVisitor.prototype.visitNewExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#UnaryExpression.
apexVisitor.prototype.visitUnaryExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#MethodInvocation.
apexVisitor.prototype.visitMethodInvocation = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#CastExpression.
apexVisitor.prototype.visitCastExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#ShiftExpression.
apexVisitor.prototype.visitShiftExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#FieldAccess.
apexVisitor.prototype.visitFieldAccess = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#primary.
apexVisitor.prototype.visitPrimary = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#creator.
apexVisitor.prototype.visitCreator = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#createdName.
apexVisitor.prototype.visitCreatedName = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#innerCreator.
apexVisitor.prototype.visitInnerCreator = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#arrayCreatorRest.
apexVisitor.prototype.visitArrayCreatorRest = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#mapCreatorRest.
apexVisitor.prototype.visitMapCreatorRest = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#setCreatorRest.
apexVisitor.prototype.visitSetCreatorRest = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#classCreatorRest.
apexVisitor.prototype.visitClassCreatorRest = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#explicitGenericInvocation.
apexVisitor.prototype.visitExplicitGenericInvocation = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#nonWildcardTypeArguments.
apexVisitor.prototype.visitNonWildcardTypeArguments = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#typeArgumentsOrDiamond.
apexVisitor.prototype.visitTypeArgumentsOrDiamond = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#nonWildcardTypeArgumentsOrDiamond.
apexVisitor.prototype.visitNonWildcardTypeArgumentsOrDiamond = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#superSuffix.
apexVisitor.prototype.visitSuperSuffix = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#explicitGenericInvocationSuffix.
apexVisitor.prototype.visitExplicitGenericInvocationSuffix = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#arguments.
apexVisitor.prototype.visitArguments = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#soqlLiteral.
apexVisitor.prototype.visitSoqlLiteral = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#query.
apexVisitor.prototype.visitQuery = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#selectClause.
apexVisitor.prototype.visitSelectClause = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#fieldList.
apexVisitor.prototype.visitFieldList = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#selectField.
apexVisitor.prototype.visitSelectField = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#fromClause.
apexVisitor.prototype.visitFromClause = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#filterScope.
apexVisitor.prototype.visitFilterScope = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#SoqlFieldReference.
apexVisitor.prototype.visitSoqlFieldReference = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#SoqlFunctionCall.
apexVisitor.prototype.visitSoqlFunctionCall = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#subquery.
apexVisitor.prototype.visitSubquery = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#whereClause.
apexVisitor.prototype.visitWhereClause = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#whereFields.
apexVisitor.prototype.visitWhereFields = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#whereField.
apexVisitor.prototype.visitWhereField = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#limitClause.
apexVisitor.prototype.visitLimitClause = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#orderClause.
apexVisitor.prototype.visitOrderClause = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#bindVariable.
apexVisitor.prototype.visitBindVariable = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#soqlValue.
apexVisitor.prototype.visitSoqlValue = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#withClause.
apexVisitor.prototype.visitWithClause = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#soqlFilteringExpression.
apexVisitor.prototype.visitSoqlFilteringExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#groupClause.
apexVisitor.prototype.visitGroupClause = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#fieldGroupList.
apexVisitor.prototype.visitFieldGroupList = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#havingConditionExpression.
apexVisitor.prototype.visitHavingConditionExpression = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#offsetClause.
apexVisitor.prototype.visitOffsetClause = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#viewClause.
apexVisitor.prototype.visitViewClause = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#soslLiteral.
apexVisitor.prototype.visitSoslLiteral = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#soslQuery.
apexVisitor.prototype.visitSoslQuery = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#soslReturningObject.
apexVisitor.prototype.visitSoslReturningObject = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#apexIdentifier.
apexVisitor.prototype.visitApexIdentifier = function (ctx) {
  return this.visitChildren(ctx)
}

// Visit a parse tree produced by apexParser#typeIdentifier.
apexVisitor.prototype.visitTypeIdentifier = function (ctx) {
  return this.visitChildren(ctx)
}

exports.apexVisitor = apexVisitor
