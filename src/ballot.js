import { state } from './state.js';

// ==============================================================================
// 6. SIMULÁTOR HLASOVÁNÍ
// ==============================================================================

let currentVotingMode = "party";
let selectedCandidateIds = new Set();

function initBallotSimulator() {
  const container = document.getElementById("ballotSimulatorContainer");
  if (!container) return;
  renderBallotSimulator();
}

window.setVotingMode = function(mode) {
  currentVotingMode = mode;
  selectedCandidateIds.clear();
  renderBallotSimulator();
};

window.toggleCandidateVote = function(candidateNumber) {
  if (currentVotingMode === "party") return;
  
  if (selectedCandidateIds.has(candidateNumber)) {
    selectedCandidateIds.delete(candidateNumber);
  } else {
    if (selectedCandidateIds.size >= 15) {
      alert("V komunálních volbách v Horní Stropnici můžete udělit nejvýše 15 hlasů.");
      return;
    }
    selectedCandidateIds.add(candidateNumber);
  }
  renderBallotSimulator();
};

function renderBallotSimulator() {
  const container = document.getElementById("ballotSimulatorContainer");
  if (!container) return;

  const isParty = currentVotingMode === "party";
  const isCross = currentVotingMode === "cross";
  const isCombo = currentVotingMode === "combo";

  let infoText = "";

  if (isParty) {
    infoText = `
      <div class="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 text-sm leading-relaxed mb-6">
        <strong class="font-bold flex items-center gap-1.5 text-emerald-800 mb-1">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span data-editable="ballot_party_info_title">${escapeHtml(state.appSiteContent?.jakVolit?.partyInfoTitle || "NEJJEDNODUŠŠÍ A NEJÚČINNĚJŠÍ ZPŮSOB (Doporučeno):")}</span>
        </strong>
        <div data-editable="ballot_party_info_desc">${state.appSiteContent?.jakVolit?.partyInfoDesc || "Označíte <strong>jediným velkým křížkem</strong> rámeček u volebního čísla <strong>6 BSM</strong> v záhlaví. Tím dáváte všech svých <strong>15 hlasů celé naší kandidátce</strong>. Každý kandidát BSM obdrží 1 hlas. Žádný hlas se neztratí a zajistíte maximální podporu celého týmu."}</div>
      </div>
    `;
  } else if (isCross) {
    infoText = `
      <div class="bg-sky-50 border border-sky-200 text-sky-950 rounded-xl p-4 text-sm leading-relaxed mb-6">
        <strong class="font-bold flex items-center gap-1.5 text-sky-900 mb-1">
          <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span data-editable="ballot_cross_info_title">${escapeHtml(state.appSiteContent?.jakVolit?.crossInfoTitle || "VÝBĚR JEDNOTLIVÝCH KANDIDÁTŮ (Panašování):")}</span>
        </strong>
        <div data-editable="ballot_cross_info_desc">${state.appSiteContent?.jakVolit?.crossInfoDesc || "Nekřížkujete stranu v záhlaví, ale vybíráte konkrétní kandidáty před jejich jmény. Můžete udělit <strong>nejvýše 15 křížků</strong>."} (Vybráno máte nyní: <strong>${selectedCandidateIds.size} z 15</strong>)</div>
      </div>
    `;
  } else if (isCombo) {
    infoText = `
      <div class="bg-amber-50 border border-amber-200 text-amber-950 rounded-xl p-4 text-sm leading-relaxed mb-6">
        <strong class="font-bold flex items-center gap-1.5 text-amber-900 mb-1">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <span data-editable="ballot_combo_info_title">${escapeHtml(state.appSiteContent?.jakVolit?.comboInfoTitle || "KOMBINOVANÁ VOLBA:")}</span>
        </strong>
        <div data-editable="ballot_combo_info_desc">${state.appSiteContent?.jakVolit?.comboInfoDesc || "Dáte křížek do záhlaví BSM a k tomu křížek jednotlivcům z jiných kandidátek. Hlasy pro jiné kandidáty se započítají jako první, a zbývající hlasy z 15 se automaticky přidělí kandidátce BSM shora dolů."}</div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="flex flex-wrap gap-2 mb-6">
      <button 
        onclick="setVotingMode('party')" 
        class="flex-1 min-w-[200px] text-xs md:text-sm font-bold py-3 px-4 rounded-xl border transition-all text-center ${isParty ? 'bg-bsm-800 text-white border-bsm-800 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
        <span data-editable="ballot_tab_party">${escapeHtml(state.appSiteContent?.jakVolit?.tabParty || "⭐ 1. Celá kandidátka BSM (Doporučeno)")}</span>
      </button>
      <button 
        onclick="setVotingMode('cross')" 
        class="flex-1 min-w-[200px] text-xs md:text-sm font-bold py-3 px-4 rounded-xl border transition-all text-center ${isCross ? 'bg-bsm-800 text-white border-bsm-800 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
        <span data-editable="ballot_tab_cross">${escapeHtml(state.appSiteContent?.jakVolit?.tabCross || "2. Křížkování kandidátů")}</span> (${selectedCandidateIds.size}/15)
      </button>
      <button 
        onclick="setVotingMode('combo')" 
        class="flex-1 min-w-[200px] text-xs md:text-sm font-bold py-3 px-4 rounded-xl border transition-all text-center ${isCombo ? 'bg-bsm-800 text-white border-bsm-800 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
        <span data-editable="ballot_tab_combo">${escapeHtml(state.appSiteContent?.jakVolit?.tabCombo || "3. Kombinovaná volba")}</span>
      </button>
    </div>

    ${infoText}

    <div class="bg-amber-50/50 border-2 border-slate-300 rounded-2xl p-6 shadow-inner font-mono text-xs md:text-sm max-w-2xl mx-auto">
      <div class="text-center pb-3 border-b-2 border-slate-400 mb-4">
        <div class="text-[11px] text-slate-500 uppercase tracking-widest font-sans font-bold" data-editable="ballot_header_sub">${escapeHtml(state.appSiteContent?.jakVolit?.ballotHeaderSub || "Ukázka části volebního lístku")}</div>
        <div class="text-base font-bold font-sans text-slate-900 mt-1" data-editable="ballot_header_title">${escapeHtml(state.appSiteContent?.jakVolit?.ballotHeaderTitle || "Obec Horní Stropnice – Volby do zastupitelstva obce")}</div>
      </div>

      <div class="border-2 border-bsm-800 rounded-xl overflow-hidden bg-white shadow-sm">
        <div class="bg-bsm-900 text-white p-4 flex items-center justify-between">
          <div>
            <div class="text-xs text-sky-200 uppercase font-sans font-bold" data-editable="ballot_party_num_label">Volební číslo</div>
            <div class="text-2xl font-black font-sans" data-editable="ballot_party_name">${escapeHtml(state.appSiteContent?.jakVolit?.ballotPartyName || "6. BSM")}</div>
            <div class="text-[11px] text-sky-200 font-sans" data-editable="ballot_party_motto">${escapeHtml(state.appSiteContent?.jakVolit?.ballotPartyMotto || "Bezpečnost • Stabilita • Mládež")}</div>
          </div>
          <div class="text-center">
            <div class="text-[10px] text-sky-200 uppercase font-sans font-bold mb-1" data-editable="ballot_party_vote_label">Hlas straně</div>
            <div 
              class="w-12 h-12 bg-white rounded-lg border-2 border-dashed border-sky-400 text-bsm-900 flex items-center justify-center font-black text-2xl cursor-pointer hover:bg-sky-50 shadow-inner"
              onclick="setVotingMode('party')">
              ${isParty ? '✕' : (isCombo ? '✕' : '')}
            </div>
          </div>
        </div>

        <div class="divide-y divide-slate-100 max-h-[380px] overflow-y-auto font-sans">
          ${state.appCandidates.map(c => {
            const isChecked = isParty || (isCross && selectedCandidateIds.has(c.number));
            return `
              <div 
                onclick="${isCross ? `toggleCandidateVote(${c.number})` : ''}"
                class="p-2.5 flex items-center justify-between gap-3 hover:bg-sky-50/50 transition-colors ${isCross ? 'cursor-pointer' : ''}">
                <div class="flex items-center gap-2.5">
                  <div class="w-5 h-5 rounded border ${isChecked ? 'bg-bsm-700 border-bsm-700 text-white' : 'border-slate-300 bg-white'} flex items-center justify-center text-xs font-bold">
                    ${isChecked ? '✓' : ''}
                  </div>
                  <span class="text-slate-400 font-bold text-xs w-4">${c.number}.</span>
                  <span class="font-bold text-slate-800 text-xs">${c.name}</span>
                </div>
                <span class="text-[11px] text-slate-500 truncate max-w-[160px]">${c.profession}${c.age ? `, ${c.age} let` : ''}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `;

  if (typeof state.isInPageEditActive !== "undefined" && state.isInPageEditActive) {
    refreshEditableElements();
  }
}



// Global exports
window.initBallotSimulator = initBallotSimulator;
window.renderBallotSimulator = renderBallotSimulator;
