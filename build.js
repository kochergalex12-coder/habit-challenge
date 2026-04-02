const fs   = require('fs');
const path = require('path');

const dist = 'dist';
if (!fs.existsSync(dist)) fs.mkdirSync(dist);

// Inject Firebase API key into index.html
const apiKey = process.env.FIREBASE_API_KEY || '';
if (!apiKey) {
  console.error('ERROR: FIREBASE_API_KEY environment variable is not set!');
  console.error('Set it in Netlify: Site configuration → Environment variables');
  process.exit(1); // Fail the build loudly instead of silently shipping a broken site
}

console.log('FIREBASE_API_KEY found, injecting into index.html...');

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('%%FIREBASE_API_KEY%%', apiKey);
fs.writeFileSync(path.join(dist, 'index.html'), html);

// Copy all other static files as-is
['style.css', 'script.js', '_redirects'].forEach(function(file) {
  if (fs.existsSync(file)) fs.copyFileSync(file, path.join(dist, file));
});

console.log('Build complete — dist/ is ready.');
