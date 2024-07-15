import Token from './Token';
import { tokenTypesList } from './TokenType';

export default class Lexer {
  constructor(
    public code: string,
    public pos: number = 0,
    public tokenList: Token[] = []
  ) {}

  lexAnalysis(): Token[] {
    while (this.nextToken()) {}
    this.tokenList = this.tokenList.filter(
      (token) => token.type.name !== tokenTypesList.SPACE.name
    );
    return this.tokenList;
  }

  nextToken(): boolean {
    if (this.pos >= this.code.length) {
      return false;
    }
    const tokenTypesValues = Object.values(tokenTypesList);
    for (const tokenType of tokenTypesValues) {
      const regex = new RegExp(`^${tokenType.regex}`);
      const result = this.code.substring(this.pos).match(regex);
      if (result?.[0]) {
        const token = new Token(tokenType, result[0], this.pos);
        this.pos += result[0].length;
        this.tokenList.push(token);
        return true;
      }
    }
    throw new Error(`Syntax error at ${this.pos} occurred`);
  }
}
