import Token from '../Token';
import ExpressionNode from './ExpressionNode';

export default class BinOperationNode extends ExpressionNode {
  constructor(
    public operator: Token,
    public leftNode: ExpressionNode,
    public rightNode: ExpressionNode
  ) {
    super();
  }
}
