const fs   = require('fs');
const path = require('path');

const dist = 'dist';
if (!fs.existsSync(dist)) fs.mkdirSync(dist);

const b64 = process.env.FIREBASE_CONFIG_B64 || '';
if (!b64) {
  console.error('ERROR: FIREBASE_CONFIG_B64 environment variable is not set!');
  process.exit(1);
}
const config = Buffer.from(b64, 'base64').toString('utf8');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('%%FIREBASE_CONFIG%%', config);
fs.writeFileSync(path.join(dist, 'index.html'), html);

['style.css', 'script.js', '_redirects'].forEach(function(file) {
  if (fs.existsSync(file)) fs.copyFileSync(file, path.join(dist, file));
});

console.log('Build complete.');
