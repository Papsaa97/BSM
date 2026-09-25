const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir);

let content = fs.readFileSync(path.join(__dirname, 'assets', 'js', 'app.js'), 'utf-8');

// Replace global variables with state object
const globalVars = [
  'supabaseClient', 'currentAdminUser', 'appSections', 'appCandidates', 'appFeedbacks', 'isInPageEditActive', 'currentCandidateFilter'
];

globalVars.forEach(v => {
  const regex = new RegExp(`\\b${v}\\b`, 'g');
  content = content.replace(regex, `state.${v}`);
});
content = content.replace(/\bappSiteContent\b/g, 'state.appSiteContent');

// Remove let declarations for the replaced globals
content = content.replace(/let state\.supabaseClient\s*=\s*null;/g, '');
content = content.replace(/let state\.currentAdminUser\s*=\s*null;/g, '');
content = content.replace(/let state\.appSections\s*=\s*\[\];/g, '');
content = content.replace(/let state\.appCandidates\s*=\s*\[\];/g, '');
content = content.replace(/let state\.appFeedbacks\s*=\s*\[\];/g, '');
content = content.replace(/let state\.isInPageEditActive\s*=\s*false;/g, '');
content = content.replace(/let state\.currentCandidateFilter\s*=\s*"all";/g, '');
content = content.replace(/let state\.appSiteContent;/g, '');
content = content.replace(/let state\.appSiteContent\s*=\s*null;/g, ''); // just in case

const stateJs = `
export const state = {
  supabaseClient: null,
  currentAdminUser: null,
  appSections: [],
  appCandidates: [],
  appFeedbacks: [],
  isInPageEditActive: false,
  currentCandidateFilter: "all",
  appSiteContent: null
};
window.appState = state;
`;
fs.writeFileSync(path.join(srcDir, 'state.js'), stateJs);

// Find indices for splits
const regex = /\/\/ =+\r?\n\/\/ (\d+)\. ([^\r\n]+)/g;
let match;
let markers = [];
while ((match = regex.exec(content)) !== null) {
  markers.push({
    index: match.index,
    number: parseInt(match[1]),
    title: match[2]
  });
}

const fileNames = {
  0: 'main.js',
  1: 'supabase.js',
  2: 'sections.js',
  3: 'pillars.js',
  4: 'candidates.js',
  5: 'settlements.js',
  6: 'ballot.js',
  7: 'feedback.js',
  8: 'admin.js',
  9: 'inpage_edit.js',
  10: 'leaflet.js',
  11: 'link_modal.js',
  12: 'candidate_modal.js'
};

let parts = [];
// Everything before the first marker is main.js
parts.push({ name: fileNames[0], content: content.substring(0, markers[0].index) });

for (let i = 0; i < markers.length; i++) {
  const startIdx = markers[i].index;
  const endIdx = (i + 1 < markers.length) ? markers[i + 1].index : content.length;
  parts.push({
    name: fileNames[markers[i].number],
    content: content.substring(startIdx, endIdx)
  });
}

parts.forEach(part => {
  if (!part.name) return;
  
  let finalContent = `import { state } from './state.js';\n\n` + part.content;
  
  // Expose functions to window
  const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
  let m;
  let exportsMap = new Set();
  while ((m = funcRegex.exec(part.content)) !== null) {
    exportsMap.add(`window.${m[1]} = ${m[1]};`);
  }
  
  const windowFuncRegex = /window\.([a-zA-Z0-9_]+)\s*=\s*(async\s+)?function\s*\(/g;
  while ((m = windowFuncRegex.exec(part.content)) !== null) {
     // Already assigned
  }

  if (exportsMap.size > 0) {
    finalContent += `\n\n// Global exports\n${Array.from(exportsMap).join('\n')}\n`;
  }
  
  fs.writeFileSync(path.join(srcDir, part.name), finalContent);
});

let mainIndexContent = `
import { state } from './state.js';
import './main.js';
`;
for (let i = 1; i <= 12; i++) {
  if (fileNames[i]) mainIndexContent += `import './${fileNames[i]}';\n`;
}
fs.writeFileSync(path.join(srcDir, 'index.js'), mainIndexContent);
console.log("Refactoring 2.0 complete!");
