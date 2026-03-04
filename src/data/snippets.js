// Each snippet maps to a feature card.
// Code strings are the actual source from this project kept short and focused.

export const snippets = {
  transformer: {
    filename: 'transformer.js',
    description: 'Parses and transforms every source file. Returns { ast, metadata } but not { code } because Metro owns code generation.',
    code: `const { parseSync, transformFromAstSync } = require('@babel/core');

const PRESETS = [
  ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
  ['@babel/preset-react', { runtime: 'automatic' }],
];

module.exports.transform = ({ filename, options, plugins, src }) => {
  const babelConfig = {
    ast: true,
    code: false,       // Metro generates code itself from the AST
    caller: { name: 'metro', bundler: 'metro', platform: options.platform },
    plugins,           // extra plugins injected by Metro
    presets: PRESETS,
    sourceType: 'module',
  };

  const sourceAst = options.hermesParser
    ? hermesParser.parse(src, { babel: true, sourceType: 'module' })
    : parseSync(src, babelConfig);

  const result = transformFromAstSync(sourceAst, src, babelConfig);

  return {
    ast: nullthrows(result.ast),   // crash fast if Babel returns nothing
    metadata: result.metadata,     // carries module dependency info
  };
};`,
  },

  serializer: {
    filename: 'metro.config.js',
    description: "Intercepts every bundle build. Logs the full module graph, then delegates to Metro's internal bundler.",
    code: `// Hoisted, required once, not on every bundle request
const baseJSBundle =
  require('metro/private/DeltaBundler/Serializers/baseJSBundle').default;
const bundleToString =
  require('metro/private/lib/bundleToString').default;

customSerializer: async (entryPoint, preModules, graph, options) => {
  // graph.dependencies is a Map<path, Module>
  console.log('Bundle contains ' + graph.dependencies.size + ' modules:');
  for (const m of graph.dependencies.keys()) console.log(' -', m);

  // baseJSBundle => { pre: string, modules: [id, code][], post: string }
  const bundle = baseJSBundle(entryPoint, preModules, graph, options);

  // bundleToString concatenates pre + modules + post into one string
  const { code } = bundleToString(bundle);
  return code;
},`,
  },

  hmr: {
    filename: 'public/index.html',
    description: "Connects to Metro's /hot WebSocket. On file change, Metro sends only the changed modules, no full page reload.",
    code: `const ws = new WebSocket('ws://localhost:3000/hot');

ws.onopen = () => {
  // Tell Metro which bundle to watch for changes
  ws.send(JSON.stringify({
    type: 'register-entrypoints',
    entryPoints: ['http://localhost:3000/src/index.jsx.bundle?platform=web&dev=true'],
  }));
};

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);

  if (data.type === 'update') {
    // Metro sends a delta: only added + modified modules
    // eval() re-registers them in Metro's module registry (__d)
    [...data.body.added, ...data.body.modified]
      .forEach(({ module: [, code] }) => eval(code));
  }

  if (data.type === 'error') {
    console.error('[HMR]', data.body.type, data.body.message);
  }
};`,
  },

  resolver: {
    filename: 'metro.config.js',
    description: 'Hooks into every module resolution. Use it to log, alias paths, mock packages, or redirect imports.',
    code: `resolver: {
  sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],

  resolveRequest: (context, moduleName, platform) => {
    console.log('Resolving: ' + moduleName);

    // Delegate to Metro's default resolver.
    // You can intercept here to:
    //   - alias:  if (moduleName === 'lodash') return resolve('lodash-es')
    //   - mock:   if (moduleName === 'fs') return { type: 'empty' }
    //   - redirect based on platform
    return context.resolveRequest(context, moduleName, platform);
  },
},`,
  },

  parser: {
    filename: 'transformer.js',
    description: "Metro supports two parsers. Hermes is faster (used in React Native). Babel's parser is more flexible for web targets.",
    code: `// options.hermesParser is set by Metro based on the platform/config
const sourceAst = options.hermesParser

  // Hermes parser: faster, designed for React Native's JS engine
  ? hermesParser.parse(src, {
      babel: true,         // emit Babel-compatible AST node types
      sourceType: 'module',
    })

  // Babel parser supports all ES proposals, better for web
  : parseSync(src, babelConfig);

// Both paths produce a Babel-compatible AST.
// transformFromAstSync consumes either without modification.`,
  },

  cache: {
    filename: 'dev.js',
    description: 'Metro caches every transform to disk keyed on file hash + config hash. loadConfig() ignores process.argv pass flags explicitly.',
    code: `// ⚠️  loadConfig() does NOT read process.argv automatically.
//     You must forward CLI flags yourself.

const config = await Metro.loadConfig({
  resetCache: process.argv.includes('--reset-cache'),
});

// Without this, --reset-cache in package.json scripts is silently
// ignored. The transform cache persists across server restarts,
// so your transformer never runs, and its logs never appear.

// Metro stores the cache in the OS temp dir:
//   /tmp/metro-cache-<hash>/
// keyed on: sha1(file content) + sha1(transformer config)`,
  },
};

// Order used for FeatureCards rendering
export const FEATURE_ORDER = [
  'transformer',
  'serializer',
  'hmr',
  'resolver',
  'parser',
  'cache',
];
