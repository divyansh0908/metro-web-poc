const { parseSync, transformFromAstSync } = require('@babel/core');
const nullthrows = require('nullthrows');
// Hoisted so it's not re-required on every file transform
const hermesParser = require('hermes-parser');

// Defined once at module level, never changes between transforms
const PRESETS = [
  ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] } }],
  ['@babel/preset-react', { runtime: 'automatic' }],
];

/**
 * Custom Metro Babel transformer.
 *
 * Metro calls this for every JS/JSX file in the dependency graph.
 * It must return { ast, metadata }, NOT { code, map } because Metro
 * owns code generation and needs the raw AST to apply its own passes
 * (module ID assignment, inline requires, etc.) after this runs.
 *
 * Replaces the default metro-babel-transformer, adding web-specific
 * Babel presets (@babel/preset-env + @babel/preset-react) that the
 * default React Native transformer doesn't include.
 */
module.exports.transform = ({ filename, options, plugins, src }) => {
  const parser = options.hermesParser ? 'hermes' : 'babel';
  console.log(
    `[transform] ${filename}\n` +
    `  parser: ${parser} | platform: ${options.platform} | dev: ${options.dev}\n` +
    `  plugins: ${plugins.length} | src: ${src.length} bytes`,
  );

  // Babel config shared between the parse and transform steps.
  // `code: false` + `ast: true` tells Babel to skip code generation
  // Metro will do that itself from the returned AST.
  const babelConfig = {
    ast: true,
    babelrc: options.enableBabelRCLookup, // respect project .babelrc if Metro allows it
    caller: {
      name: 'metro',      // standard Babel caller identifier
      bundler: 'metro',   // Metro-specific extension read by some presets/plugins
      platform: options.platform,
    },
    cloneInputAst: false, // skip defensive clone as we don't reuse the input AST
    code: false,
    cwd: options.projectRoot,
    filename,
    highlightCode: true,
    plugins,   // extra plugins injected by Metro (e.g. inline-requires)
    presets: PRESETS,
    sourceType: 'module',
  };

  // --- Parse ---
  // Metro can use either its own Babel parser or the Hermes parser
  // (Meta's JS engine used in React Native). Hermes is faster but
  // Babel's parser is more flexible for non-RN targets like web.
  const parseStart = Date.now();
  const sourceAst = options.hermesParser
    ? hermesParser.parse(src, { babel: true, sourceType: 'module' })
    : parseSync(src, babelConfig);
  console.log(`  parse: ${Date.now() - parseStart}ms`);

  // --- Transform ---
  // Applies all plugins and presets to the AST.
  // Returns { ast, metadata } metadata carries module dependency info
  // that Metro uses to build the dependency graph.
  const transformStart = Date.now();
  const transformResult = transformFromAstSync(sourceAst, src, babelConfig);
  console.log(`  transform: ${Date.now() - transformStart}ms`);

  return {
    ast: nullthrows(transformResult.ast), // crash fast if Babel somehow returned no AST
    metadata: transformResult.metadata,
  };
};
