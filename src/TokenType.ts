export default class TokenType {
  constructor(public name: string, public regex: string) {}
}

export const tokenTypesList = {
  NUMBER: new TokenType('NUMBER', '[0-9]*'),
  VARIABLE: new TokenType('VARIABLE', '[а-я]*'),
  SEMICOLON: new TokenType('SEMICOLON', ';'),
  SPACE: new TokenType('SPACE', '[ \\n\\t\\r]'),
  ASSIGN: new TokenType('ASSIGN', 'РАВНО'),
  LOG: new TokenType('LOG', 'КОНСОЛЬ'),
  PLUS: new TokenType('PLUS', 'ПЛЮС'),
  MINUS: new TokenType('MINUS', 'МИНУС'),
  LPAR: new TokenType('LPAR', '\\('),
  RPAR: new TokenType('RPAR', '\\)'),
};
