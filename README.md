# Metro as a Web Bundler — POC

A proof of concept that uses [Metro](https://metrobundler.dev/) — React Native's bundler — to bundle a React web app. No webpack, no Vite, no Parcel.

**Repository:** [github.com/divyansh0908/metro-web-poc](https://github.com/divyansh0908/metro-web-poc)
**Live demo:** [divyansh0908.github.io/metro-web-poc](https://divyansh0908.github.io/metro-web-poc/)

## Why

Metro's pipeline is a set of well-defined, replaceable hooks: resolver → transformer → serializer. This POC wires up web-specific config at each stage and runs a full React 19 app with HMR in the browser.

---

## Project Structure

```
metro-test/
├── public/
│   └── index.html          # HTML shell + HMR WebSocket client (dev only)
├── src/
│   ├── index.jsx            # Entry point
│   ├── App.jsx              # Root component
│   ├── styles.js            # Shared CSS string
│   ├── data/
│   │   └── snippets.js      # Code snippets shown in the UI
│   ├── utils/
│   │   └── highlight.js     # Left-to-right JS tokenizer (no dangerouslySetInnerHTML)
│   └── components/
│       ├── Hero.jsx
│       ├── HmrIndicator.jsx
│       ├── Pipeline.jsx
│       ├── Stats.jsx
│       ├── FeatureCards.jsx
│       └── CodeViewer.jsx
├── transformer.js           # Custom Metro Babel transformer
├── metro.config.js          # Resolver + serializer config
├── dev.js                   # Metro dev server with HMR
└── build.js                 # Static production build
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Metro dev server at `http://localhost:3000` with HMR |
| `npm run build` | Produce a minified static bundle in `dist/` |
| `npm run preview` | Serve `dist/` locally to verify the production build |

---

## How It Works

### Stage 1 — Resolver

Metro resolves every `import` before transforming anything. Two things are needed for web:

- **`sourceExts`**: add `jsx` so Metro recognises `.jsx` files
- **`resolveRequest`**: hook to log, alias, mock, or redirect any import

```js
// metro.config.js
resolver: {
  sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
  resolveRequest: (context, moduleName, platform) => {
    return context.resolveRequest(context, moduleName, platform);
  },
},
```

### Stage 2 — Transformer

Metro's default transformer is built for React Native. We replace it via `babelTransformerPath` to add `@babel/preset-env` (browser targets) and `@babel/preset-react` (JSX).

**The contract is strict: return `{ ast, metadata }`, not `{ code, map }`.**
Metro owns code generation. It takes the AST and applies its own passes (module ID assignment, inline requires) before emitting JS.

```js
// transformer.js
module.exports.transform = ({ filename, options, plugins, src }) => {
  const babelConfig = {
    ast: true,
    code: false,  // Metro generates code itself
    presets: PRESETS,
    plugins,      // extra plugins injected by Metro
    sourceType: 'module',
  };

  const sourceAst = options.hermesParser
    ? hermesParser.parse(src, { babel: true, sourceType: 'module' })
    : parseSync(src, babelConfig);

  const result = transformFromAstSync(sourceAst, src, babelConfig);
  return { ast: nullthrows(result.ast), metadata: result.metadata };
};
```

Wire it up:

```js
// metro.config.js
transformer: {
  babelTransformerPath: require.resolve('./transformer.js'),
},
```

### Stage 3 — Serializer

Once all modules are transformed, Metro passes the full dependency graph to the serializer. We use Metro's internal `baseJSBundle` + `bundleToString` to produce a web-compatible JS string.

```js
// metro.config.js
const baseJSBundle =
  require('metro/private/DeltaBundler/Serializers/baseJSBundle').default;
const bundleToString =
  require('metro/private/lib/bundleToString').default;

customSerializer: async (entryPoint, preModules, graph, options) => {
  const bundle = baseJSBundle(entryPoint, preModules, graph, options);
  const { code } = bundleToString(bundle);
  return code;
},
```

> **Note:** Use `metro/private/...` paths — not `metro/src/...`. Metro's `package.json` exports map is `"./private/*": "./src/*.js"`. Using `metro/src/` directly throws `ERR_PACKAGE_PATH_NOT_EXPORTED`.

### Stage 4 — HMR

Metro ships a built-in HMR server that sends delta bundles over WebSocket — only changed modules, no full reload.

**Server-side (`dev.js`):**

```js
const { middleware, attachHmrServer } =
  await Metro.createConnectMiddleware(config, { port: 3000 });

app.use(middleware);
attachHmrServer(server);
```

**Client-side (`public/index.html`, dev only):**

```js
const ws = new WebSocket('ws://localhost:3000/hot');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'register-entrypoints',
    entryPoints: ['http://localhost:3000/src/index.jsx.bundle?platform=web&dev=true'],
  }));
};

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  if (data.type === 'update') {
    [...data.body.added, ...data.body.modified]
      .forEach(({ module: [, code] }) => eval(code));
  }
};
```

Metro sends `added` and `modified` modules as JS strings. `eval()` re-registers them in Metro's module runtime (`__d`). The HMR block is stripped from `dist/index.html` at build time.

---

## Production Build

```js
// build.js
await Metro.runBuild(config, {
  entry: 'src/index.jsx',
  platform: 'web',
  dev: false,
  minify: true,
  out: 'dist/bundle.js',
});
```

`build.js` also copies `public/index.html` to `dist/`, replacing the dev bundle URL with `bundle.js` and removing the HMR `<script>` block.

---

## Known Gotchas

**`Metro.loadConfig()` ignores `process.argv`**
Pass flags explicitly, otherwise `--reset-cache` in your npm script is silently ignored and Metro serves from its disk cache:

```js
const config = await Metro.loadConfig({
  resetCache: process.argv.includes('--reset-cache'),
});
```

**Transform logs may not appear on first run**
Metro caches every transform keyed on `sha1(file content) + sha1(transformer config)`. If the cache is warm, your transformer never executes. Run with `--reset-cache` to force a cold build.

**Worker stdout routing**
With `maxWorkers > 1`, Metro runs transforms in `jest-worker` child processes. `console.log` from the transformer goes through Metro's `TerminalReporter` as `worker_stdout_chunk` — it still appears in the terminal, but may be interleaved with other output.

---

## Dependencies

| Package | Role |
|---|---|
| `metro` | Bundler — resolver, transformer, serializer, HMR server |
| `@babel/core` | `parseSync` + `transformFromAstSync` used in the custom transformer |
| `@babel/preset-env` | Transpile modern JS to browser-compatible output |
| `@babel/preset-react` | JSX → `react/jsx-runtime` calls (`runtime: 'automatic'`) |
| `express` | HTTP server shell for the Metro middleware |
| `react` / `react-dom` | UI runtime |
