const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

http.createServer(function(req, res) {
  // Strip query string so ?group=XYZ doesn't break path resolution
  const urlPath  = req.url.split('?')[0];
  const ext      = path.extname(urlPath);

  // If the request has a known static extension, serve that file directly.
  // Otherwise (no extension or unknown), always serve index.html — this lets
  // the JS in the page handle ?group= and other query params on the client side.
  const isStatic = ext && MIME[ext];
  const filePath = isStatic
    ? path.join(__dirname, urlPath)
    : path.join(__dirname, 'index.html');

  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const mime = MIME[path.extname(filePath)] || 'text/plain';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}).listen(PORT, function() {
  console.log('');
  console.log('  HabitQuest is running!');
  console.log('');
  console.log('  Open this in your browser:');
  console.log('  --> http://localhost:' + PORT);
  console.log('');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});
