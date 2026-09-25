import { state } from './state.js';

// ==============================================================================
// 2. MODULÁRNÍ SEKCE (POŘADÍ A VIDITELNOST)
// ==============================================================================

async function loadAndApplySections() {
  let sections = null;

  if (state.supabaseClient) {
    try {
      const { data, error } = await state.supabaseClient
        .from("site_sections")
        .select("*")
        .order("order_index", { ascending: true });
      if (!error && data && data.length > 0) {
        sections = data
          .filter(s => s.id !== "bsm_site_content")
          .map(s => ({
            id: s.id,
            title: s.title,
            order: s.order_index,
            visible: s.is_visible
          }));
      }
    } catch (e) {
      console.warn("Chyba čtení sekcí ze Supabase:", e);
    }
  }

  if (!sections) {
    const local = localStorage.getItem("bsm_sections_order");
    if (local) {
      try {
        sections = JSON.parse(local).filter(s => s.id !== "bsm_site_content");
      } catch (e) { console.error("Chyba parsování sekcí z localStorage:", e); }
    }
  }

  if (!sections || sections.length === 0) {
    sections = JSON.parse(JSON.stringify(BSM_DATA.defaultSections));
  }

  state.appSections = sections;
  applySectionsToDOM(state.appSections);
}

function applySectionsToDOM(sections) {
  const container = document.getElementById("modularSectionsContainer");
  if (!container) return;

  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const isEdit = typeof state.isInPageEditActive !== "undefined" && state.isInPageEditActive;

  sorted.forEach(sec => {
    const el = document.getElementById(sec.id);
    if (el) {
      container.appendChild(el);
      if (sec.visible === false) {
        if (isEdit) {
          el.classList.remove("hidden");
          el.classList.add("section-hidden-admin");
        } else {
          el.classList.add("hidden");
          el.classList.remove("section-hidden-admin");
        }
      } else {
        el.classList.remove("hidden");
        el.classList.remove("section-hidden-admin");
      }
    }
  });
}



// Global exports
window.loadAndApplySections = loadAndApplySections;
window.applySectionsToDOM = applySectionsToDOM;
