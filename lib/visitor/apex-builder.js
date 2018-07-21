const Ast = require('../node/ast');
const ApexClassStore = require('../node/apexClass').ApexClassStore;
const methodResolver = require('../method-resolver');
const variableResolver = require('../variable-resolver');
const EnvManager = require('../env-manager');
const ClassStaticFields = require('../class-static-fields')
const Runtime = require('../runtime');
const Variable = require('../node/variable');
const ApexClass = require('../node/apexClass').ApexClass;

class ApexBuilder {
  visit(node) {
    EnvManager.pushScope({});
    node.accept(this);
    EnvManager.popScope();
  }

  validateModifierDuplication(node) {
    let modifiers = [];
    if (node.modifiers) {
      node.modifiers.map((modifier) => {
        if (modifiers.includes(modifier.name)) {
          throw `Compile Error: duplicate modifier ${name} at line ${node.lineno}`
        }
        modifiers.push(modifier.name);
      });
    }
  }

  validateParameter(node) {
    let parameters = [];
    node.parameters.map((parameter) => {
      if (parameters.includes(parameter.name)){
        throw `Compile Error: duplicate modifier ${name} at line ${node.lineno}`
      }
      parameters.push(parameter.name);
    });
  }

  visitClass(node) {
    this.validateModifierDuplication(node);

    let staticMethods = node.staticMethods;

    Object.keys(staticMethods).forEach((methodName) => {
      let methods = staticMethods[methodName];
      methods.forEach((methodNode) => {
        let env = {};
        methodNode.parameters.forEach((parameter) => {
          env[parameter.name] = { type: parameter.type };
        });
        EnvManager.pushScope(env, null);
        this.currentMethodNode = methodNode;
        methodNode.accept(this);
        EnvManager.popScope();
      });
    });

    let newObject = this.createObject(node);
    let instanceMethods = node.instanceMethods;
    Object.keys(node.instanceMethods).forEach((methodName) => {
      let methods = instanceMethods[methodName];
      methods.forEach((methodNode) => {
        let env = {
          this: new Variable(newObject.type(), newObject)
        };
        methodNode.parameters.forEach((parameter) => {
          env[parameter.name] = { type: parameter.type };
        });
        EnvManager.pushScope(env, null);
        this.currentMethodNode = methodNode;
        methodNode.accept(this);
        EnvManager.popScope();
      });
    });

    Object.keys(node.staticFields).forEach((fieldName) => {
      const staticField = node.staticFields[fieldName];
      const expressionType = staticField.expression.type().classNode;
      if (expressionType && staticField.type.classNode != expressionType) {
        throw `Invalid type ${expressionType.name} at line ${node.lineno}`;
      }
    });

    Object.keys(node.instanceFields).forEach((fieldName) => {
      const instanceField = node.instanceFields[fieldName];
      const expressionType = instanceField.expression.type().classNode;
      if (expressionType && instanceField.type.classNode != expressionType) {
        throw `Invalid type ${expressionType.name} at line ${node.lineno}`;
      }
    });
  }

  visitMethodDeclaration(node) {
    this.validateModifierDuplication(node);
    this.validateParameter(node);

    if (node.statements) {
      const returnNode = node.statements.accept(this);
      if (this.currentMethodNode.returnType.classNode !== null && !this.isReturn(returnNode)) {
        throw `Missing return statement required return type: ${this.currentMethodNode.returnType.name.join('.')} at line ${node.lineno}`;
      }
    }
  }

  createObject(classNode) {
    let instanceFields = {};
    Object.keys(classNode.instanceFields).forEach((fieldName) => {
      let field = classNode.instanceFields[fieldName];
      if (field.expression) {
        instanceFields[fieldName] = new Variable(
          field.type,
          field.expression.accept(this)
        );
      } else {
        instanceFields[fieldName] = new Variable(
          field.type,
          new Ast.NullNode(),
          field.setter,
          field.getter
        );
      }
    });
    const typeNode = new Ast.TypeNode([classNode.name], []);
    typeNode.classNode = ApexClassStore.get(classNode.name);
    return new Ast.ApexObjectNode(typeNode, instanceFields);
  }

  visitFieldDeclaration(node) {

  }

  visitArrayAccess(node) {
    return node.receiver.accept(this);
  }

  visitBreak(node) {
    return node;
  }

  visitComment(node) {
  
  }

  visitContinue(node) {
  
  }

  visitDml(node) {
  
  }

  visitFor(node) {
    EnvManager.pushScope({});

    node.forControl.accept(this);
    node.statements.accept(this);

    EnvManager.popScope();
    return node;
  }

  visitForControl(node) {
    node.forInit.accept(this);
    node.forUpdate.forEach((statement) => { statement.accept(this) });

    let condition = node.expression.type();
    if (!condition instanceof Ast.BooleanNode) {
      throw `Should be boolean expression at line ${condition.lineno}`;
    }
  }

  visitEnhancedForControl(node) {
    let env = EnvManager.currentScope();
    env.define(node.type, node.variableDeclaratorId, new Ast.NullNode());
    node.expression.accept(this);
  }

  visitIf(node) {
    let condition = node.condition.accept(this);
    if (!condition instanceof Ast.BooleanNode) {
      throw `Should be boolean expression at line ${condition.lineno}`;
    }
    EnvManager.pushScope({})
    const ifReturnNode = node.ifStatement.accept(this);
    EnvManager.popScope()
    if (node.elseStatement) {
      EnvManager.pushScope({})
      const elseReturnNode = node.elseStatement.accept(this);
      EnvManager.popScope()
      if (this.isReturn(ifReturnNode) && this.isReturn(elseReturnNode)) {
        return ifReturnNode;
      }
    }
  }


  visitMethodInvocation(node) {
    let searchResult = methodResolver.searchMethodByType(node);
    if (!searchResult) {
      throw `Method missing ${node.nameOrExpression.value.join('.')} at line ${node.lineno}`
    }
    let env = {};
    if (!(searchResult.receiverNode instanceof ApexClass)) {
      env.this = {
        type: searchResult.receiverNode,
        value: searchResult.receiverNode,
      };
    }
    for (let i = 0; i < searchResult.methodNode.parameters.length; i++) {
      let parameter = searchResult.methodNode.parameters[i];
      let value = node.parameters[i];
      env[parameter.name] = { type: parameter.type };
    }
    let parameters = node.parameters.map((parameter) => { return parameter.accept(this); });
  }

  visitName(node) {
    const resolveResult = variableResolver.searchFieldByType(node, false)
    if (!resolveResult) {
      throw `Variable not declaration : ${node.value.join('.')} at line ${node.lineno}`
    }

    if (resolveResult.receiverNode instanceof ApexClass) {
      const field = resolveResult.receiverNode.staticFields[resolveResult.key];
      if (!(field.isPublic())) {
        throw `Field is not visible : ${resolveResult.key} at line ${node.lineno}`;
      }
      return field.type;
    } else {
      if (resolveResult.key) {
        if (node.value.length !== 2 || node.value[0] !== 'this') {
          const field = resolveResult.receiverNode.classNode.instanceFields[resolveResult.key]
          if (!(field.isPublic())) {
            throw `Field is not visible : ${resolveResult.key} at line ${node.lineno}`;
          }
          if (field.getter && !(field.getter.isPublic())) {
            throw `Field is not visible : ${resolveResult.key} at line ${node.lineno}`;
          }
          return field.type;
        }
      } else {
        return EnvManager.get(resolveResult.receiverNode).type();
      }
    }
  }

  visitFieldAccess(node) {}

  visitNew(node) {
    const classNode = node.classType.classNode;
    const instanceFields = {};
    Object.keys(classNode.instanceFields).map((fieldName) => {
      const field = classNode.instanceFields[fieldName];
      if (field.expression) {
        instanceFields[fieldName] = new Variable(
          field.type,
          field.expression.accept(this)
        )
      } else {
        instanceFields[fieldName] = new Variable(
          field.type,
          new Ast.NullNode(),
          field.setter,
          field.getter
        )
      }
    });
    return new Ast.ApexObjectNode(classNode, instanceFields);
  }

  visitNull(node) {
    return node;
  }

  visitUnaryOperator(node) {}

  visitBinaryOperator(node) {
    const leftType = node.left.type();
    const rightType = node.right.type();

    switch(node.op) {
      case '+':
        if (![Runtime.String, Runtime.Integer, Runtime.Double].includes(leftType.classNode)) {
          throw `Must be String or integer or double, but ${leftType.name} at line ${node.lineno}`;
        }
        if (![Runtime.String, Runtime.Integer, Runtime.Double].includes(rightType.classNode)) {
          throw `Must be String or integer or double, but ${rightType.name} at line ${node.lineno}`;
        }
        break;
      case '-':
      case '*':
      case '/':
      case '%':
      case '<<<':
      case '<<':
      case '>>>':
      case '>>':
        if (![Runtime.Integer, Runtime.Double].includes(leftType.classNode)) {
          throw `Must be integer or double, but ${leftType.name} at line ${node.lineno}`;
        }
        if (![Runtime.Integer, Runtime.Double].includes(rightType.classNode)) {
          throw `Must be integer or double, but ${rightType.name} at line ${node.lineno}`;
        }
        break;
      case '&':
      case '|':
      case '^':
        if (leftType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${leftType.name} at line ${node.lineno}`;
        }
        if (rightType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${rightType.name} at line ${node.lineno}`;
        }
        break;
      case '<':
      case '>':
      case '<=':
      case '>=':
      case '==':
      case '===':
      case '!=':
      case '!==':
        if (!this.checkType(leftType, rightType)) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        break;
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
        if (!this.checkType(leftType, rightType)) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        variableResolver.searchFieldByType(node.left, true)
        break;
      case '&=':
      case '|=':
      case '^=':
        if (leftType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${leftType.name} at line ${node.lineno}`;
        }
        if (rightType.classNode != Runtime.Integer) {
          throw `Must be integer, but ${rightType.name} at line ${node.lineno}`;
        }
        if (!this.checkType(leftType, rightType)) {
          throw `Type not matched : left => ${leftType.name}, right => ${rightType.name} at line ${node.lineno}`
        }
        break;
    }
  }

  visitSoql(node) {}

  visitReturn(node) {
    if (this.currentMethodNode.returnType.classNode != node.type().classNode) {
      throw `Illegal conversion from ${node.type().name.join('.')} to ${this.currentMethodNode.returnType.name.join('.')} at line ${node.lineno}`
    }
    return node;
  }

  visitString(node) {}

  visitInteger(node) {}

  visitDouble(node) {}

  visitBoolean(node) {}

  visitSwitch(node) {}

  visitTrigger(node) {}

  visitTriggerTiming(node) {}

  visitVariableDeclaration(node) {
    let type = node.type;
    node.declarators.forEach((declarator) => {
      if (!declarator.expression) return;
      const expressionType = declarator.expression.type().classNode;
      if (expressionType && expressionType !== node.type.classNode) {
        throw `Type not matched : variable => ${node.type.classNode.name}, initializer => ${expressionType.name} at line ${node.lineno}`
      }
      declarator.accept(this);
      let env = EnvManager.currentScope();
      env.define(type, declarator.name, new Ast.NullNode());
    });
  }

  visitVariableDeclarator(node) {
    let name = node.name;
    if (EnvManager.localIncludes(name)) {
      throw `duplicate variable name ${name} at line ${node.lineno}`;
    }
  }

  visitWhen(node) {
  
  }

  visitWhile(node) {
    let returnNode;
    for (let i = 0; i < node.statements.length; i++) {
      returnNode = node.statements[i].accept(this);
      if (this.isReturn(returnNode)) {
        if (i < node.statements.length-1) {
          throw `Unreachable statement ${node.statements[i].lineno+1} at line ${node.lineno}`;
        }
      }
    }
  }

  visitBlock(node) {
    let returnNode;
    for (let i = 0; i < node.statements.length; i++) {
      returnNode = node.statements[i].accept(this);
      if (this.isReturn(returnNode)) {
        if (i < node.statements.length-1) {
          throw `Unreachable statement ${node.statements[i].lineno+1} at line ${node.lineno}`;
        }
      }
    }
    return returnNode;
  }

  visitThrow(node) {}

  visitTry(node) {
    node.block.accept(this);
    node.finallyBlock.accept(this);
    node.catchClause.forEach((catchClause) => {
      catchClause.accept(this);
    });
  }

  visitCatch(node) {
    // node.block.accept(this);
  }

  visitSpecialComment(node) {}

  visitUnaryOperator(node) {
    const expressionType = node.expression.type();

    switch(node.op) {
      case '!':
        if (expressionType.classNode !== Runtime.Boolean) {
          throw `Must be Boolean, but ${expressionType.name} at line ${node.lineno}`;
        }
        break;
      case '+':
      case '-':
        if (![Runtime.Integer, Runtime.Double].includes(expressionType.classNode)) {
          throw `Must be integer or double, but ${expressionType.name} at line ${node.lineno}`;
        }
        if (![Runtime.Integer, Runtime.Double].includes(expressionType.classNode)) {
          throw `Must be integer or double, but ${expressionType.name} at line ${node.lineno}`;
        }
        break;
    }
  }

  isReturn(returnNode) {
    return returnNode instanceof Ast.ReturnNode ||
      returnNode instanceof Ast.BreakNode ||
      returnNode instanceof Ast.ContinueNode;
  }

  checkType(leftType, rightType) {
    if (leftType.classNode === null || rightType.classNode === null) return true
    if (leftType.classNode !== rightType.classNode) return false;
    if (leftType.parameters.length === 0 && rightType.parameters.length === 0) return true;
    if (leftType.parameters.length !== rightType.parameters.length) return false;
    for (let i = 0; i < leftType.parameters.length; i++) {
      let leftTypeParameter = leftType.parameters[i];
      let rightTypeParameter = rightType.parameters[i];
      if (!this.checkType(leftTypeParameter, rightTypeParameter)) return false;
    }
    return true;
  }
}

module.exports = ApexBuilder;
