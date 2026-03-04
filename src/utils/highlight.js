// Simple left-to-right tokenizer no regex, no dangerouslySetInnerHTML.
// Returns an array of { type, text } objects that CodeViewer renders as
// styled React spans. React handles HTML escaping automatically.

const KEYWORDS = new Set([
  'const', 'let', 'var', 'return', 'if', 'else', 'true', 'false',
  'null', 'undefined', 'require', 'module', 'async', 'await',
  'function', 'export', 'import', 'default', 'from', 'of', 'in',
  'new', 'this', 'try', 'catch', 'throw', 'for', 'while', 'class',
]);

export function tokenize(code) {
  const tokens = [];
  let i = 0;

  while (i < code.length) {
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const text = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: 'comment', text });
      i += text.length;
      continue;
    }

    // Single or double-quoted string
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== q) {
        if (code[j] === '\\') j++; // skip escaped character
        j++;
      }
      tokens.push({ type: 'string', text: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Template literal simplified, doesn't parse ${} expressions
    if (code[i] === '`') {
      let j = i + 1;
      while (j < code.length && code[j] !== '`') {
        if (code[j] === '\\') j++;
        j++;
      }
      tokens.push({ type: 'string', text: code.slice(i, j + 1) });
      i = Math.min(j + 1, code.length);
      continue;
    }

    // Identifier keyword, function call, or plain name
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\w$]/.test(code[j])) j++;
      const word = code.slice(i, j);

      if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', text: word });
      } else if (code[j] === '(') {
        tokens.push({ type: 'fn', text: word });
      } else {
        tokens.push({ type: 'plain', text: word });
      }
      i = j;
      continue;
    }

    // Everything else — punctuation, operators, whitespace
    tokens.push({ type: 'plain', text: code[i] });
    i++;
  }

  return tokens;
}
