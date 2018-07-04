class AnnotationNode {
  constructor(name, parameters) {
    this.name = name;
    this.parameters = parameters;
  }

  accept(visitor) {
    return visitor.visitAnnotation(this);
  }
}

class ModifierNode {
  constructor(name) {
    this.name = name;
  }

  accept(visitor) {
    return visitor.visitModifier(this);
  }
}

class ClassNode {
  constructor(annotations, modifiers, name, superClass, implementClasses, constructor, instanceFields, instanceMethods, staticFields, staticMethods) {
    this.annotations = annotations;
    this.modifiers = modifiers;
    this.name = name;
    this.superClass = superClass;
    this.implementClasses = implementClasses;
    this.constructor = constructor;
    this.instanceFields = instanceFields;
    this.instanceMethods = instanceMethods;
    this.staticFields = staticFields;
    this.staticMethods = staticMethods;
  }

  accept(visitor) {
    return visitor.visitClass(this);
  }
}

class IntegerNode {
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitInteger(this);
  }
}

class ParameterNode {
  constructor(modifiers, type, name) {
    this.modifiers = modifiers;
    this.type = type;
    this.name = name;
  }

  accept(visitor) {
    return visitor.visitParameter(this);
  }
}

class ArrayAccessNode {
  constructor(receiver, key) {
    this.receiver = receiver;
    this.key = key;
  }

  accept(visitor) {
    return visitor.visitArrayAccess(this);
  }
}

class BooleanNode {
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitBoolean(this);
  }
}

class BreakNode {
  constructor() {

  }

  accept(visitor) {
    return visitor.visitBreak(this);
  }
}

class CommentNode {
  constructor() {

  }

  accept(visitor) {
    return visitor.visitComment(this);
  }
}

class ConstructorDeclarationNode {
  constructor(name, modifiers, throws, parameters, statements, nativeFunction) {
    this.name = name;
    this.modifiers = modifiers;
    this.throws = throws;
    this.parameters = parameters;
    this.statements = statements;
    this.nativeFunction = nativeFunction;
  }

  accept(visitor) {
    return visitor.visitConstructorDeclaration(this);
  }
}

class ContinueNode {
  constructor() {

  }

  accept(visitor) {
    return visitor.visitContinue(this);
  }
}

class DmlNode {
  constructor(type, object) {
    this.type = type;
    this.object = object;
  }

  accept(visitor) {
    return visitor.visitDml(this);
  }
}

class DoubleNode {
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitDouble(this);
  }
}

class FieldDeclarationNode {
  constructor(type, modifiers, declarators) {
    this.type = type;
    this.modifiers = modifiers;
    this.declarators = declarators;
  }

  accept(visitor) {
    return visitor.visitFieldDeclaration(this);
  }
}

class FieldDeclaratorNode {
  constructor(name, modifiers, expression) {
    this.name = name;
    this.modifiers = modifiers;
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitFieldDeclarator(this);
  }
}

class TryNode {
  constructor(block, catchClause, finallyBlock) {
    this.block = block;
    this.catchClause = catchClause;
    this.finallyBlock = finallyBlock;
  }

  accept(visitor) {
    return visitor.visitTry(this);
  }
}

class CatchNode {
  constructor(modifiers, type, identifier, block) {
    this.modifiers = modifiers;
    this.type = type;
    this.identifier = identifier;
    this.block = block;
  }

  accept(visitor) {
    return visitor.visitCatch(this);
  }
}

class FinallyNode {
  constructor(block) {
    this.block = block;
  }

  accept(visitor) {
    return visitor.visitFinally(this);
  }
}

class ForNode {
  constructor(forControl, statements) {
    this.forControl = forControl;
    this.statements = statements;
  }

  accept(visitor) {
    return visitor.visitFor(this);
  }
}

class ForenumNode {
  constructor(type, identifier, listExpression, statements) {
    this.type = type;
    this.identifier = identifier;
    this.listExpression = listExpression;
    this.statements = statements;
  }

  accept(visitor) {
    return visitor.visitForenum(this);
  }
}

class ForControlNode {
  constructor(forInit, expression, forUpdate) {
    this.forInit = forInit;
    this.expression = expression;
    this.forUpdate = forUpdate;
  }

  accept(visitor) {
    return visitor.visitForControl(this);
  }
}

class EnhancedForControlNode {
  constructor(modifiers, type, variableDeclaratorId, expression) {
    this.modifiers = modifiers;
    this.type = type;
    this.variableDeclaratorId = variableDeclaratorId;
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitEnhancedForControl(this);
  }
}

class IfNode {
  constructor(condition, ifStatement, elseStatement) {
    this.condition = condition;
    this.ifStatement = ifStatement;
    this.elseStatement = elseStatement;
  }

  accept(visitor) {
    return visitor.visitIf(this);
  }
}

class MethodDeclarationNode {
  constructor(name, modifiers, returnType, parameters, throws, statements, nativeFunction) {
    this.name = name;
    this.modifiers = modifiers;
    this.returnType = returnType;
    this.parameters = parameters;
    this.throws = throws;
    this.statements = statements;
    this.nativeFunction = nativeFunction;
  }

  accept(visitor) {
    return visitor.visitMethodDeclaration(this);
  }
}

class MethodInvocationNode {
  constructor(receiver, parameters, methodName) {
    this.receiver = receiver;
    this.parameters = parameters;
    this.methodName = methodName;
  }

  accept(visitor) {
    return visitor.visitMethodInvocation(this);
  }
}

class NameNode {
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitName(this);
  }
}

class NewNode {
  constructor(className, parameters) {
    this.className = className;
    this.parameters = parameters;
  }

  accept(visitor) {
    return visitor.visitNew(this);
  }
}

class NullNode {
  constructor() {

  }

  accept(visitor) {
    return visitor.visitNull(this);
  }
}

class ObjectNode {
  constructor(classNode, genericType, instanceFields, genericsNode) {
    this.classNode = classNode;
    this.genericType = genericType;
    this.instanceFields = instanceFields;
    this.genericsNode = genericsNode;
  }

  accept(visitor) {
    return visitor.visitObject(this);
  }
}

class BinaryOperatorNode {
  constructor(type, left, right) {
    this.type = type;
    this.left = left;
    this.right = right;
  }

  accept(visitor) {
    return visitor.visitBinaryOperator(this);
  }
}

class ReturnNode {
  constructor(expression) {
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitReturn(this);
  }
}

class ThrowNode {
  constructor(expression) {
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitThrow(this);
  }
}

class SoqlNode {
  constructor(soql) {
    this.soql = soql;
  }

  accept(visitor) {
    return visitor.visitSoql(this);
  }
}

class StringNode {
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitString(this);
  }
}

class SwitchNode {
  constructor(expression, statements) {
    this.expression = expression;
    this.statements = statements;
  }

  accept(visitor) {
    return visitor.visitSwitch(this);
  }
}

class TriggerNode {
  constructor(name, object, triggerTimings, statements) {
    this.name = name;
    this.object = object;
    this.triggerTimings = triggerTimings;
    this.statements = statements;
  }

  accept(visitor) {
    return visitor.visitTrigger(this);
  }
}

class TriggerTimingNode {
  constructor(timing, dmm) {
    this.timing = timing;
    this.dmm = dmm;
  }

  accept(visitor) {
    return visitor.visitTriggerTiming(this);
  }
}

class VariableDeclarationNode {
  constructor(modifiers, type, declarators) {
    this.modifiers = modifiers;
    this.type = type;
    this.declarators = declarators;
  }

  accept(visitor) {
    return visitor.visitVariableDeclaration(this);
  }
}

class VariableDeclaratorNode {
  constructor(name, expression) {
    this.name = name;
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitVariableDeclarator(this);
  }
}

class WhenNode {
  constructor(condition, statements) {
    this.condition = condition;
    this.statements = statements;
  }

  accept(visitor) {
    return visitor.visitWhen(this);
  }
}

class WhileNode {
  constructor(condition, statements, doFlag) {
    this.condition = condition;
    this.statements = statements;
    this.doFlag = doFlag;
  }

  accept(visitor) {
    return visitor.visitWhile(this);
  }
}

class NothingStatementNode {
  constructor() {

  }

  accept(visitor) {
    return visitor.visitNothingStatement(this);
  }
}

class CastExpressionNode {
  constructor(type, expression) {
    this.type = type;
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitCastExpression(this);
  }
}

class FieldAccessNode {
  constructor(expression, fieldName) {
    this.expression = expression;
    this.fieldName = fieldName;
  }

  accept(visitor) {
    return visitor.visitFieldAccess(this);
  }
}

class TypeNode {
  constructor(name, parameters) {
    this.name = name;
    this.parameters = parameters;
  }

  accept(visitor) {
    return visitor.visitType(this);
  }
}


exports.AnnotationNode = AnnotationNode
exports.ModifierNode = ModifierNode
exports.ClassNode = ClassNode
exports.IntegerNode = IntegerNode
exports.ParameterNode = ParameterNode
exports.ArrayAccessNode = ArrayAccessNode
exports.BooleanNode = BooleanNode
exports.BreakNode = BreakNode
exports.CommentNode = CommentNode
exports.ConstructorDeclarationNode = ConstructorDeclarationNode
exports.ContinueNode = ContinueNode
exports.DmlNode = DmlNode
exports.DoubleNode = DoubleNode
exports.FieldDeclarationNode = FieldDeclarationNode
exports.FieldDeclaratorNode = FieldDeclaratorNode
exports.TryNode = TryNode
exports.CatchNode = CatchNode
exports.FinallyNode = FinallyNode
exports.ForNode = ForNode
exports.ForenumNode = ForenumNode
exports.ForControlNode = ForControlNode
exports.EnhancedForControlNode = EnhancedForControlNode
exports.IfNode = IfNode
exports.MethodDeclarationNode = MethodDeclarationNode
exports.MethodInvocationNode = MethodInvocationNode
exports.NameNode = NameNode
exports.NewNode = NewNode
exports.NullNode = NullNode
exports.ObjectNode = ObjectNode
exports.BinaryOperatorNode = BinaryOperatorNode
exports.ReturnNode = ReturnNode
exports.ThrowNode = ThrowNode
exports.SoqlNode = SoqlNode
exports.StringNode = StringNode
exports.SwitchNode = SwitchNode
exports.TriggerNode = TriggerNode
exports.TriggerTimingNode = TriggerTimingNode
exports.VariableDeclarationNode = VariableDeclarationNode
exports.VariableDeclaratorNode = VariableDeclaratorNode
exports.WhenNode = WhenNode
exports.WhileNode = WhileNode
exports.NothingStatementNode = NothingStatementNode
exports.CastExpressionNode = CastExpressionNode
exports.FieldAccessNode = FieldAccessNode
exports.TypeNode = TypeNode
