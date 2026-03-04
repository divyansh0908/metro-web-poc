// Hoisted required once at startup, not on every bundle/resolve call
const baseJSBundle = require('metro/private/DeltaBundler/Serializers/baseJSBundle').default;
const bundleToString = require('metro/private/lib/bundleToString').default;

module.exports = {
  resolver: {
    // Extensions Metro will treat as JS source files
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
    resolveRequest: (context, moduleName, platform) => {
      console.log(`Resolving: ${moduleName}`);
      return context.resolveRequest(context, moduleName, platform);
    },
  },
  transformer: {
    // Replace Metro's default RN transformer with our web-aware one
    babelTransformerPath: require.resolve('./transformer.js'),
  },
  serializer: {
    // Custom serializer: log bundle contents, then produce the JS output string.
    // baseJSBundle builds a { pre, modules, post } bundle object;
    // bundleToString concatenates it into a single code string.
    customSerializer: async (entryPoint, preModules, graph, options) => {
      console.log(`Bundle contains ${graph.dependencies.size} modules:`);
      for (const m of graph.dependencies.keys()) console.log(' -', m);

      const bundle = baseJSBundle(entryPoint, preModules, graph, options);
      const { code } = bundleToString(bundle);
      return code;
    },
  },
  server: {
    port: 3000,
  },
};
