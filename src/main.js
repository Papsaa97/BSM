import { state } from './state.js';

/**
 * Interaktivní logika volební prezentace BSM – Horní Stropnice
 * Zahrnuje: modulární sekce, funkční formulář podnětů, napojení na Supabase a administrátorský režim.
 */


// Bezpečnostní utilita: escapování HTML pro prevenci XSS (K1 audit)
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", async () => {
  initLucideIcons();
  initSupabaseClient();
  await loadSiteContent();
  await loadAndApplySections();
  await loadAndRenderCandidates();
  renderProgramPillars();
  initSettlementFinder();
  initBallotSimulator();
  initLeafletViewer();
  initFeedbackForm();
  initMobileMenu();
  checkAdminSession();
  setupKeyboardShortcuts();
});

// Inicializace Lucide ikon
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}



// Global exports
window.escapeHtml = escapeHtml;
window.initLucideIcons = initLucideIcons;
