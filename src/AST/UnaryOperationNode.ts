import Token from '../Token';
import ExpressionNode from './ExpressionNode';

export default class UnaryOperationNode extends ExpressionNode {
  constructor(public operator: Token, public operand: ExpressionNode) {
    super();
  }
}
