// Generated from apex.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var Apex = require('./apexClass');
var ApexVisitor = require('./apexVisitor');
var LocalEnvironment = require('./localEnv');
var Ast = require('./node/ast');

let ApexAstBuilder = function() {
    ApexVisitor.apexVisitor.call(this); // inherit default listener
    return this;
};
ApexAstBuilder.prototype = Object.create(ApexVisitor.apexVisitor.prototype);

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
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#classBody.
ApexAstBuilder.prototype.visitClassBody = function(ctx) {
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
    let methodName = ctx.Identifier();
    let parameters = ctx.formalParameters();
    let throws = ctx.qualifiedNameList();
    let statements = ctx.methodBody().accept(this);

    return new Apex.ApexMethod(methodName, parameters, throws, statements);
};


// Visit a parse tree produced by apexParser#genericMethodDeclaration.
ApexAstBuilder.prototype.visitGenericMethodDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#constructorDeclaration.
ApexAstBuilder.prototype.visitConstructorDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#genericConstructorDeclaration.
ApexAstBuilder.prototype.visitGenericConstructorDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#fieldDeclaration.
ApexAstBuilder.prototype.visitFieldDeclaration = function(ctx) {
    let type = ctx.type().accept(this);
    let declarators = ctx.variableDeclarators().accept(this);
    return new Apex.InstanceFieldDeclaration(type, declarators);
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
    let expression = ctx.variableInitializer();

    return new Apex.InstanceFieldDeclarator(declaratorId, expression);
};


// Visit a parse tree produced by apexParser#variableDeclaratorId.
ApexAstBuilder.prototype.visitVariableDeclaratorId = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#variableInitializer.
ApexAstBuilder.prototype.visitVariableInitializer = function(ctx) {
    return this.visitChildren(ctx);
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
    return ctx.getText();
};


// Visit a parse tree produced by apexParser#classOrInterfaceType.
ApexAstBuilder.prototype.visitClassOrInterfaceType = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#primitiveType.
ApexAstBuilder.prototype.visitPrimitiveType = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeArguments.
ApexAstBuilder.prototype.visitTypeArguments = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#typeArgument.
ApexAstBuilder.prototype.visitTypeArgument = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#qualifiedNameList.
ApexAstBuilder.prototype.visitQualifiedNameList = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#formalParameters.
ApexAstBuilder.prototype.visitFormalParameters = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#formalParameterList.
ApexAstBuilder.prototype.visitFormalParameterList = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#formalParameter.
ApexAstBuilder.prototype.visitFormalParameter = function(ctx) {
    return this.visitChildren(ctx);
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
    return this.visitChildren(ctx);
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
        return new Ast.IntergerNode(ctx.IntegerLiteral());
    } else if (ctx.FloatingPointLiteral()) {
        return new Ast.DoubleNode(ctx.IntegerLiteral());
    } else if (ctx.StringLiteral()) {
        return new Ast.StringNode(ctx.StringLiteral());
    } else if (ctx.BooleanLiteral()) {
        return new Ast.BooleanNode(ctx.BooleanLiteral());
    } else if (ctx.NullLiteral()) {
        return new Ast.NullNode(ctx.BooleanLiteral());
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


// Visit a parse tree produced by apexParser#annotationTypeBody.
ApexAstBuilder.prototype.visitAnnotationTypeBody = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationTypeElementDeclaration.
ApexAstBuilder.prototype.visitAnnotationTypeElementDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationTypeElementRest.
ApexAstBuilder.prototype.visitAnnotationTypeElementRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationMethodOrConstantRest.
ApexAstBuilder.prototype.visitAnnotationMethodOrConstantRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationMethodRest.
ApexAstBuilder.prototype.visitAnnotationMethodRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#annotationConstantRest.
ApexAstBuilder.prototype.visitAnnotationConstantRest = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#defaultValue.
ApexAstBuilder.prototype.visitDefaultValue = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#block.
ApexAstBuilder.prototype.visitBlock = function(ctx) {
    return ctx.blockStatement();
};


// Visit a parse tree produced by apexParser#blockStatement.
ApexAstBuilder.prototype.visitBlockStatement = function(ctx) {
    return ctx.statement().accept(this);
};


// Visit a parse tree produced by apexParser#localVariableDeclarationStatement.
ApexAstBuilder.prototype.visitLocalVariableDeclarationStatement = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#localVariableDeclaration.
ApexAstBuilder.prototype.visitLocalVariableDeclaration = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#statement.
ApexAstBuilder.prototype.visitStatement = function(ctx) {
    return this.visitChildren(ctx);
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
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#catchType.
ApexAstBuilder.prototype.visitCatchType = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#finallyBlock.
ApexAstBuilder.prototype.visitFinallyBlock = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#resourceSpecification.
ApexAstBuilder.prototype.visitResourceSpecification = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#resources.
ApexAstBuilder.prototype.visitResources = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#resource.
ApexAstBuilder.prototype.visitResource = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#forControl.
ApexAstBuilder.prototype.visitForControl = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#forInit.
ApexAstBuilder.prototype.visitForInit = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#enhancedForControl.
ApexAstBuilder.prototype.visitEnhancedForControl = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#forUpdate.
ApexAstBuilder.prototype.visitForUpdate = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#parExpression.
ApexAstBuilder.prototype.visitParExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#expressionList.
ApexAstBuilder.prototype.visitExpressionList = function(ctx) {
    return ctx.expression().map((expression) => {
        return expression.accept(this);
    });
};


// Visit a parse tree produced by apexParser#statementExpression.
ApexAstBuilder.prototype.visitStatementExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#constantExpression.
ApexAstBuilder.prototype.visitConstantExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#apexDbExpressionLong.
ApexAstBuilder.prototype.visitApexDbExpressionLong = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#apexDbExpressionShort.
ApexAstBuilder.prototype.visitApexDbExpressionShort = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#apexDbExpression.
ApexAstBuilder.prototype.visitApexDbExpression = function(ctx) {
    return this.visitChildren(ctx);
};



// Visit a parse tree produced by apexParser#PrimaryExpression.
ApexAstBuilder.prototype.visitPrimaryExpression = function(ctx) {
    return ctx.getText();
};


// Visit a parse tree produced by apexParser#OpExpression.
ApexAstBuilder.prototype.visitOpExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#NewExpression.
ApexAstBuilder.prototype.visitNewExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#MethodInvocation.
ApexAstBuilder.prototype.visitMethodInvocation = function(ctx) {
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
ApexAstBuilder.prototype.visitCastExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#ShiftExpression.
ApexAstBuilder.prototype.visitShiftExpression = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#FieldAccess.
ApexAstBuilder.prototype.visitFieldAccess = function(ctx) {
    let expression = ctx.expression().accept(this);
    return [expression, ctx.Identifier().getText()];
};


// Visit a parse tree produced by apexParser#primary.
ApexAstBuilder.prototype.visitPrimary = function(ctx) {
    if (ctx.Identifier()) {
        return ctx.Identifier();
    }
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#creator.
ApexAstBuilder.prototype.visitCreator = function(ctx) {
    return this.visitChildren(ctx);
};


// Visit a parse tree produced by apexParser#createdName.
ApexAstBuilder.prototype.visitCreatedName = function(ctx) {
    return this.visitChildren(ctx);
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
    return this.visitChildren(ctx);
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

ApexAstBuilder.prototype.pushScope = function(env) {
    LocalEnvironment.pushScope(env);
};

ApexAstBuilder.prototype.popScope = function() {
    LocalEnvironment.popScope();
};

ApexAstBuilder.prototype.getValue = function(key) {
    return LocalEnvironment.get(key);
};


exports.ApexAstBuilder = ApexAstBuilder;
