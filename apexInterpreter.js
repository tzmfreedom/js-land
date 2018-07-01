// Generated from apex.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var Apex = require('./apexClass');
var ApexVisitor = require('./apexVisitor');
var LocalEnvironment = require('./localEnv');

let apexInterpreter = function() {
    ApexVisitor.apexVisitor.call(this); // inherit default listener
    return this;
};
apexInterpreter.prototype = Object.create(ApexVisitor.apexVisitor.prototype);

// Visit a parse tree produced by apexParser#compilationUnit.
apexInterpreter.prototype.visitCompilationUnit = function(ctx) {
    return ctx.typeDeclaration().accept(this);
};


// Visit a parse tree produced by apexParser#typeDeclaration.
apexInterpreter.prototype.visitTypeDeclaration = function(ctx) {
    let classDecl = ctx.classDeclaration().accept(this);
    classDecl.modifier = ctx.classOrInterfaceModifier().map((modifier) => {
        return modifier.accept(this)
    });
    return classDecl;
};


// Visit a parse tree produced by apexParser#modifier.
apexInterpreter.prototype.visitModifier = function(ctx) {
    if (ctx.classOrInterfaceModifier()) {
        return ctx.classOrInterfaceModifier().accept(this);
    }
    return ctx.getText();
};


// Visit a parse tree produced by apexParser#classOrInterfaceModifier.
apexInterpreter.prototype.visitClassOrInterfaceModifier = function(ctx) {
    if (ctx.annotation()) {
        return ctx.annotation().accept(this);
    }
    return ctx.getText();
};


// Visit a parse tree produced by apexParser#variableModifier.
apexInterpreter.prototype.visitVariableModifier = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#classDeclaration.
apexInterpreter.prototype.visitClassDeclaration = function(ctx) {
    let className = ctx.Identifier().getText();
    let superClass = ctx.type().getText();
    let implementClasses = [];
    if (ctx.typeList()) {
        implementClasses = ctx.typeList().map((type) => { return type.getText() });
    }
    let declarations = ctx.classBody().accept(this);
    let apexClass = new Apex.ApexClass(
        className,
        superClass,
        implementClasses,
        declarations.instanceFields,
        declarations.staticFields,
        declarations.instanceMethods,
        declarations.staticMethods
    );
    Apex.ApexClassStore.register(className, apexClass);

    return apexClass;
};


// Visit a parse tree produced by apexParser#typeParameters.
apexInterpreter.prototype.visitTypeParameters = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeParameter.
apexInterpreter.prototype.visitTypeParameter = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeBound.
apexInterpreter.prototype.visitTypeBound = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enumDeclaration.
apexInterpreter.prototype.visitEnumDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enumConstants.
apexInterpreter.prototype.visitEnumConstants = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enumConstant.
apexInterpreter.prototype.visitEnumConstant = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enumBodyDeclarations.
apexInterpreter.prototype.visitEnumBodyDeclarations = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#interfaceDeclaration.
apexInterpreter.prototype.visitInterfaceDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeList.
apexInterpreter.prototype.visitTypeList = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#classBody.
apexInterpreter.prototype.visitClassBody = function(ctx) {
    let properties = {
        instanceFields: {},
        staticFields: {},
        instanceMethods: {},
        staticMethods: {},
    };
    ctx.classBodyDeclaration().forEach((declaration) => {
        let decl = declaration.accept(this);
        if (decl instanceof Apex.ApexMethod) {
            if (decl.modifiers.includes('static')) {
                properties.staticMethods[decl.identifier] = decl;
            } else {
                properties.instanceMethods[decl.identifier] = decl;
            }
        } else if (decl instanceof Apex.InstanceFieldDeclaration) {
            if (decl.modifiers.includes('static')) {
                decl.declarators.forEach((declarator) => {
                    declarator.type = decl.type;
                    properties.staticFields[declarator.identifier] = declarator;
                });
            } else {
                decl.declarators.forEach((declarator) => {
                    declarator.type = decl.type;
                    properties.instanceFields[declarator.identifier] = declarator;
                });
            }
        }
    });
    return properties;
};


// Visit a parse tree produced by apexParser#interfaceBody.
apexInterpreter.prototype.visitInterfaceBody = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#classBodyDeclaration.
apexInterpreter.prototype.visitClassBodyDeclaration = function(ctx) {
    let declaration = ctx.memberDeclaration();
    let decl = declaration.accept(this);
    decl.modifiers = ctx.modifier().map((modifier) => { return modifier.accept(this) });
    return decl;
};


// Visit a parse tree produced by apexParser#memberDeclaration.
apexInterpreter.prototype.visitMemberDeclaration = function(ctx) {
    return this.visitChildren(ctx)[0];
};


// Visit a parse tree produced by apexParser#methodDeclaration.
apexInterpreter.prototype.visitMethodDeclaration = function(ctx) {
    let methodName = ctx.Identifier();
    let parameters = ctx.formalParameters();
    let throws = ctx.qualifiedNameList();
    let statements = ctx.methodBody().accept(this);

    return new Apex.ApexMethod(methodName, parameters, throws, statements);
};


// Visit a parse tree produced by apexParser#genericMethodDeclaration.
apexInterpreter.prototype.visitGenericMethodDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#constructorDeclaration.
apexInterpreter.prototype.visitConstructorDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#genericConstructorDeclaration.
apexInterpreter.prototype.visitGenericConstructorDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#fieldDeclaration.
apexInterpreter.prototype.visitFieldDeclaration = function(ctx) {
    let type = ctx.type().accept(this);
    let declarators = ctx.variableDeclarators().accept(this);
    return new Apex.InstanceFieldDeclaration(type, declarators);
};


// Visit a parse tree produced by apexParser#propertyDeclaration.
apexInterpreter.prototype.visitPropertyDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#propertyBodyDeclaration.
apexInterpreter.prototype.visitPropertyBodyDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#interfaceBodyDeclaration.
apexInterpreter.prototype.visitInterfaceBodyDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#interfaceMemberDeclaration.
apexInterpreter.prototype.visitInterfaceMemberDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#constDeclaration.
apexInterpreter.prototype.visitConstDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#constantDeclarator.
apexInterpreter.prototype.visitConstantDeclarator = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#interfaceMethodDeclaration.
apexInterpreter.prototype.visitInterfaceMethodDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#genericInterfaceMethodDeclaration.
apexInterpreter.prototype.visitGenericInterfaceMethodDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#variableDeclarators.
apexInterpreter.prototype.visitVariableDeclarators = function(ctx) {
    return ctx.variableDeclarator().map((declarator) => {
        return declarator.accept(this);
    });
};


// Visit a parse tree produced by apexParser#variableDeclarator.
apexInterpreter.prototype.visitVariableDeclarator = function(ctx) {
    let declaratorId = ctx.variableDeclaratorId().getText();
    let expression = ctx.variableInitializer();

    return new Apex.InstanceFieldDeclarator(declaratorId, expression);
};


// Visit a parse tree produced by apexParser#variableDeclaratorId.
apexInterpreter.prototype.visitVariableDeclaratorId = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#variableInitializer.
apexInterpreter.prototype.visitVariableInitializer = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#arrayInitializer.
apexInterpreter.prototype.visitArrayInitializer = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enumConstantName.
apexInterpreter.prototype.visitEnumConstantName = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#type.
apexInterpreter.prototype.visitType = function(ctx) {
    return ctx.getText();
};


// Visit a parse tree produced by apexParser#classOrInterfaceType.
apexInterpreter.prototype.visitClassOrInterfaceType = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#primitiveType.
apexInterpreter.prototype.visitPrimitiveType = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeArguments.
apexInterpreter.prototype.visitTypeArguments = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeArgument.
apexInterpreter.prototype.visitTypeArgument = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#qualifiedNameList.
apexInterpreter.prototype.visitQualifiedNameList = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#formalParameters.
apexInterpreter.prototype.visitFormalParameters = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#formalParameterList.
apexInterpreter.prototype.visitFormalParameterList = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#formalParameter.
apexInterpreter.prototype.visitFormalParameter = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#lastFormalParameter.
apexInterpreter.prototype.visitLastFormalParameter = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#methodBody.
apexInterpreter.prototype.visitMethodBody = function(ctx) {
    return ctx.block().accept(this);
};


// Visit a parse tree produced by apexParser#constructorBody.
apexInterpreter.prototype.visitConstructorBody = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#qualifiedName.
apexInterpreter.prototype.visitQualifiedName = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#literal.
apexInterpreter.prototype.visitLiteral = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotation.
apexInterpreter.prototype.visitAnnotation = function(ctx) {
    return ctx.annotationName().qualifiedName().getText();
};


// Visit a parse tree produced by apexParser#annotationName.
apexInterpreter.prototype.visitAnnotationName = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#elementValuePairs.
apexInterpreter.prototype.visitElementValuePairs = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#elementValuePair.
apexInterpreter.prototype.visitElementValuePair = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#elementValue.
apexInterpreter.prototype.visitElementValue = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#elementValueArrayInitializer.
apexInterpreter.prototype.visitElementValueArrayInitializer = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationTypeDeclaration.
apexInterpreter.prototype.visitAnnotationTypeDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationTypeBody.
apexInterpreter.prototype.visitAnnotationTypeBody = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationTypeElementDeclaration.
apexInterpreter.prototype.visitAnnotationTypeElementDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationTypeElementRest.
apexInterpreter.prototype.visitAnnotationTypeElementRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationMethodOrConstantRest.
apexInterpreter.prototype.visitAnnotationMethodOrConstantRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationMethodRest.
apexInterpreter.prototype.visitAnnotationMethodRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationConstantRest.
apexInterpreter.prototype.visitAnnotationConstantRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#defaultValue.
apexInterpreter.prototype.visitDefaultValue = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#block.
apexInterpreter.prototype.visitBlock = function(ctx) {
    return ctx.blockStatement();
};


// Visit a parse tree produced by apexParser#blockStatement.
apexInterpreter.prototype.visitBlockStatement = function(ctx) {
    return ctx.statement().accept(this);
};


// Visit a parse tree produced by apexParser#localVariableDeclarationStatement.
apexInterpreter.prototype.visitLocalVariableDeclarationStatement = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#localVariableDeclaration.
apexInterpreter.prototype.visitLocalVariableDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#statement.
apexInterpreter.prototype.visitStatement = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#propertyBlock.
apexInterpreter.prototype.visitPropertyBlock = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#getter.
apexInterpreter.prototype.visitGetter = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#setter.
apexInterpreter.prototype.visitSetter = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#catchClause.
apexInterpreter.prototype.visitCatchClause = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#catchType.
apexInterpreter.prototype.visitCatchType = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#finallyBlock.
apexInterpreter.prototype.visitFinallyBlock = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#resourceSpecification.
apexInterpreter.prototype.visitResourceSpecification = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#resources.
apexInterpreter.prototype.visitResources = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#resource.
apexInterpreter.prototype.visitResource = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#forControl.
apexInterpreter.prototype.visitForControl = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#forInit.
apexInterpreter.prototype.visitForInit = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enhancedForControl.
apexInterpreter.prototype.visitEnhancedForControl = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#forUpdate.
apexInterpreter.prototype.visitForUpdate = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#parExpression.
apexInterpreter.prototype.visitParExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#expressionList.
apexInterpreter.prototype.visitExpressionList = function(ctx) {
    return ctx.expression().map((expression) => {
        return expression.accept(this);
    });
};


// Visit a parse tree produced by apexParser#statementExpression.
apexInterpreter.prototype.visitStatementExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#constantExpression.
apexInterpreter.prototype.visitConstantExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#apexDbExpressionLong.
apexInterpreter.prototype.visitApexDbExpressionLong = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#apexDbExpressionShort.
apexInterpreter.prototype.visitApexDbExpressionShort = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#apexDbExpression.
apexInterpreter.prototype.visitApexDbExpression = function(ctx) {
    return this.visitChildren(ctx);
};



// Visit a parse tree produced by apexParser#PrimaryExpression.
apexInterpreter.prototype.visitPrimaryExpression = function(ctx) {
    return ctx.getText();
};


// Visit a parse tree produced by apexParser#OpExpression.
apexInterpreter.prototype.visitOpExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#NewExpression.
apexInterpreter.prototype.visitNewExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#MethodInvocation.
apexInterpreter.prototype.visitMethodInvocation = function(ctx) {
    let receiver = ctx.expression().accept(this);
    let apexClass = Apex.ApexClassStore.get(receiver);
    let arguments = ctx.expressionList().accept(this);
    console.log(receiver);
    console.log(arguments);
    class_node = Apex.ApexClassStore.get('System');
    method = class_node.staticMethods['debug'];
    let env = { object: { value: arguments[0] } };
    env.this = receiver;
    this.pushScope(env);
    var return_value;
    if (method instanceof Apex.ApexMethodNative) {
        method.call();
    } else {
        method.statements.forEach((statemente) => {
            return_value = statement.accept(this);
        });
    }
    this.popScope();
    return return_value;
};



// Visit a parse tree produced by apexParser#CastExpression.
apexInterpreter.prototype.visitCastExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#ShiftExpression.
apexInterpreter.prototype.visitShiftExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#FieldAccess.
apexInterpreter.prototype.visitFieldAccess = function(ctx) {
    let expression = ctx.expression().accept(this);
    return [expression, ctx.Identifier().getText()];
};


// Visit a parse tree produced by apexParser#primary.
apexInterpreter.prototype.visitPrimary = function(ctx) {
    if (ctx.Identifier()) {
        return ctx.Identifier();
    }
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#creator.
apexInterpreter.prototype.visitCreator = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#createdName.
apexInterpreter.prototype.visitCreatedName = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#innerCreator.
apexInterpreter.prototype.visitInnerCreator = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#arrayCreatorRest.
apexInterpreter.prototype.visitArrayCreatorRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#mapCreatorRest.
apexInterpreter.prototype.visitMapCreatorRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#setCreatorRest.
apexInterpreter.prototype.visitSetCreatorRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#classCreatorRest.
apexInterpreter.prototype.visitClassCreatorRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#explicitGenericInvocation.
apexInterpreter.prototype.visitExplicitGenericInvocation = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#nonWildcardTypeArguments.
apexInterpreter.prototype.visitNonWildcardTypeArguments = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeArgumentsOrDiamond.
apexInterpreter.prototype.visitTypeArgumentsOrDiamond = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#nonWildcardTypeArgumentsOrDiamond.
apexInterpreter.prototype.visitNonWildcardTypeArgumentsOrDiamond = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#superSuffix.
apexInterpreter.prototype.visitSuperSuffix = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#explicitGenericInvocationSuffix.
apexInterpreter.prototype.visitExplicitGenericInvocationSuffix = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#arguments.
apexInterpreter.prototype.visitArguments = function(ctx) {
    return this.visitChildren(ctx);
};

apexInterpreter.prototype.pushScope = function(env) {
    LocalEnvironment.pushScope(env);
};

apexInterpreter.prototype.popScope = function() {
    LocalEnvironment.popScope();
};

apexInterpreter.prototype.getValue = function(key) {
    return LocalEnvironment.get(key);
};


exports.apexInterpreter = apexInterpreter;