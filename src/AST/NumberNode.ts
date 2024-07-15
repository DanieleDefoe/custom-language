import Token from '../Token';
import ExpressionNode from './ExpressionNode';

export default class NumberNode extends ExpressionNode {
  constructor(public number: Token) {
    super();
  }
}
