import Token from '../Token';
import ExpressionNode from './ExpressionNode';

export default class VariableNode extends ExpressionNode {
  constructor(public variable: Token) {
    super();
  }
}
