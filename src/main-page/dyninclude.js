import {Lexer} from 'pug-lexer';

const interpolate = (origTok, locals) => {
  const lexer = new Lexer(origTok.val, {
    startingLine: origTok.line,
    startingColumn: origTok.col
  });

  lexer.addText('text', origTok.val);

  return lexer.tokens.reduce((str, tok) => {
    if (tok.type === 'text') {
      str += tok.val;
    } else if (tok.type === 'interpolated-code') {
      if (locals[tok.val] === null || locals[tok.val] === undefined) {
        lexer.colno = tok.col;
        lexer.error('DYNINCLUDE_UNDEFINED_VARIABLE', `Variable "${tok.val}" is not defined`);
      } else {
        str += locals[tok.val];
      }
    } else {
      lexer.colno = tok.col;
      lexer.error('DYNINCLUDE_INVALID_TOKEN', `Unexpected token "${tok.type}"`);
    }

    return str;
  }, '');
};

export default (locals = {}) => {
  return {
    lex: {
      path(lexer) {
        const tok = lexer.scanEndOfLine(/^ ([^\n]+)/, 'path');
        if (tok && (tok.val = tok.val.trim())) {
          try {
            tok.val = interpolate(tok, locals);
          } catch (err) {
            if (err.code && err.code.startsWith('PUG:')) {
              lexer.colno = err.column;
              lexer.error(err.code.substr(4), err.msg);
            }

            throw err;
          }

          lexer.tokens.push(tok);
          return true;
        }
      }
    }
  };
};
