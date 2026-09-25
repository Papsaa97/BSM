const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const regex = /<(h[1-6]|p)(\s+[^>]*)id="([a-zA-Z0-9_]+)"([^>]*)>/g;
html = html.replace(regex, (match, tag, beforeId, id, afterId) => {
  if (match.includes('data-editable=')) return match;
  return `<${tag}${beforeId}id="${id}" data-editable="${id}"${afterId}>`;
});
fs.writeFileSync('index.html', html);
console.log('Added data-editable to headings and paragraphs with IDs.');
