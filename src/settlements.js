import { state } from './state.js';

// ==============================================================================
// 5. INTERAKTIVNÍ ROZCESTNÍK OSAD (KDE VOLÍM?)
// ==============================================================================

function initSettlementFinder() {
  const chipsContainer = document.getElementById("settlementChips");
  const resultCard = document.getElementById("wardResultCard");
  const searchInput = document.getElementById("settlementSearchInput");

  if (!chipsContainer || !resultCard) return;

  chipsContainer.innerHTML = BSM_DATA.allSettlements.map(item => `
    <button 
      onclick="selectSettlement('${item.name}')" 
      class="settlement-chip text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-300 text-slate-700 transition-all shadow-sm">
      ${item.name}
    </button>
  `).join("");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value.toLowerCase().trim();
      const chips = chipsContainer.querySelectorAll(".settlement-chip");
      
      chips.forEach(chip => {
        const text = chip.textContent.toLowerCase();
        if (text.includes(val)) {
          chip.classList.remove("hidden");
        } else {
          chip.classList.add("hidden");
        }
      });

      const matched = BSM_DATA.allSettlements.find(s => s.name.toLowerCase() === val);
      if (matched) {
        selectSettlement(matched.name);
      }
    });
  }

  selectSettlement("Horní Stropnice");
}

window.selectSettlement = function(settlementName) {
  const item = BSM_DATA.allSettlements.find(s => s.name === settlementName);
  if (!item) return;

  const ward = BSM_DATA.wards.find(w => w.id === item.wardId);
  if (!ward) return;

  document.querySelectorAll(".settlement-chip").forEach(chip => {
    if (chip.textContent.trim() === settlementName) {
      chip.classList.add("bg-bsm-800", "text-white", "border-bsm-800");
      chip.classList.remove("bg-white", "text-slate-700", "border-slate-200");
    } else {
      chip.classList.remove("bg-bsm-800", "text-white", "border-bsm-800");
      chip.classList.add("bg-white", "text-slate-700", "border-slate-200");
    }
  });

  const resultCard = document.getElementById("wardResultCard");
  if (!resultCard) return;

  const fridayText = state.appSiteContent?.kdeVolit?.fridayHours || "Pátek 9. října: 14:00 – 22:00";
  const saturdayText = state.appSiteContent?.kdeVolit?.saturdayHours || "Sobota 10. října: 08:00 – 14:00";
  const idNoteText = state.appSiteContent?.kdeVolit?.idNote || "Nezapomeňte si vzít s sebou platný občanský průkaz!";
  const mapsBtnText = state.appSiteContent?.kdeVolit?.mapsBtn || "Otevřít navigaci v Google Mapách";

  resultCard.innerHTML = `
    <div class="bg-gradient-to-br from-bsm-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-bsm-700/50">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-sky-800/80 pb-4">
        <div>
          <span class="text-xs uppercase tracking-widest text-sky-300 font-bold" data-editable="ward_selected_label">Vybraná osada / obec:</span>
          <h3 class="text-2xl font-black text-white flex items-center gap-2">
            <span>📍</span> <span data-editable="ward_settlement_name">${settlementName}</span>
          </h3>
        </div>
        <div class="bg-sky-500/20 text-sky-200 border border-sky-400/40 px-4 py-2 rounded-xl text-center">
          <div class="text-[11px] font-bold uppercase tracking-wider" data-editable="ward_box_label">Váš volební okrsek</div>
          <div class="text-xl font-black text-white" data-editable="ward_number_label">ČÍSLO ${ward.number}</div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <div class="text-xs font-semibold text-sky-300 uppercase tracking-wider mb-1" data-editable="ward_room_label">Místo volební místnosti:</div>
          <div class="text-lg font-bold text-white mb-1" data-editable="ward_${ward.id}_title" data-ward-id="${ward.id}" data-ward-field="title">${escapeHtml(ward.title)}</div>
          <div class="text-sm text-sky-100/90 mb-3" data-editable="ward_${ward.id}_location" data-ward-id="${ward.id}" data-ward-field="location">${escapeHtml(ward.location)}</div>
          <div class="text-xs text-sky-200 bg-slate-950/60 p-3 rounded-lg border border-sky-800/50" data-editable="ward_${ward.id}_desc" data-ward-id="${ward.id}" data-ward-field="description">
            ℹ️ ${escapeHtml(ward.description)}
          </div>
        </div>

        <div>
          <div class="text-xs font-semibold text-sky-300 uppercase tracking-wider mb-1" data-editable="ward_hours_label">Volební dny a čas:</div>
          <div class="space-y-1.5 text-sm mb-4">
            <div class="flex items-center gap-2 text-sky-100">
              <span data-editable="ward_friday_hours">${escapeHtml(fridayText)}</span>
            </div>
            <div class="flex items-center gap-2 text-sky-100">
              <span data-editable="ward_saturday_hours">${escapeHtml(saturdayText)}</span>
            </div>
          </div>

          <div class="text-xs text-sky-300 uppercase tracking-wider mb-1">Spadá sem celkem ${ward.settlements.length} osad:</div>
          <p class="text-xs text-slate-300 leading-relaxed">
            ${ward.settlements.join(" • ")}
          </p>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-sky-800/80 flex flex-wrap items-center justify-between gap-4">
        <a 
          href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ward.mapQuery)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          id="wardMapsBtn"
          data-editable="ward_maps_btn"
          class="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-sky-500/20">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span>${escapeHtml(mapsBtnText)}</span>
        </a>
        <span class="text-xs text-sky-300/80" data-editable="ward_id_note">${escapeHtml(idNoteText)}</span>
      </div>
    </div>
  `;

  if (typeof state.isInPageEditActive !== "undefined" && state.isInPageEditActive) {
    refreshEditableElements();
  }
};



// Global exports
window.initSettlementFinder = initSettlementFinder;
