import TokenType from './TokenType';

export default class Token {
  constructor(
    public type: TokenType,
    public text: string,
    public pos: number
  ) {}
}
