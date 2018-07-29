// Generated from lib/apex.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by apexParser.
function apexListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

apexListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
apexListener.prototype.constructor = apexListener;

// Enter a parse tree produced by apexParser#compilationUnit.
apexListener.prototype.enterCompilationUnit = function(ctx) {
};

// Exit a parse tree produced by apexParser#compilationUnit.
apexListener.prototype.exitCompilationUnit = function(ctx) {
};


// Enter a parse tree produced by apexParser#typeDeclaration.
apexListener.prototype.enterTypeDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#typeDeclaration.
apexListener.prototype.exitTypeDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#triggerDeclaration.
apexListener.prototype.enterTriggerDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#triggerDeclaration.
apexListener.prototype.exitTriggerDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#triggerTimings.
apexListener.prototype.enterTriggerTimings = function(ctx) {
};

// Exit a parse tree produced by apexParser#triggerTimings.
apexListener.prototype.exitTriggerTimings = function(ctx) {
};


// Enter a parse tree produced by apexParser#triggerTiming.
apexListener.prototype.enterTriggerTiming = function(ctx) {
};

// Exit a parse tree produced by apexParser#triggerTiming.
apexListener.prototype.exitTriggerTiming = function(ctx) {
};


// Enter a parse tree produced by apexParser#modifier.
apexListener.prototype.enterModifier = function(ctx) {
};

// Exit a parse tree produced by apexParser#modifier.
apexListener.prototype.exitModifier = function(ctx) {
};


// Enter a parse tree produced by apexParser#classOrInterfaceModifier.
apexListener.prototype.enterClassOrInterfaceModifier = function(ctx) {
};

// Exit a parse tree produced by apexParser#classOrInterfaceModifier.
apexListener.prototype.exitClassOrInterfaceModifier = function(ctx) {
};


// Enter a parse tree produced by apexParser#variableModifier.
apexListener.prototype.enterVariableModifier = function(ctx) {
};

// Exit a parse tree produced by apexParser#variableModifier.
apexListener.prototype.exitVariableModifier = function(ctx) {
};


// Enter a parse tree produced by apexParser#classDeclaration.
apexListener.prototype.enterClassDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#classDeclaration.
apexListener.prototype.exitClassDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#enumDeclaration.
apexListener.prototype.enterEnumDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#enumDeclaration.
apexListener.prototype.exitEnumDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#enumConstants.
apexListener.prototype.enterEnumConstants = function(ctx) {
};

// Exit a parse tree produced by apexParser#enumConstants.
apexListener.prototype.exitEnumConstants = function(ctx) {
};


// Enter a parse tree produced by apexParser#enumConstant.
apexListener.prototype.enterEnumConstant = function(ctx) {
};

// Exit a parse tree produced by apexParser#enumConstant.
apexListener.prototype.exitEnumConstant = function(ctx) {
};


// Enter a parse tree produced by apexParser#enumBodyDeclarations.
apexListener.prototype.enterEnumBodyDeclarations = function(ctx) {
};

// Exit a parse tree produced by apexParser#enumBodyDeclarations.
apexListener.prototype.exitEnumBodyDeclarations = function(ctx) {
};


// Enter a parse tree produced by apexParser#interfaceDeclaration.
apexListener.prototype.enterInterfaceDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#interfaceDeclaration.
apexListener.prototype.exitInterfaceDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#typeList.
apexListener.prototype.enterTypeList = function(ctx) {
};

// Exit a parse tree produced by apexParser#typeList.
apexListener.prototype.exitTypeList = function(ctx) {
};


// Enter a parse tree produced by apexParser#classBody.
apexListener.prototype.enterClassBody = function(ctx) {
};

// Exit a parse tree produced by apexParser#classBody.
apexListener.prototype.exitClassBody = function(ctx) {
};


// Enter a parse tree produced by apexParser#interfaceBody.
apexListener.prototype.enterInterfaceBody = function(ctx) {
};

// Exit a parse tree produced by apexParser#interfaceBody.
apexListener.prototype.exitInterfaceBody = function(ctx) {
};


// Enter a parse tree produced by apexParser#classBodyDeclaration.
apexListener.prototype.enterClassBodyDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#classBodyDeclaration.
apexListener.prototype.exitClassBodyDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#memberDeclaration.
apexListener.prototype.enterMemberDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#memberDeclaration.
apexListener.prototype.exitMemberDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#methodDeclaration.
apexListener.prototype.enterMethodDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#methodDeclaration.
apexListener.prototype.exitMethodDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#constructorDeclaration.
apexListener.prototype.enterConstructorDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#constructorDeclaration.
apexListener.prototype.exitConstructorDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#fieldDeclaration.
apexListener.prototype.enterFieldDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#fieldDeclaration.
apexListener.prototype.exitFieldDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#propertyDeclaration.
apexListener.prototype.enterPropertyDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#propertyDeclaration.
apexListener.prototype.exitPropertyDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#propertyBodyDeclaration.
apexListener.prototype.enterPropertyBodyDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#propertyBodyDeclaration.
apexListener.prototype.exitPropertyBodyDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#interfaceBodyDeclaration.
apexListener.prototype.enterInterfaceBodyDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#interfaceBodyDeclaration.
apexListener.prototype.exitInterfaceBodyDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#interfaceMemberDeclaration.
apexListener.prototype.enterInterfaceMemberDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#interfaceMemberDeclaration.
apexListener.prototype.exitInterfaceMemberDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#constDeclaration.
apexListener.prototype.enterConstDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#constDeclaration.
apexListener.prototype.exitConstDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#constantDeclarator.
apexListener.prototype.enterConstantDeclarator = function(ctx) {
};

// Exit a parse tree produced by apexParser#constantDeclarator.
apexListener.prototype.exitConstantDeclarator = function(ctx) {
};


// Enter a parse tree produced by apexParser#interfaceMethodDeclaration.
apexListener.prototype.enterInterfaceMethodDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#interfaceMethodDeclaration.
apexListener.prototype.exitInterfaceMethodDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#variableDeclarators.
apexListener.prototype.enterVariableDeclarators = function(ctx) {
};

// Exit a parse tree produced by apexParser#variableDeclarators.
apexListener.prototype.exitVariableDeclarators = function(ctx) {
};


// Enter a parse tree produced by apexParser#variableDeclarator.
apexListener.prototype.enterVariableDeclarator = function(ctx) {
};

// Exit a parse tree produced by apexParser#variableDeclarator.
apexListener.prototype.exitVariableDeclarator = function(ctx) {
};


// Enter a parse tree produced by apexParser#variableDeclaratorId.
apexListener.prototype.enterVariableDeclaratorId = function(ctx) {
};

// Exit a parse tree produced by apexParser#variableDeclaratorId.
apexListener.prototype.exitVariableDeclaratorId = function(ctx) {
};


// Enter a parse tree produced by apexParser#variableInitializer.
apexListener.prototype.enterVariableInitializer = function(ctx) {
};

// Exit a parse tree produced by apexParser#variableInitializer.
apexListener.prototype.exitVariableInitializer = function(ctx) {
};


// Enter a parse tree produced by apexParser#arrayInitializer.
apexListener.prototype.enterArrayInitializer = function(ctx) {
};

// Exit a parse tree produced by apexParser#arrayInitializer.
apexListener.prototype.exitArrayInitializer = function(ctx) {
};


// Enter a parse tree produced by apexParser#enumConstantName.
apexListener.prototype.enterEnumConstantName = function(ctx) {
};

// Exit a parse tree produced by apexParser#enumConstantName.
apexListener.prototype.exitEnumConstantName = function(ctx) {
};


// Enter a parse tree produced by apexParser#type.
apexListener.prototype.enterType = function(ctx) {
};

// Exit a parse tree produced by apexParser#type.
apexListener.prototype.exitType = function(ctx) {
};


// Enter a parse tree produced by apexParser#typedArray.
apexListener.prototype.enterTypedArray = function(ctx) {
};

// Exit a parse tree produced by apexParser#typedArray.
apexListener.prototype.exitTypedArray = function(ctx) {
};


// Enter a parse tree produced by apexParser#classOrInterfaceType.
apexListener.prototype.enterClassOrInterfaceType = function(ctx) {
};

// Exit a parse tree produced by apexParser#classOrInterfaceType.
apexListener.prototype.exitClassOrInterfaceType = function(ctx) {
};


// Enter a parse tree produced by apexParser#primitiveType.
apexListener.prototype.enterPrimitiveType = function(ctx) {
};

// Exit a parse tree produced by apexParser#primitiveType.
apexListener.prototype.exitPrimitiveType = function(ctx) {
};


// Enter a parse tree produced by apexParser#typeArguments.
apexListener.prototype.enterTypeArguments = function(ctx) {
};

// Exit a parse tree produced by apexParser#typeArguments.
apexListener.prototype.exitTypeArguments = function(ctx) {
};


// Enter a parse tree produced by apexParser#typeArgument.
apexListener.prototype.enterTypeArgument = function(ctx) {
};

// Exit a parse tree produced by apexParser#typeArgument.
apexListener.prototype.exitTypeArgument = function(ctx) {
};


// Enter a parse tree produced by apexParser#qualifiedNameList.
apexListener.prototype.enterQualifiedNameList = function(ctx) {
};

// Exit a parse tree produced by apexParser#qualifiedNameList.
apexListener.prototype.exitQualifiedNameList = function(ctx) {
};


// Enter a parse tree produced by apexParser#formalParameters.
apexListener.prototype.enterFormalParameters = function(ctx) {
};

// Exit a parse tree produced by apexParser#formalParameters.
apexListener.prototype.exitFormalParameters = function(ctx) {
};


// Enter a parse tree produced by apexParser#formalParameterList.
apexListener.prototype.enterFormalParameterList = function(ctx) {
};

// Exit a parse tree produced by apexParser#formalParameterList.
apexListener.prototype.exitFormalParameterList = function(ctx) {
};


// Enter a parse tree produced by apexParser#formalParameter.
apexListener.prototype.enterFormalParameter = function(ctx) {
};

// Exit a parse tree produced by apexParser#formalParameter.
apexListener.prototype.exitFormalParameter = function(ctx) {
};


// Enter a parse tree produced by apexParser#lastFormalParameter.
apexListener.prototype.enterLastFormalParameter = function(ctx) {
};

// Exit a parse tree produced by apexParser#lastFormalParameter.
apexListener.prototype.exitLastFormalParameter = function(ctx) {
};


// Enter a parse tree produced by apexParser#methodBody.
apexListener.prototype.enterMethodBody = function(ctx) {
};

// Exit a parse tree produced by apexParser#methodBody.
apexListener.prototype.exitMethodBody = function(ctx) {
};


// Enter a parse tree produced by apexParser#constructorBody.
apexListener.prototype.enterConstructorBody = function(ctx) {
};

// Exit a parse tree produced by apexParser#constructorBody.
apexListener.prototype.exitConstructorBody = function(ctx) {
};


// Enter a parse tree produced by apexParser#qualifiedName.
apexListener.prototype.enterQualifiedName = function(ctx) {
};

// Exit a parse tree produced by apexParser#qualifiedName.
apexListener.prototype.exitQualifiedName = function(ctx) {
};


// Enter a parse tree produced by apexParser#literal.
apexListener.prototype.enterLiteral = function(ctx) {
};

// Exit a parse tree produced by apexParser#literal.
apexListener.prototype.exitLiteral = function(ctx) {
};


// Enter a parse tree produced by apexParser#annotation.
apexListener.prototype.enterAnnotation = function(ctx) {
};

// Exit a parse tree produced by apexParser#annotation.
apexListener.prototype.exitAnnotation = function(ctx) {
};


// Enter a parse tree produced by apexParser#annotationName.
apexListener.prototype.enterAnnotationName = function(ctx) {
};

// Exit a parse tree produced by apexParser#annotationName.
apexListener.prototype.exitAnnotationName = function(ctx) {
};


// Enter a parse tree produced by apexParser#elementValuePairs.
apexListener.prototype.enterElementValuePairs = function(ctx) {
};

// Exit a parse tree produced by apexParser#elementValuePairs.
apexListener.prototype.exitElementValuePairs = function(ctx) {
};


// Enter a parse tree produced by apexParser#elementValuePair.
apexListener.prototype.enterElementValuePair = function(ctx) {
};

// Exit a parse tree produced by apexParser#elementValuePair.
apexListener.prototype.exitElementValuePair = function(ctx) {
};


// Enter a parse tree produced by apexParser#elementValue.
apexListener.prototype.enterElementValue = function(ctx) {
};

// Exit a parse tree produced by apexParser#elementValue.
apexListener.prototype.exitElementValue = function(ctx) {
};


// Enter a parse tree produced by apexParser#elementValueArrayInitializer.
apexListener.prototype.enterElementValueArrayInitializer = function(ctx) {
};

// Exit a parse tree produced by apexParser#elementValueArrayInitializer.
apexListener.prototype.exitElementValueArrayInitializer = function(ctx) {
};


// Enter a parse tree produced by apexParser#block.
apexListener.prototype.enterBlock = function(ctx) {
};

// Exit a parse tree produced by apexParser#block.
apexListener.prototype.exitBlock = function(ctx) {
};


// Enter a parse tree produced by apexParser#blockStatement.
apexListener.prototype.enterBlockStatement = function(ctx) {
};

// Exit a parse tree produced by apexParser#blockStatement.
apexListener.prototype.exitBlockStatement = function(ctx) {
};


// Enter a parse tree produced by apexParser#specialComment.
apexListener.prototype.enterSpecialComment = function(ctx) {
};

// Exit a parse tree produced by apexParser#specialComment.
apexListener.prototype.exitSpecialComment = function(ctx) {
};


// Enter a parse tree produced by apexParser#localVariableDeclarationStatement.
apexListener.prototype.enterLocalVariableDeclarationStatement = function(ctx) {
};

// Exit a parse tree produced by apexParser#localVariableDeclarationStatement.
apexListener.prototype.exitLocalVariableDeclarationStatement = function(ctx) {
};


// Enter a parse tree produced by apexParser#localVariableDeclaration.
apexListener.prototype.enterLocalVariableDeclaration = function(ctx) {
};

// Exit a parse tree produced by apexParser#localVariableDeclaration.
apexListener.prototype.exitLocalVariableDeclaration = function(ctx) {
};


// Enter a parse tree produced by apexParser#statement.
apexListener.prototype.enterStatement = function(ctx) {
};

// Exit a parse tree produced by apexParser#statement.
apexListener.prototype.exitStatement = function(ctx) {
};


// Enter a parse tree produced by apexParser#propertyBlock.
apexListener.prototype.enterPropertyBlock = function(ctx) {
};

// Exit a parse tree produced by apexParser#propertyBlock.
apexListener.prototype.exitPropertyBlock = function(ctx) {
};


// Enter a parse tree produced by apexParser#getter.
apexListener.prototype.enterGetter = function(ctx) {
};

// Exit a parse tree produced by apexParser#getter.
apexListener.prototype.exitGetter = function(ctx) {
};


// Enter a parse tree produced by apexParser#setter.
apexListener.prototype.enterSetter = function(ctx) {
};

// Exit a parse tree produced by apexParser#setter.
apexListener.prototype.exitSetter = function(ctx) {
};


// Enter a parse tree produced by apexParser#catchClause.
apexListener.prototype.enterCatchClause = function(ctx) {
};

// Exit a parse tree produced by apexParser#catchClause.
apexListener.prototype.exitCatchClause = function(ctx) {
};


// Enter a parse tree produced by apexParser#catchType.
apexListener.prototype.enterCatchType = function(ctx) {
};

// Exit a parse tree produced by apexParser#catchType.
apexListener.prototype.exitCatchType = function(ctx) {
};


// Enter a parse tree produced by apexParser#finallyBlock.
apexListener.prototype.enterFinallyBlock = function(ctx) {
};

// Exit a parse tree produced by apexParser#finallyBlock.
apexListener.prototype.exitFinallyBlock = function(ctx) {
};


// Enter a parse tree produced by apexParser#whenStatements.
apexListener.prototype.enterWhenStatements = function(ctx) {
};

// Exit a parse tree produced by apexParser#whenStatements.
apexListener.prototype.exitWhenStatements = function(ctx) {
};


// Enter a parse tree produced by apexParser#whenStatement.
apexListener.prototype.enterWhenStatement = function(ctx) {
};

// Exit a parse tree produced by apexParser#whenStatement.
apexListener.prototype.exitWhenStatement = function(ctx) {
};


// Enter a parse tree produced by apexParser#whenExpression.
apexListener.prototype.enterWhenExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#whenExpression.
apexListener.prototype.exitWhenExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#forControl.
apexListener.prototype.enterForControl = function(ctx) {
};

// Exit a parse tree produced by apexParser#forControl.
apexListener.prototype.exitForControl = function(ctx) {
};


// Enter a parse tree produced by apexParser#forInit.
apexListener.prototype.enterForInit = function(ctx) {
};

// Exit a parse tree produced by apexParser#forInit.
apexListener.prototype.exitForInit = function(ctx) {
};


// Enter a parse tree produced by apexParser#enhancedForControl.
apexListener.prototype.enterEnhancedForControl = function(ctx) {
};

// Exit a parse tree produced by apexParser#enhancedForControl.
apexListener.prototype.exitEnhancedForControl = function(ctx) {
};


// Enter a parse tree produced by apexParser#forUpdate.
apexListener.prototype.enterForUpdate = function(ctx) {
};

// Exit a parse tree produced by apexParser#forUpdate.
apexListener.prototype.exitForUpdate = function(ctx) {
};


// Enter a parse tree produced by apexParser#parExpression.
apexListener.prototype.enterParExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#parExpression.
apexListener.prototype.exitParExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#expressionList.
apexListener.prototype.enterExpressionList = function(ctx) {
};

// Exit a parse tree produced by apexParser#expressionList.
apexListener.prototype.exitExpressionList = function(ctx) {
};


// Enter a parse tree produced by apexParser#statementExpression.
apexListener.prototype.enterStatementExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#statementExpression.
apexListener.prototype.exitStatementExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#constantExpression.
apexListener.prototype.enterConstantExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#constantExpression.
apexListener.prototype.exitConstantExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#apexDbExpressionShort.
apexListener.prototype.enterApexDbExpressionShort = function(ctx) {
};

// Exit a parse tree produced by apexParser#apexDbExpressionShort.
apexListener.prototype.exitApexDbExpressionShort = function(ctx) {
};


// Enter a parse tree produced by apexParser#apexDbExpression.
apexListener.prototype.enterApexDbExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#apexDbExpression.
apexListener.prototype.exitApexDbExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#TernalyExpression.
apexListener.prototype.enterTernalyExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#TernalyExpression.
apexListener.prototype.exitTernalyExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#PreUnaryExpression.
apexListener.prototype.enterPreUnaryExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#PreUnaryExpression.
apexListener.prototype.exitPreUnaryExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#ArrayAccess.
apexListener.prototype.enterArrayAccess = function(ctx) {
};

// Exit a parse tree produced by apexParser#ArrayAccess.
apexListener.prototype.exitArrayAccess = function(ctx) {
};


// Enter a parse tree produced by apexParser#PostUnaryExpression.
apexListener.prototype.enterPostUnaryExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#PostUnaryExpression.
apexListener.prototype.exitPostUnaryExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#PrimaryExpression.
apexListener.prototype.enterPrimaryExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#PrimaryExpression.
apexListener.prototype.exitPrimaryExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#OpExpression.
apexListener.prototype.enterOpExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#OpExpression.
apexListener.prototype.exitOpExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#NewExpression.
apexListener.prototype.enterNewExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#NewExpression.
apexListener.prototype.exitNewExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#UnaryExpression.
apexListener.prototype.enterUnaryExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#UnaryExpression.
apexListener.prototype.exitUnaryExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#MethodInvocation.
apexListener.prototype.enterMethodInvocation = function(ctx) {
};

// Exit a parse tree produced by apexParser#MethodInvocation.
apexListener.prototype.exitMethodInvocation = function(ctx) {
};


// Enter a parse tree produced by apexParser#CastExpression.
apexListener.prototype.enterCastExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#CastExpression.
apexListener.prototype.exitCastExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#ShiftExpression.
apexListener.prototype.enterShiftExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#ShiftExpression.
apexListener.prototype.exitShiftExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#FieldAccess.
apexListener.prototype.enterFieldAccess = function(ctx) {
};

// Exit a parse tree produced by apexParser#FieldAccess.
apexListener.prototype.exitFieldAccess = function(ctx) {
};


// Enter a parse tree produced by apexParser#primary.
apexListener.prototype.enterPrimary = function(ctx) {
};

// Exit a parse tree produced by apexParser#primary.
apexListener.prototype.exitPrimary = function(ctx) {
};


// Enter a parse tree produced by apexParser#creator.
apexListener.prototype.enterCreator = function(ctx) {
};

// Exit a parse tree produced by apexParser#creator.
apexListener.prototype.exitCreator = function(ctx) {
};


// Enter a parse tree produced by apexParser#createdName.
apexListener.prototype.enterCreatedName = function(ctx) {
};

// Exit a parse tree produced by apexParser#createdName.
apexListener.prototype.exitCreatedName = function(ctx) {
};


// Enter a parse tree produced by apexParser#innerCreator.
apexListener.prototype.enterInnerCreator = function(ctx) {
};

// Exit a parse tree produced by apexParser#innerCreator.
apexListener.prototype.exitInnerCreator = function(ctx) {
};


// Enter a parse tree produced by apexParser#arrayCreatorRest.
apexListener.prototype.enterArrayCreatorRest = function(ctx) {
};

// Exit a parse tree produced by apexParser#arrayCreatorRest.
apexListener.prototype.exitArrayCreatorRest = function(ctx) {
};


// Enter a parse tree produced by apexParser#mapCreatorRest.
apexListener.prototype.enterMapCreatorRest = function(ctx) {
};

// Exit a parse tree produced by apexParser#mapCreatorRest.
apexListener.prototype.exitMapCreatorRest = function(ctx) {
};


// Enter a parse tree produced by apexParser#setCreatorRest.
apexListener.prototype.enterSetCreatorRest = function(ctx) {
};

// Exit a parse tree produced by apexParser#setCreatorRest.
apexListener.prototype.exitSetCreatorRest = function(ctx) {
};


// Enter a parse tree produced by apexParser#classCreatorRest.
apexListener.prototype.enterClassCreatorRest = function(ctx) {
};

// Exit a parse tree produced by apexParser#classCreatorRest.
apexListener.prototype.exitClassCreatorRest = function(ctx) {
};


// Enter a parse tree produced by apexParser#explicitGenericInvocation.
apexListener.prototype.enterExplicitGenericInvocation = function(ctx) {
};

// Exit a parse tree produced by apexParser#explicitGenericInvocation.
apexListener.prototype.exitExplicitGenericInvocation = function(ctx) {
};


// Enter a parse tree produced by apexParser#nonWildcardTypeArguments.
apexListener.prototype.enterNonWildcardTypeArguments = function(ctx) {
};

// Exit a parse tree produced by apexParser#nonWildcardTypeArguments.
apexListener.prototype.exitNonWildcardTypeArguments = function(ctx) {
};


// Enter a parse tree produced by apexParser#typeArgumentsOrDiamond.
apexListener.prototype.enterTypeArgumentsOrDiamond = function(ctx) {
};

// Exit a parse tree produced by apexParser#typeArgumentsOrDiamond.
apexListener.prototype.exitTypeArgumentsOrDiamond = function(ctx) {
};


// Enter a parse tree produced by apexParser#nonWildcardTypeArgumentsOrDiamond.
apexListener.prototype.enterNonWildcardTypeArgumentsOrDiamond = function(ctx) {
};

// Exit a parse tree produced by apexParser#nonWildcardTypeArgumentsOrDiamond.
apexListener.prototype.exitNonWildcardTypeArgumentsOrDiamond = function(ctx) {
};


// Enter a parse tree produced by apexParser#superSuffix.
apexListener.prototype.enterSuperSuffix = function(ctx) {
};

// Exit a parse tree produced by apexParser#superSuffix.
apexListener.prototype.exitSuperSuffix = function(ctx) {
};


// Enter a parse tree produced by apexParser#explicitGenericInvocationSuffix.
apexListener.prototype.enterExplicitGenericInvocationSuffix = function(ctx) {
};

// Exit a parse tree produced by apexParser#explicitGenericInvocationSuffix.
apexListener.prototype.exitExplicitGenericInvocationSuffix = function(ctx) {
};


// Enter a parse tree produced by apexParser#arguments.
apexListener.prototype.enterArguments = function(ctx) {
};

// Exit a parse tree produced by apexParser#arguments.
apexListener.prototype.exitArguments = function(ctx) {
};


// Enter a parse tree produced by apexParser#accessor.
apexListener.prototype.enterAccessor = function(ctx) {
};

// Exit a parse tree produced by apexParser#accessor.
apexListener.prototype.exitAccessor = function(ctx) {
};


// Enter a parse tree produced by apexParser#soqlLiteral.
apexListener.prototype.enterSoqlLiteral = function(ctx) {
};

// Exit a parse tree produced by apexParser#soqlLiteral.
apexListener.prototype.exitSoqlLiteral = function(ctx) {
};


// Enter a parse tree produced by apexParser#query.
apexListener.prototype.enterQuery = function(ctx) {
};

// Exit a parse tree produced by apexParser#query.
apexListener.prototype.exitQuery = function(ctx) {
};


// Enter a parse tree produced by apexParser#selectClause.
apexListener.prototype.enterSelectClause = function(ctx) {
};

// Exit a parse tree produced by apexParser#selectClause.
apexListener.prototype.exitSelectClause = function(ctx) {
};


// Enter a parse tree produced by apexParser#fieldList.
apexListener.prototype.enterFieldList = function(ctx) {
};

// Exit a parse tree produced by apexParser#fieldList.
apexListener.prototype.exitFieldList = function(ctx) {
};


// Enter a parse tree produced by apexParser#selectField.
apexListener.prototype.enterSelectField = function(ctx) {
};

// Exit a parse tree produced by apexParser#selectField.
apexListener.prototype.exitSelectField = function(ctx) {
};


// Enter a parse tree produced by apexParser#fromClause.
apexListener.prototype.enterFromClause = function(ctx) {
};

// Exit a parse tree produced by apexParser#fromClause.
apexListener.prototype.exitFromClause = function(ctx) {
};


// Enter a parse tree produced by apexParser#filterScope.
apexListener.prototype.enterFilterScope = function(ctx) {
};

// Exit a parse tree produced by apexParser#filterScope.
apexListener.prototype.exitFilterScope = function(ctx) {
};


// Enter a parse tree produced by apexParser#SoqlFieldReference.
apexListener.prototype.enterSoqlFieldReference = function(ctx) {
};

// Exit a parse tree produced by apexParser#SoqlFieldReference.
apexListener.prototype.exitSoqlFieldReference = function(ctx) {
};


// Enter a parse tree produced by apexParser#SoqlFunctionCall.
apexListener.prototype.enterSoqlFunctionCall = function(ctx) {
};

// Exit a parse tree produced by apexParser#SoqlFunctionCall.
apexListener.prototype.exitSoqlFunctionCall = function(ctx) {
};


// Enter a parse tree produced by apexParser#subquery.
apexListener.prototype.enterSubquery = function(ctx) {
};

// Exit a parse tree produced by apexParser#subquery.
apexListener.prototype.exitSubquery = function(ctx) {
};


// Enter a parse tree produced by apexParser#whereClause.
apexListener.prototype.enterWhereClause = function(ctx) {
};

// Exit a parse tree produced by apexParser#whereClause.
apexListener.prototype.exitWhereClause = function(ctx) {
};


// Enter a parse tree produced by apexParser#whereField.
apexListener.prototype.enterWhereField = function(ctx) {
};

// Exit a parse tree produced by apexParser#whereField.
apexListener.prototype.exitWhereField = function(ctx) {
};


// Enter a parse tree produced by apexParser#limitClause.
apexListener.prototype.enterLimitClause = function(ctx) {
};

// Exit a parse tree produced by apexParser#limitClause.
apexListener.prototype.exitLimitClause = function(ctx) {
};


// Enter a parse tree produced by apexParser#orderClause.
apexListener.prototype.enterOrderClause = function(ctx) {
};

// Exit a parse tree produced by apexParser#orderClause.
apexListener.prototype.exitOrderClause = function(ctx) {
};


// Enter a parse tree produced by apexParser#bindVariable.
apexListener.prototype.enterBindVariable = function(ctx) {
};

// Exit a parse tree produced by apexParser#bindVariable.
apexListener.prototype.exitBindVariable = function(ctx) {
};


// Enter a parse tree produced by apexParser#soqlValue.
apexListener.prototype.enterSoqlValue = function(ctx) {
};

// Exit a parse tree produced by apexParser#soqlValue.
apexListener.prototype.exitSoqlValue = function(ctx) {
};


// Enter a parse tree produced by apexParser#withClause.
apexListener.prototype.enterWithClause = function(ctx) {
};

// Exit a parse tree produced by apexParser#withClause.
apexListener.prototype.exitWithClause = function(ctx) {
};


// Enter a parse tree produced by apexParser#soqlFilteringExpression.
apexListener.prototype.enterSoqlFilteringExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#soqlFilteringExpression.
apexListener.prototype.exitSoqlFilteringExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#groupClause.
apexListener.prototype.enterGroupClause = function(ctx) {
};

// Exit a parse tree produced by apexParser#groupClause.
apexListener.prototype.exitGroupClause = function(ctx) {
};


// Enter a parse tree produced by apexParser#fieldGroupList.
apexListener.prototype.enterFieldGroupList = function(ctx) {
};

// Exit a parse tree produced by apexParser#fieldGroupList.
apexListener.prototype.exitFieldGroupList = function(ctx) {
};


// Enter a parse tree produced by apexParser#havingConditionExpression.
apexListener.prototype.enterHavingConditionExpression = function(ctx) {
};

// Exit a parse tree produced by apexParser#havingConditionExpression.
apexListener.prototype.exitHavingConditionExpression = function(ctx) {
};


// Enter a parse tree produced by apexParser#offsetClause.
apexListener.prototype.enterOffsetClause = function(ctx) {
};

// Exit a parse tree produced by apexParser#offsetClause.
apexListener.prototype.exitOffsetClause = function(ctx) {
};


// Enter a parse tree produced by apexParser#viewClause.
apexListener.prototype.enterViewClause = function(ctx) {
};

// Exit a parse tree produced by apexParser#viewClause.
apexListener.prototype.exitViewClause = function(ctx) {
};



exports.apexListener = apexListener;