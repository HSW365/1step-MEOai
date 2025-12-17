const fs = require('fs');
const path = require('path');

// Search built JS files for a signature string that indicates the new behavior
const expected = 'Run Automation triggered';
const jsDir = path.join(__dirname, '..', 'docs', '_expo', 'static', 'js', 'web');

function findFile(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f.startsWith('entry-') && f.endsWith('.js')) return path.join(dir, f);
  }
  return null;
}

function run() {
  const file = findFile(jsDir);
  if (!file) {
    console.error('Could not find built entry JS in', jsDir);
    process.exit(2);
  }

  const content = fs.readFileSync(file, 'utf8');
  if (content.indexOf(expected) === -1) {
    console.error('Verification failed: expected string not found in', file);
    process.exit(3);
  }

  console.log('Verification passed: found expected string in', file);
}

run();
