import { state } from './state.js';

// ==============================================================================
// 12. SPRÁVA KANDIDÁTŮ A ŠTÍTKŮ (CANDIDATE MODAL)
// ==============================================================================

let currentCandidateEditNumber = null;

window.openCandidateEditModal = function(candidateNumber) {
  const modal = document.getElementById("candidateEditModal");
  const modalTitle = document.getElementById("candidateEditModalTitle");
  const deleteBtn = document.getElementById("candDeleteBtn");

  const numInput = document.getElementById("candEditNumber");
  const nameInput = document.getElementById("candEditName");
  const ageInput = document.getElementById("candEditAge");
  const profInput = document.getElementById("candEditProfession");
  const settInput = document.getElementById("candEditSettlement");
  const quoteInput = document.getElementById("candEditQuote");
  const tagsInput = document.getElementById("candEditTagsInput");
  const photoInput = document.getElementById("candEditPhotoUrl");
  const highInput = document.getElementById("candEditHighlight");

  if (!modal || !nameInput) return;

  if (candidateNumber === "new") {
    currentCandidateEditNumber = "new";
    modalTitle.innerHTML = "<span>➕</span> Přidat nového kandidáta";
    deleteBtn.classList.add("hidden");

    const nextNum = state.appCandidates.length > 0 ? Math.max(...state.appCandidates.map(c => c.number || 0)) + 1 : 1;
    numInput.value = nextNum;
    nameInput.value = "";
    ageInput.value = "";
    profInput.value = "";
    settInput.value = "Horní Stropnice";
    quoteInput.value = "";
    tagsInput.value = "";
    photoInput.value = "";
    highInput.checked = false;
    renderCandidateModalTagBadges("");
    previewCandidateModalPhoto("");
  } else {
    currentCandidateEditNumber = candidateNumber;
    const cand = state.appCandidates.find(c => c.number === candidateNumber);
    if (!cand) return;

    modalTitle.innerHTML = `<span>👤</span> Upravit profil: ${escapeHtml(cand.name)} (#${cand.number})`;
    deleteBtn.classList.remove("hidden");

    numInput.value = cand.number;
    nameInput.value = cand.name || "";
    ageInput.value = cand.age || "";
    profInput.value = cand.profession || "";
    settInput.value = cand.settlement || "";
    quoteInput.value = cand.quote || "";
    
    const tagsArr = Array.isArray(cand.tags) ? cand.tags : [];
    tagsInput.value = tagsArr.join(", ");
    renderCandidateModalTagBadges(tagsInput.value);

    photoInput.value = cand.photo_url || "";
    previewCandidateModalPhoto(cand.photo_url || "");
    highInput.checked = !!cand.highlight;
  }

  modal.classList.remove("hidden");
};

window.closeCandidateEditModal = function() {
  const modal = document.getElementById("candidateEditModal");
  if (modal) modal.classList.add("hidden");
  currentCandidateEditNumber = null;
};

window.renderCandidateModalTagBadges = function(tagsString) {
  const container = document.getElementById("candModalTagsPreview");
  if (!container) return;

  const tags = (tagsString || "").split(",").map(t => t.trim()).filter(Boolean);
  if (tags.length === 0) {
    container.innerHTML = '<span class="text-[11px] text-slate-500 italic">Zatím žádné štítky. Zadejte např. Hasiči JSDH, Bezpečnost</span>';
    return;
  }

  container.innerHTML = tags.map((t, idx) => `
    <span class="inline-flex items-center gap-1.5 text-xs bg-sky-950 text-sky-200 border border-sky-600/40 px-2.5 py-1 rounded-full font-medium">
      <span>${escapeHtml(t)}</span>
      <button 
        type="button" 
        onclick="removeTagFromCandidateModal(${idx})" 
        class="text-sky-400 hover:text-red-400 font-black cursor-pointer">×</button>
    </span>
  `).join("");
};

window.removeTagFromCandidateModal = function(tagIndex) {
  const tagsInput = document.getElementById("candEditTagsInput");
  if (!tagsInput) return;
  const tags = tagsInput.value.split(",").map(t => t.trim()).filter(Boolean);
  tags.splice(tagIndex, 1);
  tagsInput.value = tags.join(", ");
  renderCandidateModalTagBadges(tagsInput.value);
};

window.previewCandidateModalPhoto = function(url) {
  const img = document.getElementById("candModalPhotoPreview");
  const fallback = document.getElementById("candModalPhotoFallback");
  const nameInput = document.getElementById("candEditName");
  if (!img || !fallback) return;

  if (url && url.trim().length > 3) {
    img.src = url.trim();
    img.classList.remove("hidden");
    fallback.classList.add("hidden");
  } else {
    img.src = "";
    img.classList.add("hidden");
    fallback.classList.remove("hidden");
    const name = nameInput ? nameInput.value.trim() : "";
    fallback.textContent = name ? name.split(" ").map(p => p[0]).join("").slice(0, 2) : "?";
  }
};

window.saveCandidateEditModal = function() {
  const numInput = document.getElementById("candEditNumber");
  const nameInput = document.getElementById("candEditName");
  const ageInput = document.getElementById("candEditAge");
  const profInput = document.getElementById("candEditProfession");
  const settInput = document.getElementById("candEditSettlement");
  const quoteInput = document.getElementById("candEditQuote");
  const tagsInput = document.getElementById("candEditTagsInput");
  const photoInput = document.getElementById("candEditPhotoUrl");
  const highInput = document.getElementById("candEditHighlight");

  const name = nameInput.value.trim();
  if (!name) {
    alert("Zadejte prosím jméno a příjmení kandidáta.");
    return;
  }

  const number = parseInt(numInput.value, 10) || (state.appCandidates.length + 1);
  const age = parseInt(ageInput.value, 10) || null;
  const profession = profInput.value.trim();
  const settlement = settInput.value.trim() || "Horní Stropnice";
  const quote = quoteInput.value.trim();
  const tags = tagsInput.value.split(",").map(t => t.trim()).filter(Boolean);
  const photo_url = photoInput.value.trim() || null;
  const highlight = highInput.checked;

  if (currentCandidateEditNumber === "new") {
    state.appCandidates.push({
      number,
      name,
      age,
      profession,
      settlement,
      quote,
      tags,
      photo_url,
      highlight
    });
    showInPageToast(`➕ Kandidát ${name} byl přidán do seznamu.`);
  } else {
    const cand = state.appCandidates.find(c => c.number === currentCandidateEditNumber);
    if (cand) {
      cand.number = number;
      cand.name = name;
      cand.age = age;
      cand.profession = profession;
      cand.settlement = settlement;
      cand.quote = quote;
      cand.tags = tags;
      cand.photo_url = photo_url;
      cand.highlight = highlight;
      showInPageToast(`✅ Profil kandidáta ${name} byl aktualizován.`);
    }
  }

  state.appCandidates.sort((a, b) => a.number - b.number);

  renderCandidates(state.currentCandidateFilter);
  renderBallotSimulator();
  markUnsavedChanges(true);
  closeCandidateEditModal();
};

window.deleteCandidateFromModal = function() {
  if (currentCandidateEditNumber === "new") return;
  deleteCandidateDirect(currentCandidateEditNumber);
  closeCandidateEditModal();
};

window.deleteCandidateDirect = function(candidateNumber) {
  const cand = state.appCandidates.find(c => c.number === candidateNumber);
  if (!cand) return;

  if (!confirm(`Opravdu chcete smazat kandidáta ${cand.name} (#${cand.number}) z kandidátky?`)) return;

  state.appCandidates = state.appCandidates.filter(c => c.number !== candidateNumber);
  renderCandidates(state.currentCandidateFilter);
  renderBallotSimulator();
  markUnsavedChanges(true);
  showInPageToast(`🗑️ Kandidát ${cand.name} byl odstraněn.`);
};
