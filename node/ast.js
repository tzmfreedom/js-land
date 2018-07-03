class AnnotationNode extends BaseNode {
  constructor(name) {
    this.name = name;
  }

  accept(visitor) {
    visitor.visitAnnotation(this);
  }
}

class ModifierNode extends BaseNode {
  constructor(name) {
    this.name = name;
  }

  accept(visitor) {
    visitor.visitModifier(this);
  }
}

class ClassNode extends BaseNode {
  constructor(modifiers, name, access_modifier, annotations, instance_fields, instance_methods, constructor, static_fields, static_methods, super_class, implements) {
    this.modifiers = modifiers;
    this.name = name;
    this.access_modifier = access_modifier;
    this.annotations = annotations;
    this.instance_fields = instance_fields;
    this.instance_methods = instance_methods;
    this.constructor = constructor;
    this.static_fields = static_fields;
    this.static_methods = static_methods;
    this.super_class = super_class;
    this.implements = implements;
  }

  accept(visitor) {
    visitor.visitClass(this);
  }
}

class IntergerNode extends BaseNode {
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    visitor.visitInterger(this);
  }
}

class ArgumentNode extends BaseNode {
  constructor(type, name) {
    this.type = type;
    this.name = name;
  }

  accept(visitor) {
    visitor.visitArgument(this);
  }
}

class ArrayAccessNode extends BaseNode {
  constructor(receiver, key) {
    this.receiver = receiver;
    this.key = key;
  }

  accept(visitor) {
    visitor.visitArrayAccess(this);
  }
}

class BooleanNode extends BaseNode {
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    visitor.visitBoolean(this);
  }
}

class BreakNode extends BaseNode {
  constructor() {

  }

  accept(visitor) {
    visitor.visitBreak(this);
  }
}

class CommentNode extends BaseNode {
  constructor() {

  }

  accept(visitor) {
    visitor.visitComment(this);
  }
}

class ConstructorDeclarationNode extends BaseNode {
  constructor(access_modifier, name, modifiers, return_type, arguments, statements, native, call_proc) {
    this.access_modifier = access_modifier;
    this.name = name;
    this.modifiers = modifiers;
    this.return_type = return_type;
    this.arguments = arguments;
    this.statements = statements;
    this.native = native;
    this.call_proc = call_proc;
  }

  accept(visitor) {
    visitor.visitConstructorDeclaration(this);
  }
}

class ContinueNode extends BaseNode {
  constructor() {

  }

  accept(visitor) {
    visitor.visitContinue(this);
  }
}

class DmlNode extends BaseNode {
  constructor(type, object) {
    this.type = type;
    this.object = object;
  }

  accept(visitor) {
    visitor.visitDml(this);
  }
}

class DoubleNode extends BaseNode {
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    visitor.visitDouble(this);
  }
}

class FieldDeclarationNode extends BaseNode {
  constructor(type, access_modifier, modifiers, statements) {
    this.type = type;
    this.access_modifier = access_modifier;
    this.modifiers = modifiers;
    this.statements = statements;
  }

  accept(visitor) {
    visitor.visitFieldDeclaration(this);
  }
}

class FieldDeclaratorNode extends BaseNode {
  constructor(name, modifiers, expression) {
    this.name = name;
    this.modifiers = modifiers;
    this.expression = expression;
  }

  accept(visitor) {
    visitor.visitFieldDeclarator(this);
  }
}

class ForNode extends BaseNode {
  constructor(init_statement, exit_condition, increment_statement, statements) {
    this.init_statement = init_statement;
    this.exit_condition = exit_condition;
    this.increment_statement = increment_statement;
    this.statements = statements;
  }

  accept(visitor) {
    visitor.visitFor(this);
  }
}

class ForenumNode extends BaseNode {
  constructor(type, identifier, list_object, statements) {
    this.type = type;
    this.identifier = identifier;
    this.list_object = list_object;
    this.statements = statements;
  }

  accept(visitor) {
    visitor.visitForenum(this);
  }
}

class IfNode extends BaseNode {
  constructor(condition, if_statement, else_statement) {
    this.condition = condition;
    this.if_statement = if_statement;
    this.else_statement = else_statement;
  }

  accept(visitor) {
    visitor.visitIf(this);
  }
}

class MethodDeclarationNode extends BaseNode {
  constructor(access_modifier, name, modifiers, return_type, arguments, statements, native, call_proc) {
    this.access_modifier = access_modifier;
    this.name = name;
    this.modifiers = modifiers;
    this.return_type = return_type;
    this.arguments = arguments;
    this.statements = statements;
    this.native = native;
    this.call_proc = call_proc;
  }

  accept(visitor) {
    visitor.visitMethodDeclaration(this);
  }
}

class MethodInvocationNode extends BaseNode {
  constructor(receiver, arguments, method_name) {
    this.receiver = receiver;
    this.arguments = arguments;
    this.method_name = method_name;
  }

  accept(visitor) {
    visitor.visitMethodInvocation(this);
  }
}

class NameNode extends BaseNode {
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    visitor.visitName(this);
  }
}

class NewNode extends BaseNode {
  constructor(class_name, arguments) {
    this.class_name = class_name;
    this.arguments = arguments;
  }

  accept(visitor) {
    visitor.visitNew(this);
  }
}

class NullNode extends BaseNode {
  constructor() {

  }

  accept(visitor) {
    visitor.visitNull(this);
  }
}

class ObjectNode extends BaseNode {
  constructor(class_node, arguments, instance_fields, generics_node) {
    this.class_node = class_node;
    this.arguments = arguments;
    this.instance_fields = instance_fields;
    this.generics_node = generics_node;
  }

  accept(visitor) {
    visitor.visitObject(this);
  }
}

class BinaryOperatorNode extends BaseNode {
  constructor(type, left, right) {
    this.type = type;
    this.left = left;
    this.right = right;
  }

  accept(visitor) {
    visitor.visitBinaryOperator(this);
  }
}

class ReturnNode extends BaseNode {
  constructor(expression) {
    this.expression = expression;
  }

  accept(visitor) {
    visitor.visitReturn(this);
  }
}

class SoqlNode extends BaseNode {
  constructor(soql) {
    this.soql = soql;
  }

  accept(visitor) {
    visitor.visitSoql(this);
  }
}

class StringNode extends BaseNode {
  constructor(value) {
    this.value = value;
  }

  accept(visitor) {
    visitor.visitString(this);
  }
}

class SwitchNode extends BaseNode {
  constructor(expression, statements) {
    this.expression = expression;
    this.statements = statements;
  }

  accept(visitor) {
    visitor.visitSwitch(this);
  }
}

class TriggerNode extends BaseNode {
  constructor(name, object, arguments, statements) {
    this.name = name;
    this.object = object;
    this.arguments = arguments;
    this.statements = statements;
  }

  accept(visitor) {
    visitor.visitTrigger(this);
  }
}

class TriggerTimingNode extends BaseNode {
  constructor(timing, dml variable_declaration) {
    this.timing = timing;
    this.dml variable_declaration = dml variable_declaration;
  }

  accept(visitor) {
    visitor.visitTriggerTiming(this);
  }
}

class VariableDeclarationNode extends BaseNode {
  constructor(type, statements) {
    this.type = type;
    this.statements = statements;
  }

  accept(visitor) {
    visitor.visitVariableDeclaration(this);
  }
}

class VariableDeclaratorNode extends BaseNode {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  accept(visitor) {
    visitor.visitVariableDeclarator(this);
  }
}

class WhenNode extends BaseNode {
  constructor(condition, statements) {
    this.condition = condition;
    this.statements = statements;
  }

  accept(visitor) {
    visitor.visitWhen(this);
  }
}

class WhileNode extends BaseNode {
  constructor(condition_statement, statements) {
    this.condition_statement = condition_statement;
    this.statements = statements;
  }

  accept(visitor) {
    visitor.visitWhile(this);
  }
}


exports.AnnotationNode = AnnotationNode
exports.ModifierNode = ModifierNode
exports.ClassNode = ClassNode
exports.IntergerNode = IntergerNode
exports.ArgumentNode = ArgumentNode
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
exports.ForNode = ForNode
exports.ForenumNode = ForenumNode
exports.IfNode = IfNode
exports.MethodDeclarationNode = MethodDeclarationNode
exports.MethodInvocationNode = MethodInvocationNode
exports.NameNode = NameNode
exports.NewNode = NewNode
exports.NullNode = NullNode
exports.ObjectNode = ObjectNode
exports.BinaryOperatorNode = BinaryOperatorNode
exports.ReturnNode = ReturnNode
exports.SoqlNode = SoqlNode
exports.StringNode = StringNode
exports.SwitchNode = SwitchNode
exports.TriggerNode = TriggerNode
exports.TriggerTimingNode = TriggerTimingNode
exports.VariableDeclarationNode = VariableDeclarationNode
exports.VariableDeclaratorNode = VariableDeclaratorNode
exports.WhenNode = WhenNode
exports.WhileNode = WhileNode
