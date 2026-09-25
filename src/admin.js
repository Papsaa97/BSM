import { state } from './state.js';

// ==============================================================================
// 8. AUTENTIZACE SPRÁVCE (ADMIN LOGIN & SESSION)
// ==============================================================================

function checkAdminSession() {
  const savedUser = localStorage.getItem("bsm_admin_user");
  if (!savedUser) return;
  try {
    state.currentAdminUser = JSON.parse(savedUser);
    localStorage.setItem("bsm_admin_user", JSON.stringify(state.currentAdminUser));
    showInPageAdminBar(state.currentAdminUser.email);
    enableInPageEditing();
  } catch (e) {
    console.error("Chyba obnovy admin session:", e);
    localStorage.removeItem("bsm_admin_user");
  }
}

function setupKeyboardShortcuts() {
  window.addEventListener("keydown", (e) => {
    // Ctrl + Shift + A pro přihlášení / přepnutí editace
    if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      if (state.currentAdminUser) {
        toggleInPageEditMode();
      } else {
        openAdminLoginModal();
      }
    }

    // Ctrl + S pro uložení změn přímo na stránce
    if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
      if (state.currentAdminUser && state.isInPageEditActive) {
        e.preventDefault();
        saveInPageChanges();
      }
    }

    // Escape zavírá otevřené modály a panely
    if (e.key === "Escape") {
      closeAdminLoginModal();
      closeLeafletModal();
      closeImageEditModal();
      closeFeedbackDrawer();
    }
  });
}

window.openAdminLoginModal = function() {
  if (state.currentAdminUser) {
    enableInPageEditing();
    showInPageToast("Jste přihlášen. Režim přímých úprav na stránce je aktivní.");
    return;
  }
  const modal = document.getElementById("adminLoginModal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }
};

window.closeAdminLoginModal = function() {
  const modal = document.getElementById("adminLoginModal");
  if (modal) modal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
  const errBox = document.getElementById("adminLoginError");
  if (errBox) errBox.classList.add("hidden");
};

window.handleAdminLogin = async function(e) {
  e.preventDefault();
  const email = document.getElementById("adminLoginEmail").value.trim();
  const password = document.getElementById("adminLoginPassword").value;
  const submitBtn = document.getElementById("adminLoginSubmitBtn");
  const errBox = document.getElementById("adminLoginError");

  submitBtn.disabled = true;
  submitBtn.textContent = "Ověřuji přihlášení...";
  errBox.classList.add("hidden");

  let loginSuccess = false;
  let userObject = null;

  // 1. Zkusíme přihlášení přes Supabase Auth
  if (state.supabaseClient) {
    try {
      const { data, error } = await state.supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (!error && data && data.user) {
        loginSuccess = true;
        userObject = {
          email: data.user.email,
          id: data.user.id,
          source: "supabase"
        };
      } else {
        console.warn("Chyba Supabase Auth:", error);
      }
    } catch (err) {
      console.warn("Chyba při přihlašování přes Supabase:", err);
    }
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Přihlásit se do správy";

  if (loginSuccess && userObject) {
    state.currentAdminUser = userObject;
    localStorage.setItem("bsm_admin_user", JSON.stringify(state.currentAdminUser));
    showInPageAdminBar(state.currentAdminUser.email);
    closeAdminLoginModal();
    enableInPageEditing();
    showInPageToast("✨ Vítejte! Režim přímých úprav přímo na stránce byl aktivován. Klikněte do libovolného textu a začněte psát.");
  } else {
    errBox.classList.remove("hidden");
    errBox.textContent = "Neplatné přihlašovací údaje nebo chyba připojení k databázi.";
  }
};

function showInPageAdminBar(email) {
  const bar = document.getElementById("inPageAdminBar");
  const emailEl = document.getElementById("adminUserEmail");
  if (bar) bar.classList.remove("hidden");
  if (emailEl) emailEl.textContent = `(${email})`;
  updateInPageFeedbackBadge();
}

window.logoutAdmin = async function() {
  if (state.supabaseClient && state.currentAdminUser?.source === "supabase") {
    try {
      await state.supabaseClient.auth.signOut();
    } catch (e) { console.error("Chyba při odhlášení ze Supabase:", e); }
  }
  state.currentAdminUser = null;
  localStorage.removeItem("bsm_admin_user");
  disableInPageEditing();
  const bar = document.getElementById("inPageAdminBar");
  if (bar) bar.classList.add("hidden");
  showInPageToast("Byl jste úspěšně odhlášen.");
};



// Global exports
window.checkAdminSession = checkAdminSession;
window.setupKeyboardShortcuts = setupKeyboardShortcuts;
window.showInPageAdminBar = showInPageAdminBar;
