import { state } from './state.js';

// ==============================================================================
// 4. KANDIDÁTI (NAČTENÍ A VYKRESLENÍ)
// ==============================================================================



async function loadAndRenderCandidates() {
  let candidates = null;

  if (state.supabaseClient) {
    try {
      const { data, error } = await state.supabaseClient
        .from("candidates")
        .select("*")
        .order("number", { ascending: true });
      if (!error && data && data.length > 0) {
        candidates = data;
      }
    } catch (e) {
      console.warn("Chyba čtení kandidátů ze Supabase:", e);
    }
  }

  if (!candidates) {
    const local = localStorage.getItem("bsm_candidates");
    if (local) {
      try {
        candidates = JSON.parse(local);
      } catch (e) { console.error("Chyba parsování kandidátů z localStorage:", e); }
    }
  }

  if (!candidates || candidates.length === 0) {
    candidates = JSON.parse(JSON.stringify(BSM_DATA.candidates));
  }

  // Normalizace foto URL z JSONB tags nebo objektu
  candidates.forEach(c => {
    if (c.tags && typeof c.tags === "object" && !Array.isArray(c.tags)) {
      if (c.tags.photo_url) c.photo_url = c.tags.photo_url;
      c.tags = Array.isArray(c.tags.list) ? c.tags.list : [];
    }
  });

  state.appCandidates = candidates;
  renderCandidates(state.currentCandidateFilter);
}

function renderCandidates(filter = "all") {
  const container = document.getElementById("candidatesGrid");
  if (!container) return;

  state.currentCandidateFilter = filter;
  const filtered = filter === "all" 
    ? state.appCandidates 
    : state.appCandidates.filter(c => {
        const tags = Array.isArray(c.tags) ? c.tags : [];
        return tags.some(t => t.toLowerCase().includes(filter.toLowerCase()));
      });

  container.innerHTML = filtered.map(c => {
    const initials = c.name
      .replace(/Mgr\.|Bc\.|PaedDr\./g, "")
      .trim()
      .split(" ")
      .map(part => part[0])
      .join("")
      .slice(0, 2);

    const tags = Array.isArray(c.tags) ? c.tags : [];
    const photoUrl = c.photo_url || "";

    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col relative group">
        <!-- Admin lišta -->
        <div class="candidate-card-admin-bar">
          <button 
            type="button" 
            onclick="openCandidateEditModal(${c.number})" 
            class="text-sky-300 hover:text-white px-2 py-1 rounded text-xs font-bold bg-slate-800 hover:bg-slate-700 transition-colors" 
            title="Otevřít okno pro úpravu kandidáta">
            ✏️ Upravit profil
          </button>
        </div>

        <!-- Pozice na kandidátce -->
        <div class="absolute top-4 right-4 flex items-center gap-1.5">
          <span class="w-7 h-7 rounded-full bg-sky-100 text-sky-900 font-extrabold text-xs flex items-center justify-center shadow-inner">
            ${c.number}
          </span>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <!-- Profilová fotografie nebo iniciály s gradientem -->
          <div class="relative img-edit-container flex-shrink-0 group/photo">
            ${photoUrl ? `
              <div class="w-16 h-16 rounded-full overflow-hidden shadow-md ring-4 ring-sky-100 bg-slate-100">
                <img 
                  id="candidatePhoto-${c.number}"
                  src="${escapeHtml(photoUrl)}" 
                  alt="${escapeHtml(c.name)}" 
                  class="w-full h-full object-cover" 
                  onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-full h-full bg-gradient-to-br from-sky-700 to-sky-900 text-white font-bold text-lg flex items-center justify-center\\'>${initials}</div>';" 
                />
              </div>
            ` : `
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-sky-700 to-sky-900 text-white font-bold text-lg flex items-center justify-center shadow-md ring-4 ring-sky-50">
                <span id="candidatePhotoFallback-${c.number}">${initials}</span>
              </div>
            `}
            <button 
              type="button" 
              onclick="openImageEditModalForCandidate(${c.number})" 
              class="img-edit-btn !text-[10px] !py-0.5 !px-1.5 !top-0 !left-0 whitespace-nowrap shadow-lg">
              📷 Foto
            </button>
          </div>

          <div class="pr-8 flex-1">
            <h4 class="font-extrabold text-slate-900 text-base leading-snug group-hover:text-sky-800 transition-colors" data-editable="candidate-name" data-candidate="${c.number}">
              ${escapeHtml(c.name)}
            </h4>
            <div class="flex flex-wrap items-center gap-1.5 text-xs text-sky-800 font-semibold mt-0.5">
              <span data-editable="candidate-profession" data-candidate="${c.number}">${escapeHtml(c.profession)}</span>
              <span class="text-slate-300">•</span>
              <span data-editable="candidate-age" data-candidate="${c.number}">${c.age || ''}</span>
              <span class="text-slate-500 font-medium">let</span>
            </div>
            <p class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <span>📍</span> <span data-editable="candidate-settlement" data-candidate="${c.number}">${escapeHtml(c.settlement)}</span>
            </p>
          </div>
        </div>

        <!-- Citát / Proč kandiduje -->
        <div class="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 italic mb-4 flex-1 border border-slate-100" data-editable="candidate-quote" data-candidate="${c.number}">
          ${escapeHtml(c.quote || "")}
        </div>

        <!-- Tagy a zaměření -->
        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          ${tags.map((tag, tagIdx) => `
            <span class="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full transition-all group/tag">
              <span data-editable="candidate-tag" data-candidate="${c.number}" data-tag-index="${tagIdx}">${escapeHtml(tag)}</span>
              <button 
                type="button" 
                onclick="removeCandidateTag(${c.number}, ${tagIdx})" 
                class="candidate-tag-delete-btn text-slate-400 hover:text-red-500 font-black text-xs px-0.5 transition-colors cursor-pointer" 
                title="Smazat tento štítek">×</button>
            </span>
          `).join("")}
          <button 
            type="button" 
            onclick="addCandidateTag(${c.number})" 
            class="candidate-tag-add-btn text-[10px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-0.5 rounded-full border border-dashed border-sky-300 transition-colors cursor-pointer"
            title="Přidat další štítek pro tohoto kandidáta">
            + Štítek
          </button>
        </div>
      </div>
    `;
  }).join("");

  const countBadge = document.getElementById("candidatesCountBadge");
  if (countBadge) {
    countBadge.textContent = `${filtered.length} z ${state.appCandidates.length} kandidátů`;
  }

  if (typeof state.isInPageEditActive !== "undefined" && state.isInPageEditActive) {
    refreshEditableElements();
  }
}

window.addCandidateTag = function(candidateNumber) {
  const cand = state.appCandidates.find(c => c.number === candidateNumber);
  if (!cand) return;
  if (!Array.isArray(cand.tags)) cand.tags = [];
  cand.tags.push("Nový štítek");
  renderCandidates(state.currentCandidateFilter);
  markUnsavedChanges(true);
  showInPageToast("➕ Nový štítek byl přidán. Můžete do něj kliknout a přepsat text.");
};

window.removeCandidateTag = function(candidateNumber, tagIndex) {
  const cand = state.appCandidates.find(c => c.number === candidateNumber);
  if (!cand || !Array.isArray(cand.tags)) return;
  cand.tags.splice(tagIndex, 1);
  renderCandidates(state.currentCandidateFilter);
  markUnsavedChanges(true);
  showInPageToast("🗑️ Štítek byl odebrán.");
};

window.filterCandidates = function(type, element) {
  document.querySelectorAll(".candidate-filter-btn").forEach(btn => {
    btn.classList.remove("bg-bsm-800", "text-white");
    btn.classList.add("bg-white", "text-slate-700", "border-slate-200");
  });
  if (element) {
    element.classList.remove("bg-white", "text-slate-700", "border-slate-200");
    element.classList.add("bg-bsm-800", "text-white");
  }
  renderCandidates(type);
};



// Global exports
window.loadAndRenderCandidates = loadAndRenderCandidates;
window.renderCandidates = renderCandidates;
