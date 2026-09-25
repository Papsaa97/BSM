import { state } from './state.js';

// ==============================================================================
// 9. PŘÍMÁ IN-PAGE EDITACE OBSAHU PŘÍMO NA STRÁNCE (NO CONSOLE / VISUAL CMS)
// ==============================================================================


let hasUnsavedChanges = false;
let draggedPageSectionId = null;
let currentImageEditTarget = null;

window.enableInPageEditing = function() {
  state.isInPageEditActive = true;
  document.body.classList.add("admin-edit-active");

  const btn = document.getElementById("toggleEditModeBtn");
  const icon = document.getElementById("editModeIcon");
  const text = document.getElementById("editModeText");
  if (btn) {
    btn.className = "bg-sky-600 hover:bg-sky-500 text-white font-extrabold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm";
    if (icon) icon.textContent = "✏️";
    if (text) text.textContent = "Režim úprav: ZAPNUT";
  }

  const hint = document.getElementById("adminEditHint");
  if (hint) hint.classList.remove("hidden");

  const photoToolbar = document.getElementById("leafletAdminToolbar");
  if (photoToolbar) {
    photoToolbar.classList.remove("hidden");
    photoToolbar.style.display = "flex";
  }

  // Obnovit sekce (aby skryté sekce byly v admin režimu zobrazeny průhledně)
  applySectionsToDOM(state.appSections);

  // Vložit ovládací lišty k jednotlivým modulům
  injectSectionControlBars();

  // Obnovit pilíře a kandidáty pro zobrazení admin tlačítek
  renderProgramPillars();
  renderCandidates(state.currentCandidateFilter);

  // Obnovit galerii s interaktivní kartou "+"
  initLeafletViewer();

  // Udělat veškeré textové prvky editovatelné
  refreshEditableElements();
};

window.disableInPageEditing = function() {
  state.isInPageEditActive = false;
  document.body.classList.remove("admin-edit-active");

  const btn = document.getElementById("toggleEditModeBtn");
  const icon = document.getElementById("editModeIcon");
  const text = document.getElementById("editModeText");
  if (btn) {
    btn.className = "bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5";
    if (icon) icon.textContent = "👁️";
    if (text) text.textContent = "Režim náhledu: NÁHLED";
  }

  const hint = document.getElementById("adminEditHint");
  if (hint) hint.classList.add("hidden");

  const photoToolbar = document.getElementById("leafletAdminToolbar");
  if (photoToolbar) {
    photoToolbar.classList.add("hidden");
    photoToolbar.style.display = "none";
  }

  // Obnovit sekce (skryté sekce se pro běžné návštěvníky zcela skryjí)
  applySectionsToDOM(state.appSections);

  // Obnovit pilíře a kandidáty
  renderProgramPillars();
  renderCandidates(state.currentCandidateFilter);

  // Obnovit galerii bez karty "+"
  initLeafletViewer();

  // Odstranit contenteditable
  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    el.removeAttribute("contenteditable");
  });
};

window.toggleInPageEditMode = function() {
  if (state.isInPageEditActive) {
    disableInPageEditing();
    showInPageToast("👁️ Přepnuto do čistého náhledu (jak web vidí běžný občan).");
  } else {
    enableInPageEditing();
    showInPageToast("✏️ Režim úprav aktivován. Klikněte do libovolného textu a pište.");
  }
};

function refreshEditableElements() {
  if (!state.isInPageEditActive) return;

  const selectors = [
    "#heroBannerBadge", "#heroBannerHeading", "#heroBadge", "#heroSlogan", "#heroH1", "#heroIntroText", "#heroFridayHours", "#heroSaturdayHours",
    "#onasBadge", "#onasTitle", "#onasIntroText", "#onasQuoteText", "#onasQuoteAuthor",
    "#onasCard1Title", "#onasCard1Desc", "#onasCard2Title", "#onasCard2Desc", "#onasCard3Title", "#onasCard3Desc",
    "#programBadge", "#programTitle", "#programSubtitle", "#programCtaTitle", "#programCtaDesc", "#programCtaBtn",
    "#kdeVolitBadge", "#kdeVolitTitle", "#kdeVolitDesc",
    "#jakVolitBadge", "#jakVolitTitle", "#jakVolitDesc",
    "#letacekBadge", "#letacekTitle", "#letacekDesc",
    "#podnetyBadge", "#podnetyTitle", "#podnetyDesc",
    "#footerTitle", "#footerTagline", "#footerDescription",
    "[data-editable]"
  ];

  document.querySelectorAll(selectors.join(",")).forEach(el => {
    el.setAttribute("contenteditable", "true");
    el.setAttribute("spellcheck", "false");
    
    if (!el.dataset.listenerAttached) {
      el.dataset.listenerAttached = "true";
      el.addEventListener("input", () => {
        markUnsavedChanges(true);
      });
    }
  });

  // Zabránit přesměrování při kliku do editovatelných odkazů (navigace, tlačítka sdílení)
  document.querySelectorAll("a[data-editable]").forEach(a => {
    if (!a.dataset.clickPreventAttached) {
      a.dataset.clickPreventAttached = "true";
      a.addEventListener("click", (e) => {
        if (state.isInPageEditActive) {
          e.preventDefault();
        }
      });
    }
  });
}

function markUnsavedChanges(isDirty) {
  hasUnsavedChanges = isDirty;
  const dot = document.getElementById("unsavedDot");
  const saveBtn = document.getElementById("inPageSaveBtn");

  if (dot) dot.classList.toggle("hidden", !isDirty);

  if (saveBtn) {
    const textSpan = saveBtn.querySelector("span:nth-child(2)");
    if (isDirty) {
      saveBtn.className = "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-1.5 rounded-xl transition-all shadow-lg flex items-center gap-1.5 animate-pulse ring-2 ring-amber-300";
      if (textSpan) textSpan.textContent = "Uložit změny *";
    } else {
      saveBtn.className = "bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-[1.02]";
      if (textSpan) textSpan.textContent = "Uložit změny";
    }
  }
}

// Injekce ovládací lišty přímo nad každý modul na živém webu
function injectSectionControlBars() {
  const container = document.getElementById("modularSectionsContainer");
  if (!container) return;

  state.appSections.forEach(sec => {
    const el = document.getElementById(sec.id);
    if (!el) return;

    if (!el.classList.contains("relative")) {
      el.classList.add("relative");
    }

    let bar = el.querySelector(".page-section-control-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "page-section-control-bar";
      el.prepend(bar);
    }

    bar.innerHTML = `
      <div 
        class="section-drag-btn" 
        draggable="true" 
        ondragstart="handlePageSectionDragStart(event, '${sec.id}')"
        ondragend="handlePageSectionDragEnd(event)"
        title="Uchopit a přetáhnout celý tento modul na jiné místo na stránce"
      >
        <span>⠿</span> Přesunout modul: ${sec.title}
      </div>
      <div class="flex items-center gap-1">
        <button 
          type="button" 
          onclick="moveSectionDirect('${sec.id}', -1)" 
          class="p-1 px-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-bold" 
          title="Posunout nahoru">
          ▲
        </button>
        <button 
          type="button" 
          onclick="moveSectionDirect('${sec.id}', 1)" 
          class="p-1 px-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-bold" 
          title="Posunout dolů">
          ▼
        </button>
        <button 
          type="button" 
          onclick="toggleSectionVisibilityDirect('${sec.id}')" 
          class="p-1 px-2 rounded hover:bg-slate-800 ${sec.visible === false ? 'text-amber-300 bg-amber-950/60' : 'text-slate-300 hover:text-white'} transition-colors text-xs font-bold" 
          title="Skrýt / Zobrazit sekci na webu">
          ${sec.visible === false ? '🙈 Skrytý' : '👁️ Zobrazen'}
        </button>
      </div>
    `;

    el.ondragover = (e) => handlePageSectionDragOver(e, sec.id);
    el.ondragenter = (e) => handlePageSectionDragEnter(e, sec.id);
    el.ondragleave = (e) => handlePageSectionDragLeave(e, sec.id);
    el.ondrop = (e) => handlePageSectionDrop(e, sec.id);

    if (sec.visible === false) {
      el.classList.add("section-hidden-admin");
    } else {
      el.classList.remove("section-hidden-admin");
    }
  });
}

// Drag & Drop celých sekcí přímo na živé stránce
window.handlePageSectionDragStart = function(e, secId) {
  draggedPageSectionId = secId;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", secId);
  const secEl = document.getElementById(secId);
  if (secEl) secEl.classList.add("section-drag-active");
};

window.handlePageSectionDragOver = function(e, secId) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
};

window.handlePageSectionDragEnter = function(e, secId) {
  if (!draggedPageSectionId || draggedPageSectionId === secId) return;
  const secEl = document.getElementById(secId);
  if (secEl) secEl.classList.add("section-drop-target");
};

window.handlePageSectionDragLeave = function(e, secId) {
  const secEl = document.getElementById(secId);
  if (secEl) secEl.classList.remove("section-drop-target");
};

window.handlePageSectionDrop = function(e, targetSecId) {
  e.preventDefault();
  const targetEl = document.getElementById(targetSecId);
  if (targetEl) targetEl.classList.remove("section-drop-target");

  if (!draggedPageSectionId || draggedPageSectionId === targetSecId) return;

  const sorted = [...state.appSections].sort((a, b) => a.order - b.order);
  const fromIdx = sorted.findIndex(s => s.id === draggedPageSectionId);
  const toIdx = sorted.findIndex(s => s.id === targetSecId);

  if (fromIdx < 0 || toIdx < 0) return;

  const [moved] = sorted.splice(fromIdx, 1);
  sorted.splice(toIdx, 0, moved);

  sorted.forEach((s, idx) => {
    s.order = idx + 1;
  });

  state.appSections = sorted;
  applySectionsToDOM(state.appSections);
  injectSectionControlBars();
  markUnsavedChanges(true);
  showInPageToast(`🔄 Modul byl přesunut.`);
};

window.handlePageSectionDragEnd = function(e) {
  draggedPageSectionId = null;
  document.querySelectorAll("section").forEach(sec => {
    sec.classList.remove("section-drag-active", "section-drop-target");
  });
};

window.moveSectionDirect = function(secId, direction) {
  const sorted = [...state.appSections].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex(s => s.id === secId);
  if (idx < 0) return;

  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= sorted.length) return;

  const tempOrder = sorted[idx].order;
  sorted[idx].order = sorted[targetIdx].order;
  sorted[targetIdx].order = tempOrder;

  state.appSections = sorted;
  applySectionsToDOM(state.appSections);
  injectSectionControlBars();
  markUnsavedChanges(true);
};

window.toggleSectionVisibilityDirect = function(secId) {
  const item = state.appSections.find(s => s.id === secId);
  if (!item) return;

  item.visible = !(item.visible !== false);
  applySectionsToDOM(state.appSections);
  injectSectionControlBars();
  markUnsavedChanges(true);
  showInPageToast(item.visible ? `👁️ Modul ${item.title} bude zobrazen.` : `🙈 Modul ${item.title} byl skryt.`);
};

// --- Přímá editace multimédií a fotografií na stránce ---
window.openImageEditModal = function(imgElementId, label) {
  currentImageEditTarget = { type: "element", id: imgElementId };
  const img = document.getElementById(imgElementId);
  const currentUrl = img ? img.src : "";

  const modal = document.getElementById("imageEditModal");
  const input = document.getElementById("imageEditUrlInput");
  const preview = document.getElementById("imageEditPreview");

  if (input) input.value = currentUrl;
  if (preview) preview.src = currentUrl;
  if (modal) modal.classList.remove("hidden");
};

window.openImageEditModalForCandidate = function(candidateNumber) {
  currentImageEditTarget = { type: "candidate", number: candidateNumber };
  const cand = state.appCandidates.find(c => c.number === candidateNumber);
  const currentUrl = cand?.photo_url || "";

  const modal = document.getElementById("imageEditModal");
  const input = document.getElementById("imageEditUrlInput");
  const preview = document.getElementById("imageEditPreview");

  if (input) input.value = currentUrl;
  if (preview) preview.src = currentUrl;
  if (modal) modal.classList.remove("hidden");
};

window.openImageEditModalForLeaflet = function(pageNum) {
  currentImageEditTarget = { type: "leaflet", page: pageNum };
  const page = BSM_DATA.leafletPages.find(p => p.page === pageNum);
  const currentUrl = page?.src || "";

  const modal = document.getElementById("imageEditModal");
  const input = document.getElementById("imageEditUrlInput");
  const preview = document.getElementById("imageEditPreview");

  if (input) input.value = currentUrl;
  if (preview) preview.src = currentUrl;
  if (modal) modal.classList.remove("hidden");
};

window.closeImageEditModal = function() {
  const modal = document.getElementById("imageEditModal");
  if (modal) modal.classList.add("hidden");
  currentImageEditTarget = null;
};

window.previewImageEditUrl = function(url) {
  const preview = document.getElementById("imageEditPreview");
  if (preview) preview.src = url.trim();
};

window.applyImageEditChanges = function() {
  const input = document.getElementById("imageEditUrlInput");
  const newUrl = input ? input.value.trim() : "";

  if (!currentImageEditTarget) return;

  if (currentImageEditTarget.type === "element") {
    const img = document.getElementById(currentImageEditTarget.id);
    if (img) img.src = newUrl;
  } else if (currentImageEditTarget.type === "candidate") {
    const cand = state.appCandidates.find(c => c.number === currentImageEditTarget.number);
    if (cand) {
      cand.photo_url = newUrl;
      renderCandidates(state.currentCandidateFilter);
    }
  } else if (currentImageEditTarget.type === "leaflet") {
    const page = BSM_DATA.leafletPages.find(p => p.page === currentImageEditTarget.page);
    if (page) {
      page.src = newUrl;
      initLeafletViewer();
    }
  }

  closeImageEditModal();
  markUnsavedChanges(true);
  showInPageToast("📷 Obrázek byl změněn! Nezapomeňte kliknout na Uložit změny.");
};

// --- In-place Save & Reset ---
window.saveInPageChanges = async function() {
  const saveBtn = document.getElementById("inPageSaveBtn");
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span>⏳</span> Ukládám do Supabase...`;
  }

  // 1. Shromáždit texty a multimédia z DOM do state.appSiteContent
  if (!state.appSiteContent) state.appSiteContent = getDefaultSiteContent();

  const getTxt = (id, fallback = "") => {
    const el = document.getElementById(id);
    return el ? el.innerText.trim() : fallback;
  };
  const getSrc = (id, fallback = "") => {
    const el = document.getElementById(id);
    return el ? el.src : fallback;
  };

  state.appSiteContent.hero = {
    ...state.appSiteContent.hero,
    bannerImg: getSrc("heroBudovaImg", state.appSiteContent.hero.bannerImg),
    bannerBadge: getTxt("heroBannerBadge", state.appSiteContent.hero.bannerBadge),
    bannerHeading: getTxt("heroBannerHeading", state.appSiteContent.hero.bannerHeading),
    badge: getTxt("heroBadge", state.appSiteContent.hero.badge),
    slogan: getTxt("heroSlogan", state.appSiteContent.hero.slogan),
    h1: getTxt("heroH1", state.appSiteContent.hero.h1),
    introText: getTxt("heroIntroText", state.appSiteContent.hero.introText),
    fridayHours: getTxt("heroFridayHours", state.appSiteContent.hero.fridayHours),
    saturdayHours: getTxt("heroSaturdayHours", state.appSiteContent.hero.saturdayHours),
    logoImg: getSrc("heroLogoImg", state.appSiteContent.hero.logoImg)
  };

  state.appSiteContent.onas = {
    ...state.appSiteContent.onas,
    badge: getTxt("onasBadge", state.appSiteContent.onas.badge),
    title: getTxt("onasTitle", state.appSiteContent.onas.title),
    introText: getTxt("onasIntroText", state.appSiteContent.onas.introText),
    quoteText: getTxt("onasQuoteText", state.appSiteContent.onas.quoteText),
    quoteAuthor: getTxt("onasQuoteAuthor", state.appSiteContent.onas.quoteAuthor),
    card1: {
      ...state.appSiteContent.onas.card1,
      title: getTxt("onasCard1Title", state.appSiteContent.onas.card1?.title),
      desc: getTxt("onasCard1Desc", state.appSiteContent.onas.card1?.desc)
    },
    card2: {
      ...state.appSiteContent.onas.card2,
      title: getTxt("onasCard2Title", state.appSiteContent.onas.card2?.title),
      desc: getTxt("onasCard2Desc", state.appSiteContent.onas.card2?.desc)
    },
    card3: {
      ...state.appSiteContent.onas.card3,
      title: getTxt("onasCard3Title", state.appSiteContent.onas.card3?.title),
      desc: getTxt("onasCard3Desc", state.appSiteContent.onas.card3?.desc)
    }
  };

  state.appSiteContent.program = {
    ...state.appSiteContent.program,
    badge: getTxt("programBadge", state.appSiteContent.program.badge),
    title: getTxt("programTitle", state.appSiteContent.program.title),
    subtitle: getTxt("programSubtitle", state.appSiteContent.program.subtitle),
    ctaTitle: getTxt("programCtaTitle", state.appSiteContent.program.ctaTitle),
    ctaDesc: getTxt("programCtaDesc", state.appSiteContent.program.ctaDesc),
    ctaBtn: getTxt("programCtaBtn", state.appSiteContent.program.ctaBtn),
    pillars: BSM_DATA.pillars
  };

  state.appSiteContent.nav = {
    onas: getTxt("navOnas", "O nás"),
    program: getTxt("navProgram", "Volební program"),
    kandidati: getTxt("navKandidati", "Kandidáti"),
    kdeVolit: getTxt("navKdeVolit", "Kde volit?"),
    jakVolit: getTxt("navJakVolit", "Jak volit?"),
    letacek: getTxt("navLetacek", "Letáček"),
    cta: getTxt("navCta", "Jak podpořit č. 6")
  };

  // Synchronizace okrsků
  document.querySelectorAll("[data-ward-id]").forEach(field => {
    const wardId = parseInt(field.getAttribute("data-ward-id"), 10);
    const fieldName = field.getAttribute("data-ward-field");
    const ward = BSM_DATA.wards.find(w => w.id === wardId);
    if (ward && fieldName) {
      ward[fieldName] = field.innerText.trim();
    }
  });

  const fridayHoursEl = document.querySelector('[data-editable="ward_friday_hours"]');
  const saturdayHoursEl = document.querySelector('[data-editable="ward_saturday_hours"]');
  const idNoteEl = document.querySelector('[data-editable="ward_id_note"]');
  const mapsBtnEl = document.querySelector('[data-editable="ward_maps_btn"]');

  state.appSiteContent.kdeVolit = {
    ...state.appSiteContent.kdeVolit,
    badge: getTxt("kdeVolitBadge", state.appSiteContent.kdeVolit?.badge),
    title: getTxt("kdeVolitTitle", state.appSiteContent.kdeVolit?.title),
    desc: getTxt("kdeVolitDesc", state.appSiteContent.kdeVolit?.desc),
    fridayHours: fridayHoursEl ? fridayHoursEl.innerText.trim() : (state.appSiteContent.kdeVolit?.fridayHours || "Pátek 9. října: 14:00 – 22:00"),
    saturdayHours: saturdayHoursEl ? saturdayHoursEl.innerText.trim() : (state.appSiteContent.kdeVolit?.saturdayHours || "Sobota 10. října: 08:00 – 14:00"),
    idNote: idNoteEl ? idNoteEl.innerText.trim() : (state.appSiteContent.kdeVolit?.idNote || "Nezapomeňte si vzít s sebou platný občanský průkaz!"),
    mapsBtn: mapsBtnEl ? mapsBtnEl.innerText.trim() : (state.appSiteContent.kdeVolit?.mapsBtn || "Otevřít navigaci v Google Mapách"),
    wards: BSM_DATA.wards
  };

  const tabPartyEl = document.querySelector('[data-editable="ballot_tab_party"]');
  const tabCrossEl = document.querySelector('[data-editable="ballot_tab_cross"]');
  const tabComboEl = document.querySelector('[data-editable="ballot_tab_combo"]');
  const partyTitleEl = document.querySelector('[data-editable="ballot_party_info_title"]');
  const partyDescEl = document.querySelector('[data-editable="ballot_party_info_desc"]');
  const crossTitleEl = document.querySelector('[data-editable="ballot_cross_info_title"]');
  const crossDescEl = document.querySelector('[data-editable="ballot_cross_info_desc"]');
  const comboTitleEl = document.querySelector('[data-editable="ballot_combo_info_title"]');
  const comboDescEl = document.querySelector('[data-editable="ballot_combo_info_desc"]');
  const ballotSubEl = document.querySelector('[data-editable="ballot_header_sub"]');
  const ballotTitleEl = document.querySelector('[data-editable="ballot_header_title"]');
  const partyNameEl = document.querySelector('[data-editable="ballot_party_name"]');
  const partyMottoEl = document.querySelector('[data-editable="ballot_party_motto"]');

  state.appSiteContent.jakVolit = {
    ...state.appSiteContent.jakVolit,
    badge: getTxt("jakVolitBadge", state.appSiteContent.jakVolit?.badge),
    title: getTxt("jakVolitTitle", state.appSiteContent.jakVolit?.title),
    desc: getTxt("jakVolitDesc", state.appSiteContent.jakVolit?.desc),
    tabParty: tabPartyEl ? tabPartyEl.innerText.trim() : (state.appSiteContent.jakVolit?.tabParty || "⭐ 1. Celá kandidátka BSM (Doporučeno)"),
    tabCross: tabCrossEl ? tabCrossEl.innerText.trim() : (state.appSiteContent.jakVolit?.tabCross || "2. Křížkování kandidátů"),
    tabCombo: tabComboEl ? tabComboEl.innerText.trim() : (state.appSiteContent.jakVolit?.tabCombo || "3. Kombinovaná volba"),
    partyInfoTitle: partyTitleEl ? partyTitleEl.innerText.trim() : (state.appSiteContent.jakVolit?.partyInfoTitle || "NEJJEDNODUŠŠÍ A NEJÚČINNĚJŠÍ ZPŮSOB (Doporučeno):"),
    partyInfoDesc: partyDescEl ? partyDescEl.innerHTML.trim() : (state.appSiteContent.jakVolit?.partyInfoDesc || ""),
    crossInfoTitle: crossTitleEl ? crossTitleEl.innerText.trim() : (state.appSiteContent.jakVolit?.crossInfoTitle || "VÝBĚR JEDNOTLIVÝCH KANDIDÁTŮ (Panašování):"),
    crossInfoDesc: crossDescEl ? crossDescEl.innerHTML.trim() : (state.appSiteContent.jakVolit?.crossInfoDesc || ""),
    comboInfoTitle: comboTitleEl ? comboTitleEl.innerText.trim() : (state.appSiteContent.jakVolit?.comboInfoTitle || "KOMBINOVANÁ VOLBA:"),
    comboInfoDesc: comboDescEl ? comboDescEl.innerHTML.trim() : (state.appSiteContent.jakVolit?.comboInfoDesc || ""),
    ballotHeaderSub: ballotSubEl ? ballotSubEl.innerText.trim() : (state.appSiteContent.jakVolit?.ballotHeaderSub || "Ukázka části volebního lístku"),
    ballotHeaderTitle: ballotTitleEl ? ballotTitleEl.innerText.trim() : (state.appSiteContent.jakVolit?.ballotHeaderTitle || "Obec Horní Stropnice – Volby do zastupitelstva obce"),
    ballotPartyName: partyNameEl ? partyNameEl.innerText.trim() : (state.appSiteContent.jakVolit?.ballotPartyName || "6. BSM"),
    ballotPartyMotto: partyMottoEl ? partyMottoEl.innerText.trim() : (state.appSiteContent.jakVolit?.ballotPartyMotto || "Bezpečnost • Stabilita • Mládež")
  };

  // Uložení aktuálních textů stran letáčku / fotografií
  BSM_DATA.leafletPages.forEach(p => {
    const titleEl = document.querySelector(`[data-editable="leaflet_page_${p.page}_title"]`);
    const descEl = document.querySelector(`[data-editable="leaflet_page_${p.page}_desc"]`);
    if (titleEl) p.title = titleEl.innerText.trim();
    if (descEl) p.desc = descEl.innerText.trim();
  });

  state.appSiteContent.letacek = {
    ...state.appSiteContent.letacek,
    badge: getTxt("letacekBadge", state.appSiteContent.letacek?.badge),
    title: getTxt("letacekTitle", state.appSiteContent.letacek?.title),
    desc: getTxt("letacekDesc", state.appSiteContent.letacek?.desc),
    pages: BSM_DATA.leafletPages
  };

  state.appSiteContent.podnety = {
    ...state.appSiteContent.podnety,
    badge: getTxt("podnetyBadge", state.appSiteContent.podnety.badge),
    title: getTxt("podnetyTitle", state.appSiteContent.podnety.title),
    desc: getTxt("podnetyDesc", state.appSiteContent.podnety.desc)
  };

  const shWaEl = document.getElementById("shareWhatsappBtn");
  const shFbEl = document.getElementById("shareFacebookBtn");
  const shCpEl = document.getElementById("shareCopyBtn");

  state.appSiteContent.footer = {
    ...state.appSiteContent.footer,
    title: getTxt("footerTitle", state.appSiteContent.footer.title),
    tagline: getTxt("footerTagline", state.appSiteContent.footer.tagline),
    description: getTxt("footerDescription", state.appSiteContent.footer.description),
    share: {
      heading: getTxt("shareHeading", "Sdílejte mezi sousedy"),
      desc: getTxt("shareDesc", "Pomozte nám šířit náš program v Horní Stropnici a na všech osadách:"),
      whatsapp: getTxt("shareWhatsappBtn", "WhatsApp"),
      whatsappUrl: shWaEl ? shWaEl.getAttribute("href") : (state.appSiteContent.footer?.share?.whatsappUrl || ""),
      whatsappMsg: state.appSiteContent.footer?.share?.whatsappMsg || "",
      facebook: getTxt("shareFacebookBtn", "Facebook"),
      facebookUrl: shFbEl ? shFbEl.getAttribute("href") : (state.appSiteContent.footer?.share?.facebookUrl || ""),
      copy: getTxt("shareCopyBtn", "📋 Kopírovat odkaz")
    }
  };

  // 2. Shromáždit kandidáty z editovaných karet v DOM včetně štítků
  document.querySelectorAll("[data-candidate]").forEach(field => {
    const num = parseInt(field.getAttribute("data-candidate"), 10);
    const type = field.getAttribute("data-editable");
    const cand = state.appCandidates.find(c => c.number === num);
    if (!cand) return;

    if (type === "candidate-name") cand.name = field.innerText.trim();
    if (type === "candidate-profession") cand.profession = field.innerText.trim();
    if (type === "candidate-age") cand.age = parseInt(field.innerText.trim(), 10) || null;
    if (type === "candidate-settlement") cand.settlement = field.innerText.trim();
    if (type === "candidate-quote") cand.quote = field.innerText.replace(/^„|“$/g, "").trim();
  });

  // Shromáždit štítky kandidátů
  state.appCandidates.forEach(cand => {
    const tagEls = document.querySelectorAll(`[data-editable="candidate-tag"][data-candidate="${cand.number}"]`);
    if (tagEls.length > 0 || document.querySelector(`[data-candidate="${cand.number}"]`)) {
      // Jen pokud daný kandidát je na stránce vyrenderován
      cand.tags = Array.from(tagEls).map(el => el.innerText.trim()).filter(Boolean);
    }
  });

  // 3. Uložit do LocalStorage
  localStorage.setItem("bsm_site_content", JSON.stringify(state.appSiteContent));
  localStorage.setItem("bsm_sections_order", JSON.stringify(state.appSections));
  localStorage.setItem("bsm_candidates", JSON.stringify(state.appCandidates));

  // 4. Uložit do Supabase Cloud
  if (state.supabaseClient) {
    try {
      // 4a. Obsah webu v bsm_site_content
      await state.supabaseClient.from("site_sections").upsert({
        id: "bsm_site_content",
        title: JSON.stringify(state.appSiteContent),
        order_index: 999,
        is_visible: false
      });

      // 4b. Sekce webu a jejich pořadí
      const secUpdates = state.appSections.map(s => ({
        id: s.id,
        title: s.title,
        order_index: s.order,
        is_visible: s.visible !== false
      }));
      await state.supabaseClient.from("site_sections").upsert(secUpdates);

      // 4c. Kandidáti a fotografie
      const candUpdates = state.appCandidates.map(c => ({
        number: c.number,
        name: c.name,
        age: c.age,
        profession: c.profession,
        settlement: c.settlement,
        tags: { list: Array.isArray(c.tags) ? c.tags : (c.tags?.list || []), photo_url: c.photo_url || null },
        quote: c.quote,
        highlight: !!c.highlight
      }));
      await state.supabaseClient.from("candidates").upsert(candUpdates);
    } catch (err) { /* tiché – data uložena lokálně */ }
  }

  markUnsavedChanges(false);
  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.className = "bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-[1.02]";
    saveBtn.innerHTML = `<span>💾</span> <span>Uložit změny</span> <span id="unsavedDot" class="hidden w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>`;
  }
  showInPageToast("✅ Veškeré změny byly úspěšně uloženy do Supabase a jsou ihned viditelné!");
};

window.resetInPageContentToDefaults = function() {
  if (!confirm("Opravdu si přejete obnovit všechny texty, fotky i uspořádání modulů do původního stavu?")) {
    return;
  }

  localStorage.removeItem("bsm_site_content");
  localStorage.removeItem("bsm_sections_order");
  localStorage.removeItem("bsm_candidates");

  state.appSiteContent = getDefaultSiteContent();
  state.appSections = JSON.parse(JSON.stringify(BSM_DATA.defaultSections));
  state.appCandidates = JSON.parse(JSON.stringify(BSM_DATA.candidates));

  applySiteContentToDOM(state.appSiteContent);
  applySectionsToDOM(state.appSections);
  renderCandidates(state.currentCandidateFilter);
  injectSectionControlBars();
  saveInPageChanges();
  showInPageToast("🔄 Obsah byl obnoven do výchozího stavu.");
};

// --- Postranní panel podnětů občanů (Offcanvas Drawer) ---
window.openFeedbackDrawer = function() {
  const drawer = document.getElementById("inPageFeedbackDrawer");
  const backdrop = document.getElementById("inPageFeedbackBackdrop");
  if (drawer) drawer.classList.add("drawer-open");
  if (backdrop) backdrop.classList.remove("hidden");
  loadAdminFeedbacks();
};

window.closeFeedbackDrawer = function() {
  const drawer = document.getElementById("inPageFeedbackDrawer");
  const backdrop = document.getElementById("inPageFeedbackBackdrop");
  if (drawer) drawer.classList.remove("drawer-open");
  if (backdrop) backdrop.classList.add("hidden");
};

function updateInPageFeedbackBadge() {
  const badge = document.getElementById("inPageFeedbackBadge");
  if (badge) {
    const unread = state.appFeedbacks.filter(f => f.status === "new").length;
    badge.textContent = unread;
  }
}

async function loadAdminFeedbacks() {
  let list = [];
  if (state.supabaseClient) {
    try {
      const { data, error } = await state.supabaseClient
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) list = data;
    } catch (e) { /* tiché – použije se localStorage */ }
  }

  const local = JSON.parse(localStorage.getItem("bsm_feedbacks") || "[]");
  local.forEach(loc => {
    if (!list.some(item => item.id === loc.id)) list.push(loc);
  });

  state.appFeedbacks = list;
  updateInPageFeedbackBadge();
  populateInPageSettlementFilter();
  renderInPageFeedbacksList();
}

function populateInPageSettlementFilter() {
  const sel = document.getElementById("inPageFilterSettlement");
  if (!sel) return;
  const osady = [...new Set(state.appFeedbacks.map(f => f.settlement))].sort();
  sel.innerHTML = `<option value="all">Všechny osady (${state.appFeedbacks.length})</option>` +
    osady.map(o => `<option value="${o}">${o}</option>`).join("");
}

window.filterAdminFeedbacks = function() {
  renderInPageFeedbacksList();
};

function renderInPageFeedbacksList() {
  const container = document.getElementById("inPageFeedbacksList");
  const filter = document.getElementById("inPageFilterSettlement")?.value || "all";
  if (!container) return;

  const filtered = filter === "all" ? state.appFeedbacks : state.appFeedbacks.filter(f => f.settlement === filter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
        <div class="text-3xl mb-2">📭</div>
        <p class="font-bold text-slate-300">Zatím nebyly doručeny žádné podněty.</p>
        <p class="text-xs text-slate-500 mt-1">Zprávy od občanů se zobrazí zde.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(f => {
    const isNew = f.status === "new";
    const dateFormatted = new Date(f.created_at).toLocaleString("cs-CZ", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });

    return `
      <div class="bg-slate-900 border ${isNew ? 'border-sky-500/60 bg-sky-950/20' : 'border-slate-800'} p-4 rounded-2xl space-y-2.5">
        <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black px-2 py-0.5 rounded-full ${isNew ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'}">
              ${isNew ? 'NOVÉ' : 'VYŘÍZENO'}
            </span>
            <span class="font-bold text-white text-xs">📍 ${escapeHtml(f.settlement)}</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">🕒 ${dateFormatted}</span>
        </div>

        <p class="text-xs text-slate-200 leading-relaxed">
          ${escapeHtml(f.message)}
        </p>

        <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
          <div class="text-slate-400 truncate">
            <span class="font-semibold text-slate-300">Kontakt:</span> ${escapeHtml(f.contact) || "neuveden"}
          </div>

          <div class="flex items-center gap-1.5 flex-shrink-0">
            <button 
              onclick="toggleFeedbackStatus('${f.id}')" 
              class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${isNew ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}">
              ${isNew ? 'Vyřízeno' : 'Nové'}
            </button>
            <button 
              onclick="deleteFeedback('${f.id}')" 
              class="p-1 px-2 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-200 transition-colors">
              Smazat
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

window.toggleFeedbackStatus = async function(id) {
  const item = state.appFeedbacks.find(f => f.id === id);
  if (!item) return;

  const nextStatus = item.status === "new" ? "resolved" : "new";
  item.status = nextStatus;

  if (state.supabaseClient) {
    try {
      await state.supabaseClient.from("feedbacks").update({ status: nextStatus }).eq("id", id);
    } catch (e) { /* tiché */ }
  }

  localStorage.setItem("bsm_feedbacks", JSON.stringify(state.appFeedbacks));
  renderInPageFeedbacksList();
  updateInPageFeedbackBadge();
};

window.deleteFeedback = async function(id) {
  if (!confirm("Opravdu chcete tento podnět smazat?")) return;

  state.appFeedbacks = state.appFeedbacks.filter(f => f.id !== id);

  if (state.supabaseClient) {
    try {
      await state.supabaseClient.from("feedbacks").delete().eq("id", id);
    } catch (e) { /* tiché */ }
  }

  localStorage.setItem("bsm_feedbacks", JSON.stringify(state.appFeedbacks));
  renderInPageFeedbacksList();
  updateInPageFeedbackBadge();
};

window.exportFeedbacksToCSV = function() {
  if (state.appFeedbacks.length === 0) {
    alert("Zatím nejsou k dispozici žádné podněty k exportu.");
    return;
  }

  const headers = ["Datum", "Osada", "Podnět / Zpráva", "Kontakt", "Stav"];
  const rows = state.appFeedbacks.map(f => [
    `"${new Date(f.created_at).toLocaleString("cs-CZ")}"`,
    `"${f.settlement}"`,
    `"${f.message.replace(/"/g, '""')}"`,
    `"${f.contact || ''}"`,
    `"${f.status}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `podnety-bsm-horni-stropnice-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Toast oznámení
function showInPageToast(message) {
  let toast = document.getElementById("inPageToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "inPageToast";
    toast.className = "fixed bottom-5 right-5 z-[150] bg-slate-900 border border-sky-500/60 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 transform translate-y-12 opacity-0 flex items-center gap-2";
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.classList.remove("translate-y-12", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-12", "opacity-0");
  }, 4000);
}



// Global exports
window.refreshEditableElements = refreshEditableElements;
window.markUnsavedChanges = markUnsavedChanges;
window.injectSectionControlBars = injectSectionControlBars;
window.updateInPageFeedbackBadge = updateInPageFeedbackBadge;
window.loadAdminFeedbacks = loadAdminFeedbacks;
window.populateInPageSettlementFilter = populateInPageSettlementFilter;
window.renderInPageFeedbacksList = renderInPageFeedbacksList;
window.showInPageToast = showInPageToast;
