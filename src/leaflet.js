import { state } from './state.js';

// ==============================================================================
// 10. PROHLÍŽEČ LETÁČKU & MOBILNÍ MENU
// ==============================================================================

function initLeafletViewer() {
  const container = document.getElementById("leafletGallery");
  if (!container) return;

  const isEditActive = typeof state.isInPageEditActive !== "undefined" && state.isInPageEditActive;

  let galleryHtml = BSM_DATA.leafletPages.map((page, idx) => `
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col relative">
      
      <!-- Ovládací lišta fotografie pro správce (posun, smazání) -->
      <div class="photo-card-control-bar">
        <button 
          type="button" 
          onclick="event.stopPropagation(); moveLeafletPhoto(${idx}, -1)" 
          class="text-sky-300 hover:text-white px-1.5 py-0.5 rounded text-xs font-bold ${idx === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}" 
          title="Posunout doleva"
          ${idx === 0 ? 'disabled' : ''}>◀</button>
        <button 
          type="button" 
          onclick="event.stopPropagation(); moveLeafletPhoto(${idx}, 1)" 
          class="text-sky-300 hover:text-white px-1.5 py-0.5 rounded text-xs font-bold ${idx === BSM_DATA.leafletPages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}" 
          title="Posunout doprava"
          ${idx === BSM_DATA.leafletPages.length - 1 ? 'disabled' : ''}>▶</button>
        <button 
          type="button" 
          onclick="event.stopPropagation(); deleteLeafletPhoto(${page.page})" 
          class="text-red-400 hover:text-red-200 px-1.5 py-0.5 rounded text-xs font-bold cursor-pointer" 
          title="Smazat tuto fotografii / stranu">🗑️</button>
      </div>

      <div class="relative overflow-hidden bg-slate-100 aspect-[3/4] cursor-pointer" onclick="openLeafletModal('${page.src}', '${page.title}')">
        <img 
          id="leaflet-page-img-${page.page}"
          src="${page.src}" 
          alt="${page.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="bg-white/95 text-slate-900 font-bold px-3 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-1.5">
            🔍 Zvětšit foto ${idx + 1}
          </span>
        </div>
      </div>
      <div class="img-edit-container">
        <button 
          onclick="event.stopPropagation(); openImageEditModalForLeaflet(${page.page})" 
          class="img-edit-btn"
          title="Změnit obrázek / fotografii">
          📷 Změnit fotografii
        </button>
      </div>
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span class="text-[10px] font-extrabold text-bsm-800 uppercase tracking-wider">Foto / Strana ${idx + 1}</span>
          <h4 class="font-bold text-slate-900 text-sm mt-0.5" data-editable="leaflet_page_${page.page}_title">${escapeHtml(page.title)}</h4>
          <p class="text-xs text-slate-500 mt-1" data-editable="leaflet_page_${page.page}_desc">${escapeHtml(page.desc)}</p>
        </div>
        <button 
          onclick="openLeafletModal('${page.src}', '${page.title}')" 
          class="mt-3 w-full text-xs font-semibold py-2 px-3 bg-slate-100 hover:bg-sky-100 text-bsm-900 rounded-lg transition-colors text-center">
          Zobrazit v plné velikosti
        </button>
      </div>
    </div>
  `).join("");

  // Pokud je aktivní režim úprav, přidáme přímo do mřížky velkou interaktivní kartu "+"
  if (isEditActive) {
    galleryHtml += `
      <div onclick="addNewLeafletPhoto()" class="leaflet-add-card group" title="Klikněte pro přidání další fotografie / strany do galerie">
        <div class="w-14 h-14 rounded-full bg-sky-600 group-hover:bg-sky-500 text-white flex items-center justify-center text-2xl font-black shadow-md mb-2 transition-transform group-hover:scale-110">
          ➕
        </div>
        <div class="font-extrabold text-slate-900 text-sm">Přidat fotografii / stranu</div>
        <div class="text-xs text-slate-500 mt-1">Nahrát další snímek nebo stranu do galerie</div>
      </div>
    `;
  }

  container.innerHTML = galleryHtml;

  if (isEditActive) {
    refreshEditableElements();
  }
}

window.addNewLeafletPhoto = function() {
  const pages = BSM_DATA.leafletPages;
  const nextNum = pages.length > 0 ? Math.max(...pages.map(p => p.page || 0)) + 1 : 1;
  pages.push({
    page: nextNum,
    title: `Fotografie č. ${pages.length + 1}`,
    desc: "Zadejte popis této fotografie nebo materiálu...",
    src: "assets/leaflet/letacek_1_uvod.jpg"
  });
  initLeafletViewer();
  markUnsavedChanges(true);
  showInPageToast(`➕ Nová fotografie přidána (celkem ${pages.length}). Můžete změnit obrázek i popis.`);
};

window.deleteLeafletPhoto = function(pageNumber) {
  if (BSM_DATA.leafletPages.length <= 1) {
    alert("V galerii musí zůstat alespoň 1 fotografie.");
    return;
  }
  if (!confirm("Opravdu chcete tuto fotografii z webu odstranit?")) return;
  BSM_DATA.leafletPages = BSM_DATA.leafletPages.filter(p => p.page !== pageNumber);
  initLeafletViewer();
  markUnsavedChanges(true);
  showInPageToast(`🗑️ Fotografie byla odstraněna (zbývá ${BSM_DATA.leafletPages.length}).`);
};

window.moveLeafletPhoto = function(index, direction) {
  const pages = BSM_DATA.leafletPages;
  const targetIdx = index + direction;
  if (targetIdx < 0 || targetIdx >= pages.length) return;
  const temp = pages[index];
  pages[index] = pages[targetIdx];
  pages[targetIdx] = temp;
  initLeafletViewer();
  markUnsavedChanges(true);
};

window.openLeafletModal = function(src, title) {
  const modal = document.getElementById("leafletModal");
  const modalImg = document.getElementById("leafletModalImg");
  const modalTitle = document.getElementById("leafletModalTitle");
  if (!modal || !modalImg) return;

  modalImg.src = src;
  if (modalTitle) modalTitle.textContent = title;
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
};

window.closeLeafletModal = function() {
  const modal = document.getElementById("leafletModal");
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
};

function initMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuToggle");
  const menu = document.getElementById("mobileMenu");
  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
    });
  });
}




// Global exports
window.initLeafletViewer = initLeafletViewer;
window.initMobileMenu = initMobileMenu;
