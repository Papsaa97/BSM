import { state } from './state.js';

// ==============================================================================
// 3. PROGRAMOVÉ PILÍŘE
// ==============================================================================

function renderProgramPillars() {
  const container = document.getElementById("pillarsContainer");
  if (!container) return;

  container.innerHTML = BSM_DATA.pillars.map((pillar, idx) => {
    return `
      <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/80 overflow-hidden flex flex-col relative group">
        <div class="p-6 md:p-8 flex-1 flex flex-col">
          <div class="flex items-center justify-between gap-3 mb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-sky-100 text-sky-800" data-editable="pillar-badge" data-pillar="${idx}">
              ${escapeHtml(pillar.badge)}
            </span>
            <span class="text-xs font-bold text-slate-400">PILÍŘ 0${idx + 1}</span>
          </div>

          <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-2" data-editable="pillar-title" data-pillar="${idx}">
            ${escapeHtml(pillar.title)}
          </h3>
          <p class="text-sky-900/80 font-medium text-sm mb-4" data-editable="pillar-subtitle" data-pillar="${idx}">
            ${escapeHtml(pillar.subtitle)}
          </p>
          <p class="text-slate-600 text-sm leading-relaxed mb-6" data-editable="pillar-desc" data-pillar="${idx}">
            ${escapeHtml(pillar.description)}
          </p>

          <div class="space-y-3 pt-2 border-t border-slate-100 flex-1">
            ${pillar.points.map((pt, pIdx) => `
              <div class="group/point bg-slate-50 hover:bg-sky-50/60 p-3.5 rounded-xl border border-slate-200/60 transition-colors relative">
                <div class="flex items-start gap-3">
                  <div class="mt-0.5 text-sky-700 flex-shrink-0">
                    <svg class="w-4 h-4 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-bold text-slate-800 group-hover/point:text-sky-900 transition-colors" data-editable="point-title" data-pillar="${idx}" data-point="${pIdx}">
                      ${escapeHtml(pt.title)}
                    </h4>
                    <p class="text-xs text-slate-500 mt-1 leading-normal" data-editable="point-detail" data-pillar="${idx}" data-point="${pIdx}">
                      ${escapeHtml(pt.detail)}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onclick="deletePillarPoint(${idx}, ${pIdx})" 
                    class="pillar-point-delete-btn text-slate-400 hover:text-red-500 font-black text-xs p-1 ml-1 transition-colors cursor-pointer"
                    title="Smazat tento bod programu">
                    🗑️
                  </button>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="pt-4 text-center">
            <button 
              type="button" 
              onclick="addNewPillarPoint(${idx})" 
              class="pillar-point-add-btn text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3.5 py-1.5 rounded-xl border border-dashed border-sky-300 transition-all cursor-pointer">
              ➕ Přidat bod do tohoto pilíře
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  initLucideIcons();
  if (typeof state.isInPageEditActive !== "undefined" && state.isInPageEditActive) {
    refreshEditableElements();
  }
}

window.addNewPillarPoint = function(pillarIndex) {
  if (!BSM_DATA.pillars[pillarIndex]) return;
  BSM_DATA.pillars[pillarIndex].points.push({
    title: "Nový bod volebního programu",
    detail: "Zadejte podrobný popis tohoto programového záměru..."
  });
  renderProgramPillars();
  markUnsavedChanges(true);
  showInPageToast(`➕ Nový bod byl přidán do pilíře ${BSM_DATA.pillars[pillarIndex].title}.`);
};

window.deletePillarPoint = function(pillarIndex, pointIndex) {
  if (!BSM_DATA.pillars[pillarIndex]) return;
  if (!confirm("Opravdu chcete tento bod programu odstranit?")) return;
  BSM_DATA.pillars[pillarIndex].points.splice(pointIndex, 1);
  renderProgramPillars();
  markUnsavedChanges(true);
  showInPageToast(`🗑️ Bod programu byl odstraněn.`);
};



// Global exports
window.renderProgramPillars = renderProgramPillars;
