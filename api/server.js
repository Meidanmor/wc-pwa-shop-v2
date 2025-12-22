const path = require('path');

// We use path.resolve to make sure Vercel finds the folder we 'included' above
const serverPath = path.resolve(__dirname, '../dist/ssr/index.js');
const server = require(serverPath);

// Quasar SSR exports the Express 'app'. Vercel needs that exported.
module.exports = server;