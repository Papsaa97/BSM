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
// Special case: appSiteContent might be declared locally somewhere, but let's just replace it globally too.
content = content.replace(/\bappSiteContent\b/g, 'state.appSiteContent');

// Remove let declarations for the replaced globals
content = content.replace(/let state\.supabaseClient = null;/g, '');
content = content.replace(/let state\.currentAdminUser = null;/g, '');
content = content.replace(/let state\.appSections = \[\];/g, '');
content = content.replace(/let state\.appCandidates = \[\];/g, '');
content = content.replace(/let state\.appFeedbacks = \[\];/g, '');
content = content.replace(/let state\.isInPageEditActive = false;/g, '');
content = content.replace(/let state\.currentCandidateFilter = "all";/g, '');
content = content.replace(/let state\.appSiteContent;/g, '');

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

// Split file by sections
const sections = [
  { name: 'main.js', marker: '// ==============================================================================\n// 1. SUPABASE' },
  { name: 'supabase.js', marker: '// ==============================================================================\n// 2. MODUL' },
  { name: 'sections.js', marker: '// ==============================================================================\n// 3. PROGRAM' },
  { name: 'pillars.js', marker: '// ==============================================================================\n// 4. KANDID' },
  { name: 'candidates.js', marker: '// ==============================================================================\n// 5. INTERAKTIVN' },
  { name: 'settlements.js', marker: '// ==============================================================================\n// 6. SIMUL' },
  { name: 'ballot.js', marker: '// ==============================================================================\n// 7. FUNK' },
  { name: 'feedback.js', marker: '// ==============================================================================\n// 8. AUTENTIZACE' },
  { name: 'admin.js', marker: '// ==============================================================================\n// 9. P' },
  { name: 'inpage_edit.js', marker: '// ==============================================================================\n// 10. PROHL' },
  { name: 'leaflet.js', marker: '// ==============================================================================\n// 11. SPR' },
  { name: 'link_modal.js', marker: '// ==============================================================================\n// 12. SPR' },
  { name: 'candidate_modal.js', marker: 'END_OF_FILE' }
];

let remainingContent = content;
let parts = [];

for (let i = 0; i < sections.length - 1; i++) {
  const current = sections[i];
  const next = sections[i + 1];
  
  // Find index of next marker
  let nextIdx = remainingContent.indexOf(next.marker.split('\n')[0]);
  if (nextIdx === -1) nextIdx = remainingContent.length;
  
  let partContent = remainingContent.substring(0, nextIdx);
  remainingContent = remainingContent.substring(nextIdx);
  
  parts.push({ name: current.name, content: partContent });
}
parts.push({ name: sections[sections.length - 1].name, content: remainingContent });

parts.forEach(part => {
  // Add imports
  let finalContent = `import { state } from './state.js';\n\n` + part.content;
  
  // Expose all functions to window
  const funcRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
  let match;
  let exports = [];
  while ((match = funcRegex.exec(part.content)) !== null) {
    const fnName = match[1];
    exports.push(`window.${fnName} = ${fnName};`);
  }
  
  const windowFuncRegex = /window\.([a-zA-Z0-9_]+)\s*=\s*function\s*\(/g;
  while ((match = windowFuncRegex.exec(part.content)) !== null) {
     // Already assigned to window
  }

  if (exports.length > 0) {
    finalContent += `\n\n// Global exports\n${exports.join('\n')}\n`;
  }
  
  fs.writeFileSync(path.join(srcDir, part.name), finalContent);
});

// Write main entry point
let mainIndexContent = `
import { state } from './state.js';
import './main.js';
import './supabase.js';
import './sections.js';
import './pillars.js';
import './candidates.js';
import './settlements.js';
import './ballot.js';
import './feedback.js';
import './admin.js';
import './inpage_edit.js';
import './leaflet.js';
import './link_modal.js';
import './candidate_modal.js';
`;
fs.writeFileSync(path.join(srcDir, 'index.js'), mainIndexContent);

// Update index.html
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
html = html.replace('<script src="assets/js/app.js"></script>', '<script type="module" src="/src/index.js"></script>');
fs.writeFileSync(path.join(__dirname, 'index.html'), html);

console.log("Refactoring complete!");
