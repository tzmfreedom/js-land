const Ast = require('./node/ast');
const ApexClassStore = require('./apexClass').ApexClassStore;
const methodSearcher = require('./methodSearcher');
const EnvManager = require('./envManager');
const TypeSearcher = require('./typeSearcher');

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
          // TODO: lineno
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
        // TODO: lineno
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
      Object.keys(methods).forEach((parameterHash) => {
        let methodNode = methods[parameterHash];
        let env = {};
        methodNode.parameters.forEach((parameter) => {
          env[parameter.name] = parameter.type;
        });
        EnvManager.pushScope(env, null);
        methods[parameterHash].accept(this);
        EnvManager.popScope();
      });
    });

    let newObject = this.createObject(node.name);
    let instanceMethods = node.instanceMethods;
    Object.keys(node.instanceMethods).forEach((methodName) => {
      let methods = instanceMethods[methodName];
      Object.keys(methods).forEach((parameterHash) => {
        let methodNode = methods[parameterHash];
        let env = { this: newObject };
        methodNode.parameters.forEach((parameter) => {
          env[parameter.name] = parameter.type;
        });
        EnvManager.pushScope(env, null);
        methods[parameterHash].accept(this);
        EnvManager.popScope();
      });
    });

    Object.keys(node.staticFields).forEach((fieldName) => {
      const staticField = node.staticFields[fieldName];
      // staticField.type;
      // staticField.expression.accept(this);
    });

    Object.keys(node.instanceFields).forEach((fieldName) => {
      const instanceField = node.instanceFields[fieldName];
      // instanceField.type;
      // instanceField.expression.accept(this);
    });
  }

  visitMethodDeclaration(node) {
    this.validateModifierDuplication(node);
    // returnType Check
    if (node.returnType != 'void'){
      let returnType;
      if (node.returnType.name.length == 1) {
        returnType = ApexClassStore.get(node.returnType.name.join('.'));
      } else {
        const names = node.returnType.name;
        // console.log(ApexClassStore.get(names[0]))
        returnType = ApexClassStore.get(names[0]).innerClasses[names[1]];
      }
      if (!returnType) {
        // TODO: lineno
        throw `Invalid return type ${node.returnType} at line ${node.lineno}`;
      }
    }
    this.validateParameter(node);

    node.statements.accept(this);
    return node;
  }

  createObject(className) {
    let classInfo = ApexClassStore.get(className);
    let instanceFields = {};
    // console.log(classInfo)
    Object.keys(classInfo.instanceFields).forEach((fieldName) => {
      instanceFields[fieldName] = classInfo.instanceFields[fieldName].expression.accept(this);
    });
    const classNode = ApexClassStore.get(className);
    return new Ast.ApexObjectNode(classNode, instanceFields);
  }

  visitFieldDeclaration(node) {

  }

  visitFieldDeclarator(node) {

  }


  visitAnnotation(node) {
    return node;
  }

  visitInteger(node) {
    return node;
  }

  visitParameter(node) {
    return node;
  }

  visitArrayAccess(node) {
  
  }

  visitApexObject(node) {
    return node;
  }

  visitBoolean(node) {
    return node;
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

  visitDouble(node) {
    return node;
  }

  visitFor(node) {
    EnvManager.pushScope({});

    let forControl = node.forControl;
    forControl.forInit.accept(this);
    forControl.forUpdate.forEach((statement) => { statement.accept(this) });

    let condition = forControl.expression.accept(this);
    if (!condition instanceof Ast.BooleanNode) {
      throw `Should be boolean expression at line ${condition.lineno}`;
    }
    node.statements.accept(this);

    EnvManager.popScope();
    return node;
  }

  visitIf(node) {
    let condition = node.condition.accept(this);
    if (!condition instanceof Ast.BooleanNode) {
      throw `Should be boolean expression at line ${condition.lineno}`;
    }
    node.ifStatement.accept(this);
    if (node.elseStatement) node.elseStatement.accept(this);

    return node;
  }

  visitMethodInvocation(node) {
    let searchResult = methodSearcher.searchMethod(node);
    searchResult.methodNode = searchResult.methodNode[Object.keys(searchResult.methodNode)[0]];
    let env = { this: searchResult.receiverNode };
    for (let i = 0; i < searchResult.methodNode.parameters.length; i++) {
      let parameter = searchResult.methodNode.parameters[i];
      let value = node.parameters[i];
      env[parameter.name] = value;
    }
    let parameters = node.parameters.map((parameter) => { return parameter.accept(this); });

    if (searchResult.methodNode.nativeFunction) {
      return searchResult.methodNode.returnType;
    } else {
      EnvManager.pushScope(env, null);
      let returnValue = searchResult.methodNode.statements.accept(this);
      EnvManager.popScope();
    }
  }

  visitName(node) {
    let values = methodSearcher.searchField(node);
    if (values) return values;
    throw `Variable not declaration : ${node.value.join('.')} at line ${node.lineno}`
  }

  visitNew(node) {
    const classNode = TypeSearcher.search(node.type);
    node.typeClassNode = classNode;

    const instanceFields = {};
    Object.keys(classNode.instanceFields).map((fieldName) => {
      const field = classNode.instanceFields[fieldName];
      instanceFields[fieldName] = {
        type: field.type,
        value: field.expression.accept(this),
      }
    });
    return new Ast.ApexObjectNode(classNode, instanceFields);
  }

  visitNull(node) {
    return node;
  }

  visitUnaryOperator(node) {
    return new Ast.IntegerNode();
  }

  visitBinaryOperator(node) {
    let left, right;
    let leftType, rightType;
    left = node.left.accept(this);
    if (node.left instanceof Ast.NameNode) {
      if (left.key) {
        leftType = left.receiverNode.instanceFields[left.key].type.toName();
      } else {
        leftType = EnvManager.get(left.receiverNode).type.toName();
      }
    } else {
      leftType = left.type();
    }
    right = node.right.accept(this);
    if (node.right instanceof Ast.NameNode) {
      if (right.key) {
        rightType = right.receiverNode.instanceFields[right.key].type.toName();
      } else {
        rightType = EnvManager.get(right.receiverNode).type.toName();
      }
    } else {
      rightType = right.type();
    }

    switch(node.type) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
      case '<<<':
      case '<<':
      case '>>>':
      case '>>':
        if (leftType != 'Integer' && leftType != 'Double') {
          throw `Must be integer or double, but ${leftType} at line ${node.lineno}`;
        }
        if (rightType != 'Integer' && rightType != 'Double') {
          throw `Must be integer or double, but ${rightType} at line ${node.lineno}`;
        }
        return left;
      case '&':
      case '|':
      case '^':
        if (leftType != 'Integer') {
          throw `Must be integer, but ${leftType} at line ${node.lineno}`;
        }
        if (rightType != 'Integer') {
          throw `Must be integer, but ${rightType} at line ${node.lineno}`;
        }
        return left;
      case '<':
      case '>':
      case '<=':
      case '>=':
      case '==':
      case '===':
      case '!=':
      case '!==':
        if (leftType != rightType) {
          throw `Type not matched : left => ${leftType}, right => ${rightType} at line ${node.lineno}`
        }
        return left;
      case '=':
      case '+=':
      case '-=':
      case '*=':
      case '/=':
      case '%=':
        if (leftType != rightType) {
          throw `Type not matched : left => ${leftType}, right => ${rightType} at line ${node.lineno}`
        }
        return left;
      case '&=':
      case '|=':
      case '^=':
        if (leftType != 'Integer') {
          throw `Must be integer, but ${leftType} at line ${node.lineno}`;
        }
        if (rightType != 'Integer') {
          throw `Must be integer, but ${rightType} at line ${node.lineno}`;
        }
        if (leftType != rightType) {
          throw `Type not matched : left => ${leftType}, right => ${rightType} at line ${node.lineno}`
        }
        return left;
    }
  }

  visitCastExpression(node) {
    // TODO: check extends or implementation
    const castType = TypeSearcher.search(node.type);
    const obj = new Ast.ApexObjectNode();
    obj.classNode = castType;
    return obj;
  }

  visitReturn(node) {
    return node
  }

  visitSoql(node) {
    // TODO: parse node and extract object
    const listClassInfo = ApexClassStore.get('List');
    const objectClassInfo = ApexClassStore.get('Account');
    const obj = new Ast.ApexObjectNode();
    obj.classNode = listClassInfo;
    obj.genericType = objectClassInfo;
    return obj;
  }

  visitString(node) {
    return new Ast.StringNode();
  }

  visitSwitch(node) {
  
  }

  visitTrigger(node) {
  
  }

  visitTriggerTiming(node) {
  
  }

  visitType(node) {
    return node;
  }

  visitVariableDeclaration(node) {
    let type = node.type;
    node.declarators.forEach((declarator) => {
      let decl = declarator.accept(this);

      if (decl.expression && !this.checkType(type, decl.expression)) {
        throw `Type not matched : variable => ${type.name.join('.')}, initializer => ${decl.expression.type()} at line ${node.lineno}`
      }
      let env = EnvManager.currentScope();
      env.define(type, declarator.name, decl.expression ? decl.expression.accept(this) : new Ast.NullNode());
    });
  }

  visitVariableDeclarator(node) {
    let name = node.name;
    let expression = node.expression ? node.expression.accept(this) : null;
    if (EnvManager.localIncludes(name)) {
      throw `duplicate variable name ${name} at line ${node.lineno}`;
    }
    return { name, expression };
  }

  visitWhen(node) {
  
  }

  visitWhile(node) {
  
  }

  visitBlock(node) {
    let returnNode;
    for (let i = 0; i < node.statements.length; i++) {
      returnNode = node.statements[i].accept(this);
      if (
        returnNode instanceof Ast.ReturnNode ||
        returnNode instanceof Ast.BreakNode ||
        returnNode instanceof Ast.ContinueNode
      ) {
        break;
      }
    }
  }

  checkType(left, right) {
    if (right instanceof Ast.NullNode) return true;
    if (left.name.join('.') !== right.type()) return false;
    if (!left.parameters || !right.genericType) return true;
    for (let i = 0; i < left.parameters.length; i++) {
      let leftParameter = left.parameters[i];
      let rightParameter = right.genericType[i];
      if (!this.checkType(leftParameter, rightParameter)) return false;
    }
    return true;
  }
}

module.exports = ApexBuilder;
