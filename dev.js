const Metro = require('metro');
const express = require('express');
const http = require('http');
const path = require('path');

async function main() {
  const app = express();
  const server = http.Server(app);
  const config = await Metro.loadConfig({
    resetCache: process.argv.includes('--reset-cache'),
  });

  const { middleware, attachHmrServer } = await Metro.createConnectMiddleware(config, {
    port: 3000,
  });
  app.use(middleware);
  attachHmrServer(server);

  // Serve HTML shell
  app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
  });


  server.listen(3000, () => console.log('Dev server running at http://localhost:3000'));
}

main().catch(console.error);