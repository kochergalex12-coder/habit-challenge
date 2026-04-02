const fs   = require('fs');
const path = require('path');

const dist = 'dist';
if (!fs.existsSync(dist)) fs.mkdirSync(dist);

// Inject Firebase API key into index.html
const apiKey = process.env.FIREBASE_API_KEY || '';
if (!apiKey) console.warn('Warning: FIREBASE_API_KEY env var is not set.');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('%%FIREBASE_API_KEY%%', apiKey);
fs.writeFileSync(path.join(dist, 'index.html'), html);

// Copy all other static files as-is
['style.css', 'script.js', '_redirects'].forEach(function(file) {
  if (fs.existsSync(file)) fs.copyFileSync(file, path.join(dist, file));
});

console.log('Build complete — dist/ is ready.');
