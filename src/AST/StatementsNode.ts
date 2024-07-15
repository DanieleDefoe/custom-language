import ExpressionNode from './ExpressionNode';

export default class StatementsNode extends ExpressionNode {
  constructor(public codeStrings: ExpressionNode[] = []) {
    super();
  }

  addNode(node: ExpressionNode) {
    this.codeStrings.push(node);
  }
}
