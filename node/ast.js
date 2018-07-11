const NameSpaceStore = require('../apexClass').NameSpaceStore;
const methodSearcher = require('../methodSearcher');

class AnnotationNode {
  constructor(name, parameters, lineno) {
    this.name = name;
    this.parameters = parameters;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitAnnotation(this);
  }
}

class ModifierNode {
  constructor(name, lineno) {
    this.name = name;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitModifier(this);
  }
}

class ClassNode {
  constructor(annotations, modifiers, name, superClass, implementClasses, constructor, instanceFields, instanceMethods, staticFields, staticMethods, innerClasses, lineno) {
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
    this.innerClasses = innerClasses;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitClass(this);
  }
}

class IntegerNode {
  constructor(value, lineno) {
    this.value = value;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitInteger(this);
  }

  type() {
    return NameSpaceStore.get('System', 'Integer');
  }
}

class ParameterNode {
  constructor(modifiers, type, name, lineno) {
    this.modifiers = modifiers;
    this.type = type;
    this.name = name;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitParameter(this);
  }
}

class ArrayAccessNode {
  constructor(receiver, key, lineno) {
    this.receiver = receiver;
    this.key = key;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitArrayAccess(this);
  }
}

class BooleanNode {
  constructor(value, lineno) {
    this.value = value;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitBoolean(this);
  }

  type() {
    return NameSpaceStore.get('System', 'Boolean');
  }
}

class BreakNode {
  constructor(lineno) {
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitBreak(this);
  }
}

class CommentNode {
  constructor(lineno) {
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitComment(this);
  }
}

class ConstructorDeclarationNode {
  constructor(name, modifiers, throws, parameters, statements, nativeFunction, lineno) {
    this.name = name;
    this.modifiers = modifiers;
    this.throws = throws;
    this.parameters = parameters;
    this.statements = statements;
    this.nativeFunction = nativeFunction;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitConstructorDeclaration(this);
  }
}

class ContinueNode {
  constructor(lineno) {
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitContinue(this);
  }
}

class DmlNode {
  constructor(type, object, lineno) {
    this.type = type;
    this.object = object;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitDml(this);
  }
}

class DoubleNode {
  constructor(value, lineno) {
    this.value = value;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitDouble(this);
  }

  type() {
    return NameSpaceStore.get('System', 'Double');
  }
}

class FieldDeclarationNode {
  constructor(type, modifiers, declarators, lineno) {
    this.type = type;
    this.modifiers = modifiers;
    this.declarators = declarators;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitFieldDeclaration(this);
  }
}

class FieldDeclaratorNode {
  constructor(name, modifiers, expression, lineno) {
    this.name = name;
    this.modifiers = modifiers;
    this.expression = expression;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitFieldDeclarator(this);
  }
}

class TryNode {
  constructor(block, catchClause, finallyBlock, lineno) {
    this.block = block;
    this.catchClause = catchClause;
    this.finallyBlock = finallyBlock;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitTry(this);
  }
}

class CatchNode {
  constructor(modifiers, type, identifier, block, lineno) {
    this.modifiers = modifiers;
    this.type = type;
    this.identifier = identifier;
    this.block = block;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitCatch(this);
  }
}

class FinallyNode {
  constructor(block, lineno) {
    this.block = block;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitFinally(this);
  }
}

class ForNode {
  constructor(forControl, statements, lineno) {
    this.forControl = forControl;
    this.statements = statements;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitFor(this);
  }
}

class ForenumNode {
  constructor(type, identifier, listExpression, statements, lineno) {
    this.type = type;
    this.identifier = identifier;
    this.listExpression = listExpression;
    this.statements = statements;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitForenum(this);
  }
}

class ForControlNode {
  constructor(forInit, expression, forUpdate, lineno) {
    this.forInit = forInit;
    this.expression = expression;
    this.forUpdate = forUpdate;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitForControl(this);
  }
}

class EnhancedForControlNode {
  constructor(modifiers, type, variableDeclaratorId, expression, lineno) {
    this.modifiers = modifiers;
    this.type = type;
    this.variableDeclaratorId = variableDeclaratorId;
    this.expression = expression;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitEnhancedForControl(this);
  }
}

class IfNode {
  constructor(condition, ifStatement, elseStatement, lineno) {
    this.condition = condition;
    this.ifStatement = ifStatement;
    this.elseStatement = elseStatement;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitIf(this);
  }
}

class MethodDeclarationNode {
  constructor(name, modifiers, returnType, parameters, throws, statements, nativeFunction, lineno) {
    this.name = name;
    this.modifiers = modifiers;
    this.returnType = returnType;
    this.parameters = parameters;
    this.throws = throws;
    this.statements = statements;
    this.nativeFunction = nativeFunction;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitMethodDeclaration(this);
  }
}

class MethodInvocationNode {
  constructor(nameOrExpression, parameters, lineno) {
    this.nameOrExpression = nameOrExpression;
    this.parameters = parameters;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitMethodInvocation(this);
  }
}

class NameNode {
  constructor(value, lineno) {
    this.value = value;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitName(this);
  }

  type() {
   return methodSearcher.searchFieldType(this, 'type');
  }
}

class NewNode {
  constructor(classType, parameters, lineno) {
    this.classType = classType;
    this.parameters = parameters;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitNew(this);
  }

  type() {
    return this.classType;
  }
}

class NullNode {
  constructor(lineno) {
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitNull(this);
  }
}

class ApexObjectNode {
  constructor(classNode, instanceFields, genericType, lineno) {
    this.classNode = classNode;
    this.instanceFields = instanceFields;
    this.genericType = genericType;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitApexObject(this);
  }

  type() {
    return this.classNode;
  }
}

class UnaryOperatorNode {
  constructor(op, expression, isPrefix, lineno) {
    this.op = op;
    this.expression = expression;
    this.isPrefix = isPrefix;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitUnaryOperator(this);
  }

  type() {
    return this.left.type();
  }
}

class BinaryOperatorNode {
  constructor(op, left, right, lineno) {
    this.op = op;
    this.left = left;
    this.right = right;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitBinaryOperator(this);
  }

  type() {
    return this.left.type();
  }
}

class ReturnNode {
  constructor(expression, lineno) {
    this.expression = expression;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitReturn(this);
  }
}

class ThrowNode {
  constructor(expression, lineno) {
    this.expression = expression;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitThrow(this);
  }
}

class SoqlNode {
  constructor(soql, lineno) {
    this.soql = soql;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitSoql(this);
  }
}

class StringNode {
  constructor(value, lineno) {
    this.value = value;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitString(this);
  }

  type() {
    return NameSpaceStore.get('System', 'String');
  }
}

class SwitchNode {
  constructor(expression, statements, lineno) {
    this.expression = expression;
    this.statements = statements;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitSwitch(this);
  }
}

class TriggerNode {
  constructor(name, object, triggerTimings, statements, lineno) {
    this.name = name;
    this.object = object;
    this.triggerTimings = triggerTimings;
    this.statements = statements;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitTrigger(this);
  }
}

class TriggerTimingNode {
  constructor(timing, dmm, lineno) {
    this.timing = timing;
    this.dmm = dmm;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitTriggerTiming(this);
  }
}

class VariableDeclarationNode {
  constructor(modifiers, type, declarators, lineno) {
    this.modifiers = modifiers;
    this.type = type;
    this.declarators = declarators;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitVariableDeclaration(this);
  }
}

class VariableDeclaratorNode {
  constructor(name, expression, lineno) {
    this.name = name;
    this.expression = expression;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitVariableDeclarator(this);
  }
}

class WhenNode {
  constructor(condition, statements, lineno) {
    this.condition = condition;
    this.statements = statements;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitWhen(this);
  }
}

class WhileNode {
  constructor(condition, statements, doFlag, lineno) {
    this.condition = condition;
    this.statements = statements;
    this.doFlag = doFlag;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitWhile(this);
  }
}

class NothingStatementNode {
  constructor(lineno) {
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitNothingStatement(this);
  }
}

class CastExpressionNode {
  constructor(type, expression, lineno) {
    this.type = type;
    this.expression = expression;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitCastExpression(this);
  }
}

class FieldAccessNode {
  constructor(expression, fieldName, lineno) {
    this.expression = expression;
    this.fieldName = fieldName;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitFieldAccess(this);
  }
}

class TypeNode {
  constructor(name, parameters, lineno) {
    this.name = name;
    this.parameters = parameters;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitType(this);
  }
}

class BlockNode {
  constructor(statements, lineno) {
    this.statements = statements;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitBlock(this);
  }
}

class GetterSetterNode {
  constructor(modifiers, methodBody, lineno) {
    this.modifiers = modifiers;
    this.methodBody = methodBody;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitGetterSetter(this);
  }
}

class PropertyDeclarationNode {
  constructor(modifiers, type, identifier, getter_or_setter, lineno) {
    this.modifiers = modifiers;
    this.type = type;
    this.identifier = identifier;
    this.getter_or_setter = getter_or_setter;
    this.lineno = lineno;
  }

  accept(visitor) {
    return visitor.visitPropertyDeclaration(this);
  }
}


exports.AnnotationNode = AnnotationNode;
exports.ModifierNode = ModifierNode;
exports.ClassNode = ClassNode;
exports.IntegerNode = IntegerNode;
exports.ParameterNode = ParameterNode;
exports.ArrayAccessNode = ArrayAccessNode;
exports.BooleanNode = BooleanNode;
exports.BreakNode = BreakNode;
exports.CommentNode = CommentNode;
exports.ConstructorDeclarationNode = ConstructorDeclarationNode;
exports.ContinueNode = ContinueNode;
exports.DmlNode = DmlNode;
exports.DoubleNode = DoubleNode;
exports.FieldDeclarationNode = FieldDeclarationNode;
exports.FieldDeclaratorNode = FieldDeclaratorNode;
exports.TryNode = TryNode;
exports.CatchNode = CatchNode;
exports.FinallyNode = FinallyNode;
exports.ForNode = ForNode;
exports.ForenumNode = ForenumNode;
exports.ForControlNode = ForControlNode;
exports.EnhancedForControlNode = EnhancedForControlNode;
exports.IfNode = IfNode;
exports.MethodDeclarationNode = MethodDeclarationNode;
exports.MethodInvocationNode = MethodInvocationNode;
exports.NameNode = NameNode;
exports.NewNode = NewNode;
exports.NullNode = NullNode;
exports.ApexObjectNode = ApexObjectNode;
exports.UnaryOperatorNode = UnaryOperatorNode;
exports.BinaryOperatorNode = BinaryOperatorNode;
exports.ReturnNode = ReturnNode;
exports.ThrowNode = ThrowNode;
exports.SoqlNode = SoqlNode;
exports.StringNode = StringNode;
exports.SwitchNode = SwitchNode;
exports.TriggerNode = TriggerNode;
exports.TriggerTimingNode = TriggerTimingNode;
exports.VariableDeclarationNode = VariableDeclarationNode;
exports.VariableDeclaratorNode = VariableDeclaratorNode;
exports.WhenNode = WhenNode;
exports.WhileNode = WhileNode;
exports.NothingStatementNode = NothingStatementNode;
exports.CastExpressionNode = CastExpressionNode;
exports.FieldAccessNode = FieldAccessNode;
exports.TypeNode = TypeNode;
exports.BlockNode = BlockNode;
exports.GetterSetterNode = GetterSetterNode;
exports.PropertyDeclarationNode = PropertyDeclarationNode;
