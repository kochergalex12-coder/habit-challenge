const fs   = require('fs');
const path = require('path');

const dist = 'dist';
if (!fs.existsSync(dist)) fs.mkdirSync(dist);

const config = process.env.FIREBASE_CONFIG || '';
if (!config) {
  console.error('ERROR: FIREBASE_CONFIG environment variable is not set!');
  process.exit(1);
}

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('%%FIREBASE_CONFIG%%', config);
fs.writeFileSync(path.join(dist, 'index.html'), html);

['style.css', 'script.js', '_redirects'].forEach(function(file) {
  if (fs.existsSync(file)) fs.copyFileSync(file, path.join(dist, file));
});

console.log('Build complete.');
