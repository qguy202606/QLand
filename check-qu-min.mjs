import fs from 'fs';
const p = 'qu-min-tian-di.html';
const html = fs.readFileSync(p, 'utf8');
const start = html.indexOf('<script>') + 8;
const end = html.indexOf('</script>', start);
const script = html.slice(start, end);
const out = script.split('\n').reduce((acc, line, idx) => {
  if (line.includes('`')) acc.backticks += (line.match(/`/g) || []).length;
  if (line.includes('{')) acc.open += (line.match(/{/g) || []).length;
  if (line.includes('}')) acc.close += (line.match(/}/g) || []).length;
  return acc;
}, { backticks: 0, open: 0, close: 0 });
console.log(JSON.stringify(out));
