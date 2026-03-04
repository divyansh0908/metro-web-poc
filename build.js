const Metro = require('metro');
const fs = require('fs');
const path = require('path');

async function main() {
  const config = await Metro.loadConfig({
    resetCache: process.argv.includes('--reset-cache'),
  });

  const outDir = path.resolve('dist');
  fs.mkdirSync(outDir, { recursive: true });

  console.log('Building bundle…');
  await Metro.runBuild(config, {
    entry: 'src/index.jsx',
    platform: 'web',
    dev: false,
    minify: true,
    out: path.join(outDir, 'bundle.js'),
  });
  console.log('Bundle written to dist/bundle.js');

  // Copy index.html: swap the dev bundle URL and strip the HMR <script> block
  const html = fs.readFileSync(path.resolve('public/index.html'), 'utf8');
  const built = html
    .replace(/src="[^"]*\.bundle[^"]*"/, 'src="bundle.js"')
    .replace(/<script>\s*const ws[\s\S]*?<\/script>\n?/, '');
  fs.writeFileSync(path.join(outDir, 'index.html'), built);
  console.log('HTML written to dist/index.html');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
