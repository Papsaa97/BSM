import { state } from './state.js';

// ==============================================================================
// 7. FUNKČNÍ FORMULÁŘ PODNĚTŮ (SBĚR DAT DO SUPABASE / LOCALSTORAGE)
// ==============================================================================

function initFeedbackForm() {
  const form = document.getElementById("citizenFeedbackForm");
  const select = document.getElementById("feedbackSettlement");
  if (select) {
    select.innerHTML = `
      <option value="">-- Vyberte vaši osadu / část obce --</option>
      ${BSM_DATA.allSettlements.map(s => `<option value="${s.name}">${s.name}</option>`).join("")}
    `;
  }

  if (form) {
    form.addEventListener("submit", handleCitizenFeedbackSubmit);
  }
}

async function handleCitizenFeedbackSubmit(e) {
  e.preventDefault();
  const settlement = document.getElementById("feedbackSettlement").value;
  const message = document.getElementById("feedbackMessage").value.trim();
  const contact = document.getElementById("feedbackContact").value.trim();
  const submitBtn = e.target.querySelector("button[type='submit']");
  const statusBox = document.getElementById("feedbackStatus");

  if (!message) {
    alert("Prosím napište váš nápad nebo podnět.");
    return;
  }

  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="inline-flex items-center gap-2">
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      Odesílám podnět...
    </span>
  `;

  const newFeedback = {
    id: "fb_" + Date.now(),
    settlement: settlement || "Horní Stropnice (obec)",
    message: message,
    contact: contact || "neuvedeno",
    created_at: new Date().toISOString(),
    status: "new"
  };

  let savedSuccess = false;

  // 1. Zkusíme uložit do Supabase
  if (state.supabaseClient) {
    try {
      const { data, error } = await state.supabaseClient
        .from("feedbacks")
        .insert([{
          settlement: newFeedback.settlement,
          message: newFeedback.message,
          contact: newFeedback.contact,
          status: "new"
        }]);

      if (!error) {
        savedSuccess = true;
      }
    } catch (err) { /* tiché – použije se localStorage fallback */ }
  }

  // 2. Fallback do LocalStorage POUZE pokud Supabase uložení neproběhlo (K2 audit)
  if (!savedSuccess) {
    const localFeedbacks = JSON.parse(localStorage.getItem("bsm_feedbacks") || "[]");
    localFeedbacks.unshift(newFeedback);
    localStorage.setItem("bsm_feedbacks", JSON.stringify(localFeedbacks));
    savedSuccess = true;
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = originalBtnText;

  if (savedSuccess) {
    if (statusBox) {
      statusBox.classList.remove("hidden");
      statusBox.innerHTML = `
        <div class="bg-emerald-500/20 border border-emerald-400 text-emerald-100 p-5 rounded-2xl text-sm shadow-xl">
          <div class="flex items-center gap-2 font-bold text-white text-base mb-1">
            <span>✅</span> Váš podnět byl úspěšně zaznamenán!
          </div>
          <p class="text-xs text-emerald-200 leading-relaxed">
            Děkujeme za váš zájem o osadu <strong>${newFeedback.settlement}</strong>. Všechny podněty průběžně pročítáme v administraci a zařazujeme do priorit našeho týmu BSM.
          </p>
        </div>
      `;
      // Hladké scrollování k potvrzení
      statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    e.target.reset();

    // Pokud je správce přihlášen, aktualizujeme badge
    updateInPageFeedbackBadge();
  }
}



// Global exports
window.initFeedbackForm = initFeedbackForm;
window.handleCitizenFeedbackSubmit = handleCitizenFeedbackSubmit;
