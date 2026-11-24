const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const jsDir = path.join(docsDir, '_expo', 'static', 'js', 'web');
const indexFile = path.join(docsDir, 'index.html');
const marker = '<!-- fallback-loader-inserted -->';

function findEntryFile() {
  if (!fs.existsSync(jsDir)) return null;
  const files = fs.readdirSync(jsDir).filter((f) => f.startsWith('entry-') && f.endsWith('.js'));
  if (files.length === 0) return null;
  // pick the most recently modified file
  files.sort((a, b) => {
    const aStat = fs.statSync(path.join(jsDir, a)).mtimeMs;
    const bStat = fs.statSync(path.join(jsDir, b)).mtimeMs;
    return bStat - aStat;
  });
  return files[0];
}

function run() {
  const entry = findEntryFile();
  if (!entry) {
    console.error('No entry JS found in', jsDir);
    process.exit(1);
  }
  const entryPath = `/1step-MEOai/_expo/static/js/web/${entry}`;

  let index = fs.readFileSync(indexFile, 'utf8');
  if (index.indexOf(marker) !== -1) {
    console.log('Fallback already present in index.html');
    return;
  }

  const scriptTagRegex = /<script\s+src="[^"]*entry-[^\"]+\.js"\s+defer><\/script>/i;
  const match = index.match(scriptTagRegex);
  if (!match) {
    console.error('Could not find entry script tag to attach fallback before.');
    process.exit(2);
  }

  const fallback = `<!-- fallback-loader-inserted -->\n<script>\n(function(){try{const correct='${entryPath}';const scripts=document.getElementsByTagName('script');for(let i=0;i<scripts.length;i++){const s=scripts[i];const src=s.getAttribute&&s.getAttribute('src');if(src&&src.indexOf('/_expo/static/js/web/entry-')!==-1&&src.indexOf('${entry.slice(0,12)}')===-1){s.addEventListener('error',function onErr(){s.removeEventListener('error',onErr);var newS=document.createElement('script');newS.src=correct;newS.defer=true;document.body.appendChild(newS);});}}}catch(e){}})();\n</script>\n`;

  // Insert fallback just before the matched script tag
  index = index.replace(scriptTagRegex, fallback + match[0]);

  fs.writeFileSync(indexFile, index, 'utf8');
  console.log('Injected fallback loader into', indexFile);
}

// HSW365 Owner PIN login: keep owner-login.js (public/) in the export and load it on every app page.
// `expo export --clear` rebuilds docs/, so this re-adds the script tag after each export.
const OWNER_TAG = '<script src="/1step-MEOai/owner-login.js?v=3" defer></script>';
function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === '_expo' ? [] : htmlFiles(p);
    return d.name.endsWith('.html') && d.name !== '_sitemap.html' ? [p] : [];
  });
}
function injectOwnerLogin() {
  const src = path.join(__dirname, '..', 'public', 'owner-login.js');
  const dest = path.join(docsDir, 'owner-login.js');
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
  if (!fs.existsSync(dest)) { console.error('owner-login.js missing from public/'); process.exit(4); }
  for (const file of htmlFiles(docsDir)) {
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/<script src="[^"]*owner-login\.js[^"]*" defer><\/script>\n?/g, '');
    if (html.indexOf('</body>') === -1) continue;
    html = html.replace('</body>', OWNER_TAG + '\n</body>');
    fs.writeFileSync(file, html, 'utf8');
    console.log('Owner login on', path.relative(docsDir, file));
  }
}

run();
injectOwnerLogin();
