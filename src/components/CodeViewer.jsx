import { useMemo } from 'react';
import { tokenize } from '../utils/highlight';

// Maps token types from the tokenizer to CSS class names
const TYPE_CLASS = {
  keyword: 't-kw',
  fn:      't-fn',
  string:  't-str',
  comment: 't-cm',
};

function HighlightedCode({ code }) {
  const tokens = useMemo(() => tokenize(code), [code]);

  return (
    <pre>
      {tokens.map((token, i) => {
        const cls = TYPE_CLASS[token.type];
        return cls
          ? <span key={i} className={cls}>{token.text}</span>
          : token.text;
      })}
    </pre>
  );
}

export default function CodeViewer({ snippet }) {
  if (!snippet) return null;

  return (
    <div className={`code-viewer${snippet ? ' active' : ''}`}>
      {/* macOS-style traffic lights + filename */}
      <div className="code-header">
        <div className="code-dot" style={{ background: '#ff5f57' }} />
        <div className="code-dot" style={{ background: '#ffbd2e' }} />
        <div className="code-dot" style={{ background: '#28c840' }} />
        <span className="code-filename">{snippet.filename}</span>
      </div>

      {/* One-line description of what this code does */}
      <div className="code-desc">{snippet.description}</div>

      {/* Syntax-highlighted code: React handles HTML escaping */}
      <HighlightedCode code={snippet.code} />
    </div>
  );
}
