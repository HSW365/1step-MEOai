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

run();
