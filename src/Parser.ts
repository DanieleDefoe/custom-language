import BinOperationNode from './AST/BinOperationNode';
import ExpressionNode from './AST/ExpressionNode';
import NumberNode from './AST/NumberNode';
import StatementsNode from './AST/StatementsNode';
import UnaryOperationNode from './AST/UnaryOperationNode';
import VariableNode from './AST/VariableNode';
import Token from './Token';
import TokenType, { tokenTypesList } from './TokenType';

interface IScope<Value = string> {
  [variableName: string]: Value;
}

export default class Parser {
  constructor(
    public tokens: Token[],
    public pos: number = 0,
    public scope: IScope = {}
  ) {}

  match(...expected: TokenType[]): Token | null {
    if (this.pos < this.tokens.length) {
      const currentToken = this.tokens[this.pos];
      if (expected.find((type) => type.name === currentToken.type.name)) {
        this.pos += 1;
        return currentToken;
      }
    }
    return null;
  }

  require(...expected: TokenType[]): Token {
    const token = this.match(...expected);
    if (!token) {
      throw new Error(
        `Expected ${expected[0].name} to be in position ${this.pos}`
      );
    }
    return token;
  }

  parseParentheses(): ExpressionNode {
    if (this.match(tokenTypesList.LPAR) !== null) {
      const node = this.parseFormula();
      this.require(tokenTypesList.RPAR);
      return node;
    } else {
      return this.parseVariableOrNumber();
    }
  }

  parseFormula(): ExpressionNode {
    let leftNode = this.parseParentheses();
    let operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
    while (operator !== null) {
      let rightNode = this.parseParentheses();
      leftNode = new BinOperationNode(operator, leftNode, rightNode);
      operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
    }
    return leftNode;
  }

  parseVariableOrNumber(): ExpressionNode {
    const number = this.match(tokenTypesList.NUMBER);
    if (number !== null) {
      return new NumberNode(number);
    }
    const variable = this.match(tokenTypesList.VARIABLE);
    if (variable !== null) {
      return new VariableNode(variable);
    }
    throw new Error(`a Number or Variable is expected at ${this.pos} position`);
  }

  parsePrint(): ExpressionNode {
    const operatorLog = this.match(tokenTypesList.LOG);
    if (operatorLog !== null) {
      return new UnaryOperationNode(operatorLog, this.parseFormula());
    }
    throw new Error(`CONSOLE is expected at ${this.pos} position`);
  }

  parseExpression(): ExpressionNode {
    if (this.match(tokenTypesList.VARIABLE) === null) {
      const printNode = this.parsePrint();
      return printNode;
    }
    this.pos -= 1;
    const variableNode = this.parseVariableOrNumber();
    const assignOperator = this.match(tokenTypesList.ASSIGN);
    if (assignOperator !== null) {
      const rightFormulaNode = this.parseFormula();
      const binaryNode = new BinOperationNode(
        assignOperator,
        variableNode,
        rightFormulaNode
      );
      return binaryNode;
    }
    throw new Error(
      `After variable name assign operator is required at position ${this.pos}`
    );
  }

  parseCode(): ExpressionNode {
    const root = new StatementsNode();
    while (this.pos < this.tokens.length) {
      const codeStringNode = this.parseExpression();
      this.require(tokenTypesList.SEMICOLON);
      root.addNode(codeStringNode);
    }
    return root;
  }

  run(node: ExpressionNode): any {
    if (node instanceof NumberNode) {
      return parseInt(node.number.text);
    }
    if (node instanceof UnaryOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.LOG.name:
          console.log(this.run(node.operand));
          return;
      }
    }
    if (node instanceof BinOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.PLUS.name:
          return this.run(node.leftNode) + this.run(node.rightNode);
        case tokenTypesList.MINUS.name:
          return this.run(node.leftNode) - this.run(node.rightNode);
        case tokenTypesList.ASSIGN.name:
          const result = this.run(node.rightNode);
          const variableNode = <VariableNode>node.leftNode;
          this.scope[variableNode.variable.text] = result;
          return result;
      }
    }
    if (node instanceof VariableNode) {
      if (this.scope[node.variable.text]) {
        return this.scope[node.variable.text];
      } else {
        throw new Error(
          `Reference error: variable ${node.variable.text} is not found`
        );
      }
    }
    if (node instanceof StatementsNode) {
      node.codeStrings.forEach((codeStrings) => {
        this.run(codeStrings);
      });
      return;
    }
    throw new Error('Runtime error!');
  }
}
