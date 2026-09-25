import { state } from './state.js';

// ==============================================================================
// 11. SPRÁVA ODKAZŮ A TLAČÍTEK (LINK & BUTTON MODAL)
// ==============================================================================

let currentLinkEditTarget = null;

window.openLinkEditModal = function(elementId, options = {}) {
  const el = document.getElementById(elementId);
  if (!el) return;

  currentLinkEditTarget = { elementId, options };

  const modal = document.getElementById("linkEditModal");
  const modalTitle = document.getElementById("linkEditModalTitle");
  const textInput = document.getElementById("linkEditTextInput");
  const urlInput = document.getElementById("linkEditUrlInput");
  const msgField = document.getElementById("linkEditCustomMessageField");
  const msgInput = document.getElementById("linkEditMessageInput");
  const newTabInput = document.getElementById("linkEditNewTabInput");

  const urlField = document.getElementById("linkEditUrlField");
  const fbUrlField = document.getElementById("linkEditFacebookUrlField");
  const fbUrlInput = document.getElementById("linkEditFacebookUrlInput");

  if (!modal || !textInput || !urlInput) return;

  textInput.value = el.innerText.trim();
  urlInput.value = el.getAttribute("href") || "";

  if (options.type === "whatsapp") {
    modalTitle.innerHTML = "<span>💬</span> Upravit tlačítko a zprávu pro WhatsApp";
    msgField.classList.remove("hidden");
    urlField.classList.add("hidden");
    if (fbUrlField) fbUrlField.classList.add("hidden");
    
    const currentMsg = state.appSiteContent.footer?.share?.whatsappMsg || "Podívejte se na program a kandidáty BSM pro Horní Stropnici (Volební číslo 6): https://bsm-horni-stropnice.vercel.app";
    msgInput.value = currentMsg;
  } else if (options.type === "facebook") {
    modalTitle.innerHTML = "<span>📘</span> Upravit sdílený odkaz pro Facebook";
    msgField.classList.add("hidden");
    urlField.classList.add("hidden");
    if (fbUrlField) {
      fbUrlField.classList.remove("hidden");
      const currentFbShareUrl = state.appSiteContent.footer?.share?.facebookShareUrl || "https://bsm-horni-stropnice.vercel.app";
      if (fbUrlInput) fbUrlInput.value = currentFbShareUrl;
    }
  } else {
    modalTitle.innerHTML = "<span>🔗</span> Upravit odkaz a tlačítko";
    msgField.classList.add("hidden");
    urlField.classList.remove("hidden");
    if (fbUrlField) fbUrlField.classList.add("hidden");
  }

  newTabInput.checked = el.getAttribute("target") === "_blank";

  modal.classList.remove("hidden");
};

window.closeLinkEditModal = function() {
  const modal = document.getElementById("linkEditModal");
  if (modal) modal.classList.add("hidden");
  currentLinkEditTarget = null;
};

window.saveLinkEditModal = function() {
  if (!currentLinkEditTarget) return;

  const { elementId, options } = currentLinkEditTarget;
  const el = document.getElementById(elementId);
  const textInput = document.getElementById("linkEditTextInput");
  const urlInput = document.getElementById("linkEditUrlInput");
  const msgInput = document.getElementById("linkEditMessageInput");
  const fbUrlInput = document.getElementById("linkEditFacebookUrlInput");

  if (!el || !textInput || !urlInput) return;

  const newText = textInput.value.trim();
  let newUrl = urlInput.value.trim();

  if (newText) {
    el.innerText = newText;
  }

  if (options.type === "whatsapp") {
    const customMsg = msgInput.value.trim();
    if (customMsg) {
      newUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(customMsg)}`;
      if (!state.appSiteContent.footer.share) state.appSiteContent.footer.share = {};
      state.appSiteContent.footer.share.whatsappMsg = customMsg;
      state.appSiteContent.footer.share.whatsappUrl = newUrl;
    }
  } else if (options.type === "facebook") {
    const customFbUrl = fbUrlInput ? fbUrlInput.value.trim() : "";
    if (customFbUrl) {
      newUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(customFbUrl)}`;
      if (!state.appSiteContent.footer.share) state.appSiteContent.footer.share = {};
      state.appSiteContent.footer.share.facebookShareUrl = customFbUrl;
      state.appSiteContent.footer.share.facebookUrl = newUrl;
    }
  }

  if (newUrl) {
    el.setAttribute("href", newUrl);
  }

  if (newTabInput.checked) {
    el.setAttribute("target", "_blank");
  } else {
    el.removeAttribute("target");
  }

  markUnsavedChanges(true);
  showInPageToast("🔗 Odkaz tlačítka byl úspěšně upraven.");
  closeLinkEditModal();
};

window.copyPageShareLink = function() {
  navigator.clipboard.writeText(window.location.href);
  showInPageToast("📋 Odkaz na web byl zkopírován do schránky!");
};

