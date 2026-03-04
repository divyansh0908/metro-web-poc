export const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0d1117;
    color: #e6edf3;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    min-height: 100vh;
  }

  /* ── Hero ── */
  .hero {
    padding: 64px 32px 48px;
    text-align: center;
    border-bottom: 1px solid #21262d;
  }
  .hero-badge {
    display: inline-block;
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 12px;
    color: #8b949e;
    margin-bottom: 20px;
    letter-spacing: 0.5px;
  }
  .hero h1 {
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1.1;
    background: linear-gradient(135deg, #e6edf3 0%, #8b949e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
  }
  .hero h1 span {
    background: linear-gradient(135deg, #58a6ff, #a371f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .hero p {
    color: #8b949e;
    font-size: 18px;
    max-width: 540px;
    margin: 0 auto 32px;
    line-height: 1.6;
  }
  .hmr-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #0d2d1a;
    border: 1px solid #238636;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    color: #3fb950;
  }
  .hmr-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #3fb950;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  /* ── Layout ── */
  .main { max-width: 1100px; margin: 0 auto; padding: 48px 32px; }
  .section-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #8b949e;
    margin-bottom: 16px;
  }

  /* ── Pipeline ── */
  .pipeline {
    display: flex;
    align-items: center;
    margin-bottom: 48px;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  .pipeline-step {
    flex: 1;
    min-width: 120px;
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 10px;
    padding: 20px 12px;
    text-align: center;
    transition: border-color 0.2s;
    cursor: default;
  }
  .pipeline-step:hover { border-color: #58a6ff; }
  .pipeline-step .icon { font-size: 26px; margin-bottom: 8px; }
  .pipeline-step .label { font-size: 13px; font-weight: 600; color: #e6edf3; margin-bottom: 4px; }
  .pipeline-step .sub   { font-size: 11px; color: #8b949e; }
  .pipeline-arrow { color: #30363d; font-size: 18px; padding: 0 4px; flex-shrink: 0; }

  /* ── Stats ── */
  .counter-row { display: flex; gap: 16px; margin-bottom: 48px; }
  .counter-card {
    flex: 1;
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 10px;
    padding: 20px 24px;
    text-align: center;
  }
  .counter-card .num {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -1px;
    color: #58a6ff;
    font-variant-numeric: tabular-nums;
  }
  .counter-card .desc { font-size: 12px; color: #8b949e; margin-top: 4px; }

  /* ── Feature cards + code viewer ── */
  .explorer {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 16px;
    margin-bottom: 48px;
    align-items: start;
  }
  @media (max-width: 768px) {
    .explorer { grid-template-columns: 1fr; }
    .counter-row { flex-wrap: wrap; }
  }

  .cards { display: flex; flex-direction: column; gap: 8px; }
  .card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 10px;
    padding: 16px 18px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    user-select: none;
  }
  .card:hover { border-color: #30363d; }
  .card.active {
    border-color: #58a6ff;
    background: #0d1f33;
  }
  .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .card-icon {
    width: 32px; height: 32px;
    border-radius: 7px;
    background: #1c2128;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .card h3 { font-size: 13px; font-weight: 600; color: #e6edf3; }
  .card p  { font-size: 12px; color: #8b949e; line-height: 1.5; }

  /* ── Code viewer ── */
  .code-viewer {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 10px;
    overflow: hidden;
    position: sticky;
    top: 24px;
    transition: border-color 0.15s;
  }
  .code-viewer.active { border-color: #58a6ff33; }
  .code-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid #21262d;
    background: #0d1117;
  }
  .code-dot { width: 12px; height: 12px; border-radius: 50%; }
  .code-filename { font-size: 12px; color: #8b949e; margin-left: 4px; font-family: monospace; }
  .code-desc {
    padding: 10px 16px;
    border-bottom: 1px solid #21262d;
    font-size: 12px;
    color: #8b949e;
    line-height: 1.5;
    background: #0d1117;
  }
  pre {
    padding: 20px;
    font-size: 12.5px;
    font-family: 'SF Mono', 'Fira Mono', 'Cascadia Code', monospace;
    overflow-x: auto;
    line-height: 1.75;
    color: #e6edf3;
    max-height: 480px;
    overflow-y: auto;
  }

  /* Syntax token colours */
  .t-kw  { color: #ff7b72; }
  .t-fn  { color: #d2a8ff; }
  .t-str { color: #a5d6ff; }
  .t-cm  { color: #8b949e; }

  /* ── Footer ── */
  footer {
    text-align: center;
    padding: 32px;
    border-top: 1px solid #21262d;
    font-size: 12px;
    color: #8b949e;
  }
`;
