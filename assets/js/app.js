/**
 * Interaktivní logika volební prezentace BSM – Horní Stropnice
 * Zahrnuje: modulární sekce, funkční formulář podnětů, napojení na Supabase a administrátorský režim.
 */

// Stav aplikace
let supabaseClient = null;
let currentAdminUser = null;
let appSections = [];
let appCandidates = [];
let appFeedbacks = [];

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

// ==============================================================================
// 1. SUPABASE KLIENT A STAV
// ==============================================================================

function initSupabaseClient() {
  // Kontrola uložené konfigurace v LocalStorage nebo výchozí v data.js
  const savedConfig = localStorage.getItem("bsm_supabase_config");
  let config = BSM_DATA.supabase;
  if (savedConfig) {
    try {
      config = JSON.parse(savedConfig);
    } catch (e) {
      console.error("Chyba čtení konfigurace Supabase:", e);
    }
  }

  if (window.supabase && config.url && config.anonKey) {
    try {
      supabaseClient = window.supabase.createClient(config.url, config.anonKey);
      console.log("Supabase klient inicializován pro:", config.url);
    } catch (err) {
      console.warn("Nepodařilo se připojit k Supabase:", err);
      supabaseClient = null;
    }
  } else {
    supabaseClient = null;
  }

  updateSupabaseStatusBadge();
}

function updateSupabaseStatusBadge() {
  const badge = document.getElementById("supabaseStatusBadge");
  if (!badge) return;

  if (supabaseClient) {
    badge.innerHTML = "🟢 Supabase Cloud";
    badge.className = "text-[11px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-semibold";
  } else {
    badge.innerHTML = "🟡 Lokální Demo režim";
    badge.className = "text-[11px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700 text-amber-300 font-semibold";
  }
}

// ==============================================================================
// 1.1 SPRÁVA OBSAHU WEBU A MULTIMÉDIÍ (HLUBOKÁ EDITACE VŠECH MODULŮ)
// ==============================================================================

let appSiteContent = null;

function getDefaultSiteContent() {
  return {
    hero: {
      bannerImg: "assets/img/budova_top.jpg",
      bannerBadge: "Nezávislé sdružení kandidátů pro komunální volby",
      bannerHeading: "Horní Stropnice a všechny její osady",
      badge: "Komunální volby do zastupitelstva",
      slogan: "„Zachovat dobré, zlepšit potřebné.“",
      h1: "Bezpečnost. Stabilita. Mládež.",
      introText: BSM_DATA.general.introText,
      fridayHours: "14:00 – 22:00",
      saturdayHours: "08:00 – 14:00",
      logoImg: "assets/img/logo_bsm.svg"
    },
    onas: {
      badge: "Kdo jsme a proč kandidujeme",
      title: "Znáte nás z každodenního života v obci",
      introText: "Z práce, školy, školky, místních spolků, dětských kroužků, hasičské jednotky i společných akcí. Jsme vaši sousedé a chceme zůstat lidmi, které můžete kdykoliv oslovit se svým názorem, podnětem nebo problémem.",
      card1: {
        icon: "🤝",
        title: "Sousedský přístup",
        desc: "Obecní politika není o velkých stranických ideologiích, ale o tom, jak se v naší obci žije. Chceme otevřené vedení obce, které naslouchá a řeší reálné problémy lidí."
      },
      card2: {
        icon: "🌲",
        title: "Péče o všech 21 osad",
        desc: "Horní Stropnice má unikátní rozlohu a mnoho osad – od Dobré Vody po Rychnov. Žádná část nesmí být na okraji zájmu. Podpora cest, služeb i společenského života patří do všech koutů."
      },
      card3: {
        icon: "⚖️",
        title: "Rozvaha a kontinuita",
        desc: "Nechceme bořit to, co dobře funguje. Chceme s rozvahou navázat na rozdělané investice, hlídat transparentní rozpočet a postupně posouvat obec krok za krokem k lepšímu."
      },
      quoteText: BSM_DATA.general.mottoQuote,
      quoteAuthor: "Tým kandidátky BSM – Volební číslo 6"
    },
    program: {
      badge: "Co chceme pro obec udělat",
      title: "Náš volební program pro Horní Stropnici",
      subtitle: "Tři klíčové pilíře postavené na reálných potřebách obyvatel obce a všech jejích osad.",
      ctaTitle: "Zajímá vás konkrétní detail nebo máte další námět?",
      ctaDesc: "Program neustále rozvíjíme v diskuzi s občany. Napište nám svůj nápad přímo našim kandidátům.",
      ctaBtn: "Poslat podnět kandidátům",
      pillars: JSON.parse(JSON.stringify(BSM_DATA.pillars))
    },
    kdeVolit: {
      badge: "Praktický průvodce pro voliče",
      title: "Kde mám volební místnost?",
      desc: "Horní Stropnice má celkem 3 volební okrsky pro svých 21 osad. Vyberte nebo vyhledejte vaši obec či osadu a okamžitě zjistíte přesné místo, adresu i otevírací dobu.",
      wards: JSON.parse(JSON.stringify(BSM_DATA.wards))
    },
    jakVolit: {
      badge: "Volební rádce",
      title: "Jak správně hlasovat pro BSM č. 6?",
      desc: "Systém komunálních voleb nabízí 3 způsoby hlasování. Vyzkoušejte si náš interaktivní simulátor, abyste měli jistotu, že váš hlas podpoří náš tým naplno."
    },
    letacek: {
      badge: "Tištěné materiály do schránek",
      title: "Originální volební letáček BSM",
      desc: "Prohlédněte si všechny 4 strany oficiálního letáčku, který dostanete do svých poštovních schránek v Horní Stropnici a osadách.",
      pages: JSON.parse(JSON.stringify(BSM_DATA.leafletPages))
    },
    podnety: {
      badge: "Vaše obec, váš názor",
      title: "Co byste v Horní Stropnici nebo vaší osadě změnili?",
      desc: "Chceme být zastupiteli, kteří mají stálý kontakt se sousedy. Napište nám, co vás pálí, jaký nápad máte pro vaši ulici nebo osadu. Každým podnětem se budeme zabývat."
    },
    footer: {
      title: "BSM Horní Stropnice",
      tagline: "Bezpečnost • Stabilita • Mládež",
      description: "Nezávislé sdružení kandidátů pro komunální volby do Zastupitelstva obce Horní Stropnice. Volební číslo 6.",
      share: {
        heading: "Sdílejte mezi sousedy",
        desc: "Pomozte nám šířit náš program v Horní Stropnici a na všech osadách:",
        whatsapp: "WhatsApp",
        whatsappUrl: "https://api.whatsapp.com/send?text=Podívejte%20se%20na%20program%20a%20kandidáty%20BSM%20pro%20Horní%20Stropnici%20(Volební%20číslo%206):%20https://bsm-horni-stropnice.vercel.app",
        whatsappMsg: "Podívejte se na program a kandidáty BSM pro Horní Stropnici (Volební číslo 6): https://bsm-horni-stropnice.vercel.app",
        facebook: "Facebook",
        facebookUrl: "https://www.facebook.com/sharer/sharer.php?u=https://bsm-horni-stropnice.vercel.app",
        facebookShareUrl: "https://bsm-horni-stropnice.vercel.app",
        copy: "📋 Kopírovat odkaz"
      }
    }
  };
}

async function loadSiteContent() {
  let content = null;

  // 1. Zkusíme načíst ze Supabase z řádku 'bsm_site_content' v tabulce site_sections
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("site_sections")
        .select("title")
        .eq("id", "bsm_site_content")
        .maybeSingle();

      if (!error && data && data.title) {
        try {
          content = JSON.parse(data.title);
        } catch (e) {
          console.warn("Chyba parsování obsahu webu ze Supabase:", e);
        }
      }
    } catch (err) {
      console.warn("Chyba dotazu na obsah v Supabase:", err);
    }
  }

  // 2. Fallback do LocalStorage
  if (!content) {
    const saved = localStorage.getItem("bsm_site_content");
    if (saved) {
      try {
        content = JSON.parse(saved);
      } catch (e) {
        console.warn("Chyba čtení bsm_site_content z localStorage:", e);
      }
    }
  }

  // 3. Fallback do výchozích hodnot
  if (!content) {
    content = getDefaultSiteContent();
  }

  appSiteContent = deepMergeSiteContent(getDefaultSiteContent(), content);
  applySiteContentToDOM(appSiteContent);
}

function deepMergeSiteContent(target, source) {
  const output = Object.assign({}, target);
  if (target && typeof target === "object" && source && typeof source === "object") {
    Object.keys(source).forEach(key => {
      if (Array.isArray(source[key])) {
        output[key] = source[key];
      } else if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = deepMergeSiteContent(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function applySiteContentToDOM(content) {
  if (!content) return;

  // HERO
  const heroBudova = document.getElementById("heroBudovaImg");
  if (heroBudova && content.hero?.bannerImg) heroBudova.src = content.hero.bannerImg;

  const heroBannerBadge = document.getElementById("heroBannerBadge");
  if (heroBannerBadge && content.hero?.bannerBadge) heroBannerBadge.textContent = content.hero.bannerBadge;

  const heroBannerHeading = document.getElementById("heroBannerHeading");
  if (heroBannerHeading && content.hero?.bannerHeading) heroBannerHeading.textContent = content.hero.bannerHeading;

  const heroBadge = document.getElementById("heroBadge");
  if (heroBadge && content.hero?.badge) heroBadge.textContent = content.hero.badge;

  const heroSlogan = document.getElementById("heroSlogan");
  if (heroSlogan && content.hero?.slogan) heroSlogan.textContent = content.hero.slogan;

  const heroH1 = document.getElementById("heroH1");
  if (heroH1 && content.hero?.h1) {
    // Formátování: každá tečka novým řádkem pro responzivní design
    const parts = content.hero.h1.split(".").map(p => p.trim()).filter(Boolean);
    if (parts.length >= 3) {
      heroH1.innerHTML = `
        ${escapeHtml(parts[0])}. <br class="hidden sm:inline" />
        <span class="text-bsm-800">${escapeHtml(parts[1])}.</span> <br class="hidden sm:inline" />
        ${escapeHtml(parts[2])}.
      `;
    } else {
      heroH1.textContent = content.hero.h1;
    }
  }

  const heroIntro = document.getElementById("heroIntroText");
  if (heroIntro && content.hero?.introText) heroIntro.textContent = content.hero.introText;

  const heroFri = document.getElementById("heroFridayHours");
  if (heroFri && content.hero?.fridayHours) heroFri.textContent = content.hero.fridayHours;

  const heroSat = document.getElementById("heroSaturdayHours");
  if (heroSat && content.hero?.saturdayHours) heroSat.textContent = content.hero.saturdayHours;

  const heroLogo = document.getElementById("heroLogoImg");
  if (heroLogo && content.hero?.logoImg) heroLogo.src = content.hero.logoImg;

  // O NÁS
  const onasBadge = document.getElementById("onasBadge");
  if (onasBadge && content.onas?.badge) onasBadge.textContent = content.onas.badge;

  const onasTitle = document.getElementById("onasTitle");
  if (onasTitle && content.onas?.title) onasTitle.textContent = content.onas.title;

  const onasIntro = document.getElementById("onasIntroText");
  if (onasIntro && content.onas?.introText) onasIntro.textContent = content.onas.introText;

  if (content.onas?.card1) {
    const icon = document.getElementById("onasCard1Icon");
    const title = document.getElementById("onasCard1Title");
    const desc = document.getElementById("onasCard1Desc");
    if (icon) icon.textContent = content.onas.card1.icon || "🤝";
    if (title) title.textContent = content.onas.card1.title || "";
    if (desc) desc.textContent = content.onas.card1.desc || "";
  }
  if (content.onas?.card2) {
    const icon = document.getElementById("onasCard2Icon");
    const title = document.getElementById("onasCard2Title");
    const desc = document.getElementById("onasCard2Desc");
    if (icon) icon.textContent = content.onas.card2.icon || "🌲";
    if (title) title.textContent = content.onas.card2.title || "";
    if (desc) desc.textContent = content.onas.card2.desc || "";
  }
  if (content.onas?.card3) {
    const icon = document.getElementById("onasCard3Icon");
    const title = document.getElementById("onasCard3Title");
    const desc = document.getElementById("onasCard3Desc");
    if (icon) icon.textContent = content.onas.card3.icon || "⚖️";
    if (title) title.textContent = content.onas.card3.title || "";
    if (desc) desc.textContent = content.onas.card3.desc || "";
  }

  const quoteText = document.getElementById("onasQuoteText");
  if (quoteText && content.onas?.quoteText) quoteText.textContent = content.onas.quoteText;

  const quoteAuthor = document.getElementById("onasQuoteAuthor");
  if (quoteAuthor && content.onas?.quoteAuthor) quoteAuthor.textContent = content.onas.quoteAuthor;

  // PROGRAM
  const progBadge = document.getElementById("programBadge");
  if (progBadge && content.program?.badge) progBadge.textContent = content.program.badge;

  const progTitle = document.getElementById("programTitle");
  if (progTitle && content.program?.title) progTitle.textContent = content.program.title;

  const progSub = document.getElementById("programSubtitle");
  if (progSub && content.program?.subtitle) progSub.textContent = content.program.subtitle;

  const progCtaTitle = document.getElementById("programCtaTitle");
  if (progCtaTitle && content.program?.ctaTitle) progCtaTitle.textContent = content.program.ctaTitle;

  const progCtaDesc = document.getElementById("programCtaDesc");
  if (progCtaDesc && content.program?.ctaDesc) progCtaDesc.textContent = content.program.ctaDesc;

  const progCtaBtn = document.getElementById("programCtaBtn");
  if (progCtaBtn && content.program?.ctaBtn) progCtaBtn.textContent = content.program.ctaBtn;

  if (Array.isArray(content.program?.pillars) && content.program.pillars.length > 0) {
    BSM_DATA.pillars = content.program.pillars;
    renderProgramPillars();
  }

  // KDE VOLIT
  const kdeBadge = document.getElementById("kdeVolitBadge");
  if (kdeBadge && content.kdeVolit?.badge) kdeBadge.textContent = content.kdeVolit.badge;

  const kdeTitle = document.getElementById("kdeVolitTitle");
  if (kdeTitle && content.kdeVolit?.title) kdeTitle.textContent = content.kdeVolit.title;

  const kdeDesc = document.getElementById("kdeVolitDesc");
  if (kdeDesc && content.kdeVolit?.desc) kdeDesc.textContent = content.kdeVolit.desc;

  if (Array.isArray(content.kdeVolit?.wards) && content.kdeVolit.wards.length > 0) {
    BSM_DATA.wards = content.kdeVolit.wards;
    if (typeof selectWard === "function") selectWard(1);
  }

  // JAK VOLIT
  const jakBadge = document.getElementById("jakVolitBadge");
  if (jakBadge && content.jakVolit?.badge) jakBadge.textContent = content.jakVolit.badge;

  const jakTitle = document.getElementById("jakVolitTitle");
  if (jakTitle && content.jakVolit?.title) jakTitle.textContent = content.jakVolit.title;

  const jakDesc = document.getElementById("jakVolitDesc");
  if (jakDesc && content.jakVolit?.desc) jakDesc.textContent = content.jakVolit.desc;

  // LETÁČEK
  const letBadge = document.getElementById("letacekBadge");
  if (letBadge && content.letacek?.badge) letBadge.textContent = content.letacek.badge;

  const letTitle = document.getElementById("letacekTitle");
  if (letTitle && content.letacek?.title) letTitle.textContent = content.letacek.title;

  const letDesc = document.getElementById("letacekDesc");
  if (letDesc && content.letacek?.desc) letDesc.textContent = content.letacek.desc;

  if (Array.isArray(content.letacek?.pages) && content.letacek.pages.length > 0) {
    BSM_DATA.leafletPages = content.letacek.pages;
    initLeafletViewer();
  }

  // PODNĚTY
  const podBadge = document.getElementById("podnetyBadge");
  if (podBadge && content.podnety?.badge) podBadge.textContent = content.podnety.badge;

  const podTitle = document.getElementById("podnetyTitle");
  if (podTitle && content.podnety?.title) podTitle.textContent = content.podnety.title;

  const podDesc = document.getElementById("podnetyDesc");
  if (podDesc && content.podnety?.desc) podDesc.textContent = content.podnety.desc;

  // FOOTER
  const footTitle = document.getElementById("footerTitle");
  if (footTitle && content.footer?.title) footTitle.textContent = content.footer.title;

  const footTagline = document.getElementById("footerTagline");
  if (footTagline && content.footer?.tagline) footTagline.textContent = content.footer.tagline;

  const footDesc = document.getElementById("footerDescription");
  if (footDesc && content.footer?.description) footDesc.textContent = content.footer.description;

  const footLogo = document.getElementById("footerLogoImg");
  if (footLogo && content.hero?.logoImg) footLogo.src = content.hero.logoImg;

  // NAV
  if (content.nav) {
    const navOnas = document.getElementById("navOnas");
    if (navOnas && content.nav.onas) navOnas.textContent = content.nav.onas;
    const navProgram = document.getElementById("navProgram");
    if (navProgram && content.nav.program) navProgram.textContent = content.nav.program;
    const navKandidati = document.getElementById("navKandidati");
    if (navKandidati && content.nav.kandidati) navKandidati.textContent = content.nav.kandidati;
    const navKdeVolit = document.getElementById("navKdeVolit");
    if (navKdeVolit && content.nav.kdeVolit) navKdeVolit.textContent = content.nav.kdeVolit;
    const navJakVolit = document.getElementById("navJakVolit");
    if (navJakVolit && content.nav.jakVolit) navJakVolit.textContent = content.nav.jakVolit;
    const navLetacek = document.getElementById("navLetacek");
    if (navLetacek && content.nav.letacek) navLetacek.textContent = content.nav.letacek;
    const navCta = document.getElementById("navCta");
    if (navCta && content.nav.cta) {
      const span = navCta.querySelector("span");
      if (span) span.textContent = content.nav.cta;
      else navCta.textContent = content.nav.cta;
    }
  }

  // SHARE
  if (content.footer?.share) {
    const shHeading = document.getElementById("shareHeading");
    if (shHeading && content.footer.share.heading) shHeading.textContent = content.footer.share.heading;
    const shDesc = document.getElementById("shareDesc");
    if (shDesc && content.footer.share.desc) shDesc.textContent = content.footer.share.desc;
    
    const shWa = document.getElementById("shareWhatsappBtn");
    if (shWa) {
      if (content.footer.share.whatsapp) shWa.textContent = content.footer.share.whatsapp;
      if (content.footer.share.whatsappUrl) shWa.href = content.footer.share.whatsappUrl;
    }

    const shFb = document.getElementById("shareFacebookBtn");
    if (shFb) {
      if (content.footer.share.facebook) shFb.textContent = content.footer.share.facebook;
      if (content.footer.share.facebookUrl) shFb.href = content.footer.share.facebookUrl;
    }

    const shCp = document.getElementById("shareCopyBtn");
    if (shCp && content.footer.share.copy) shCp.textContent = content.footer.share.copy;
  }
}

// ==============================================================================
// 2. MODULÁRNÍ SEKCE (POŘADÍ A VIDITELNOST)
// ==============================================================================

async function loadAndApplySections() {
  let sections = null;

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
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

  appSections = sections;
  applySectionsToDOM(appSections);
}

function applySectionsToDOM(sections) {
  const container = document.getElementById("modularSectionsContainer");
  if (!container) return;

  const sorted = [...sections].sort((a, b) => a.order - b.order);
  const isEdit = typeof isInPageEditActive !== "undefined" && isInPageEditActive;

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

// ==============================================================================
// 3. PROGRAMOVÉ PILÍŘE
// ==============================================================================

function renderProgramPillars() {
  const container = document.getElementById("pillarsContainer");
  if (!container) return;

  container.innerHTML = BSM_DATA.pillars.map((pillar, idx) => {
    return `
      <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/80 overflow-hidden flex flex-col relative group">
        <div class="p-6 md:p-8 flex-1 flex flex-col">
          <div class="flex items-center justify-between gap-3 mb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-sky-100 text-sky-800" data-editable="pillar-badge" data-pillar="${idx}">
              ${escapeHtml(pillar.badge)}
            </span>
            <span class="text-xs font-bold text-slate-400">PILÍŘ 0${idx + 1}</span>
          </div>

          <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-2" data-editable="pillar-title" data-pillar="${idx}">
            ${escapeHtml(pillar.title)}
          </h3>
          <p class="text-sky-900/80 font-medium text-sm mb-4" data-editable="pillar-subtitle" data-pillar="${idx}">
            ${escapeHtml(pillar.subtitle)}
          </p>
          <p class="text-slate-600 text-sm leading-relaxed mb-6" data-editable="pillar-desc" data-pillar="${idx}">
            ${escapeHtml(pillar.description)}
          </p>

          <div class="space-y-3 pt-2 border-t border-slate-100 flex-1">
            ${pillar.points.map((pt, pIdx) => `
              <div class="group/point bg-slate-50 hover:bg-sky-50/60 p-3.5 rounded-xl border border-slate-200/60 transition-colors relative">
                <div class="flex items-start gap-3">
                  <div class="mt-0.5 text-sky-700 flex-shrink-0">
                    <svg class="w-4 h-4 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-bold text-slate-800 group-hover/point:text-sky-900 transition-colors" data-editable="point-title" data-pillar="${idx}" data-point="${pIdx}">
                      ${escapeHtml(pt.title)}
                    </h4>
                    <p class="text-xs text-slate-500 mt-1 leading-normal" data-editable="point-detail" data-pillar="${idx}" data-point="${pIdx}">
                      ${escapeHtml(pt.detail)}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onclick="deletePillarPoint(${idx}, ${pIdx})" 
                    class="pillar-point-delete-btn text-slate-400 hover:text-red-500 font-black text-xs p-1 ml-1 transition-colors cursor-pointer"
                    title="Smazat tento bod programu">
                    🗑️
                  </button>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="pt-4 text-center">
            <button 
              type="button" 
              onclick="addNewPillarPoint(${idx})" 
              class="pillar-point-add-btn text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3.5 py-1.5 rounded-xl border border-dashed border-sky-300 transition-all cursor-pointer">
              ➕ Přidat bod do tohoto pilíře
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  initLucideIcons();
  if (typeof isInPageEditActive !== "undefined" && isInPageEditActive) {
    refreshEditableElements();
  }
}

window.addNewPillarPoint = function(pillarIndex) {
  if (!BSM_DATA.pillars[pillarIndex]) return;
  BSM_DATA.pillars[pillarIndex].points.push({
    title: "Nový bod volebního programu",
    detail: "Zadejte podrobný popis tohoto programového záměru..."
  });
  renderProgramPillars();
  markUnsavedChanges(true);
  showInPageToast(`➕ Nový bod byl přidán do pilíře ${BSM_DATA.pillars[pillarIndex].title}.`);
};

window.deletePillarPoint = function(pillarIndex, pointIndex) {
  if (!BSM_DATA.pillars[pillarIndex]) return;
  if (!confirm("Opravdu chcete tento bod programu odstranit?")) return;
  BSM_DATA.pillars[pillarIndex].points.splice(pointIndex, 1);
  renderProgramPillars();
  markUnsavedChanges(true);
  showInPageToast(`🗑️ Bod programu byl odstraněn.`);
};

// ==============================================================================
// 4. KANDIDÁTI (NAČTENÍ A VYKRESLENÍ)
// ==============================================================================

let currentCandidateFilter = "all";

async function loadAndRenderCandidates() {
  let candidates = null;

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("candidates")
        .select("*")
        .order("number", { ascending: true });
      if (!error && data && data.length > 0) {
        candidates = data;
      }
    } catch (e) {
      console.warn("Chyba čtení kandidátů ze Supabase:", e);
    }
  }

  if (!candidates) {
    const local = localStorage.getItem("bsm_candidates");
    if (local) {
      try {
        candidates = JSON.parse(local);
      } catch (e) { console.error("Chyba parsování kandidátů z localStorage:", e); }
    }
  }

  if (!candidates || candidates.length === 0) {
    candidates = JSON.parse(JSON.stringify(BSM_DATA.candidates));
  }

  // Normalizace foto URL z JSONB tags nebo objektu
  candidates.forEach(c => {
    if (c.tags && typeof c.tags === "object" && !Array.isArray(c.tags)) {
      if (c.tags.photo_url) c.photo_url = c.tags.photo_url;
      c.tags = Array.isArray(c.tags.list) ? c.tags.list : [];
    }
  });

  appCandidates = candidates;
  renderCandidates(currentCandidateFilter);
}

function renderCandidates(filter = "all") {
  const container = document.getElementById("candidatesGrid");
  if (!container) return;

  currentCandidateFilter = filter;
  const filtered = filter === "all" 
    ? appCandidates 
    : appCandidates.filter(c => {
        const tags = Array.isArray(c.tags) ? c.tags : [];
        return tags.some(t => t.toLowerCase().includes(filter.toLowerCase()));
      });

  container.innerHTML = filtered.map(c => {
    const initials = c.name
      .replace(/Mgr\.|Bc\.|PaedDr\./g, "")
      .trim()
      .split(" ")
      .map(part => part[0])
      .join("")
      .slice(0, 2);

    const tags = Array.isArray(c.tags) ? c.tags : [];
    const photoUrl = c.photo_url || "";

    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col relative group">
        <!-- Admin lišta -->
        <div class="candidate-card-admin-bar">
          <button 
            type="button" 
            onclick="openCandidateEditModal(${c.number})" 
            class="text-sky-300 hover:text-white px-2 py-1 rounded text-xs font-bold bg-slate-800 hover:bg-slate-700 transition-colors" 
            title="Otevřít okno pro úpravu kandidáta">
            ✏️ Upravit profil
          </button>
        </div>

        <!-- Pozice na kandidátce -->
        <div class="absolute top-4 right-4 flex items-center gap-1.5">
          <span class="w-7 h-7 rounded-full bg-sky-100 text-sky-900 font-extrabold text-xs flex items-center justify-center shadow-inner">
            ${c.number}
          </span>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <!-- Profilová fotografie nebo iniciály s gradientem -->
          <div class="relative img-edit-container flex-shrink-0 group/photo">
            ${photoUrl ? `
              <div class="w-16 h-16 rounded-full overflow-hidden shadow-md ring-4 ring-sky-100 bg-slate-100">
                <img 
                  id="candidatePhoto-${c.number}"
                  src="${escapeHtml(photoUrl)}" 
                  alt="${escapeHtml(c.name)}" 
                  class="w-full h-full object-cover" 
                  onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-full h-full bg-gradient-to-br from-sky-700 to-sky-900 text-white font-bold text-lg flex items-center justify-center\\'>${initials}</div>';" 
                />
              </div>
            ` : `
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-sky-700 to-sky-900 text-white font-bold text-lg flex items-center justify-center shadow-md ring-4 ring-sky-50">
                <span id="candidatePhotoFallback-${c.number}">${initials}</span>
              </div>
            `}
            <button 
              type="button" 
              onclick="openImageEditModalForCandidate(${c.number})" 
              class="img-edit-btn !text-[10px] !py-0.5 !px-1.5 !top-0 !left-0 whitespace-nowrap shadow-lg">
              📷 Foto
            </button>
          </div>

          <div class="pr-8 flex-1">
            <h4 class="font-extrabold text-slate-900 text-base leading-snug group-hover:text-sky-800 transition-colors" data-editable="candidate-name" data-candidate="${c.number}">
              ${escapeHtml(c.name)}
            </h4>
            <div class="flex flex-wrap items-center gap-1.5 text-xs text-sky-800 font-semibold mt-0.5">
              <span data-editable="candidate-profession" data-candidate="${c.number}">${escapeHtml(c.profession)}</span>
              <span class="text-slate-300">•</span>
              <span data-editable="candidate-age" data-candidate="${c.number}">${c.age || ''}</span>
              <span class="text-slate-500 font-medium">let</span>
            </div>
            <p class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <span>📍</span> <span data-editable="candidate-settlement" data-candidate="${c.number}">${escapeHtml(c.settlement)}</span>
            </p>
          </div>
        </div>

        <!-- Citát / Proč kandiduje -->
        <div class="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 italic mb-4 flex-1 border border-slate-100" data-editable="candidate-quote" data-candidate="${c.number}">
          ${escapeHtml(c.quote || "")}
        </div>

        <!-- Tagy a zaměření -->
        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          ${tags.map((tag, tagIdx) => `
            <span class="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full transition-all group/tag">
              <span data-editable="candidate-tag" data-candidate="${c.number}" data-tag-index="${tagIdx}">${escapeHtml(tag)}</span>
              <button 
                type="button" 
                onclick="removeCandidateTag(${c.number}, ${tagIdx})" 
                class="candidate-tag-delete-btn text-slate-400 hover:text-red-500 font-black text-xs px-0.5 transition-colors cursor-pointer" 
                title="Smazat tento štítek">×</button>
            </span>
          `).join("")}
          <button 
            type="button" 
            onclick="addCandidateTag(${c.number})" 
            class="candidate-tag-add-btn text-[10px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-0.5 rounded-full border border-dashed border-sky-300 transition-colors cursor-pointer"
            title="Přidat další štítek pro tohoto kandidáta">
            + Štítek
          </button>
        </div>
      </div>
    `;
  }).join("");

  const countBadge = document.getElementById("candidatesCountBadge");
  if (countBadge) {
    countBadge.textContent = `${filtered.length} z ${appCandidates.length} kandidátů`;
  }

  if (typeof isInPageEditActive !== "undefined" && isInPageEditActive) {
    refreshEditableElements();
  }
}

window.addCandidateTag = function(candidateNumber) {
  const cand = appCandidates.find(c => c.number === candidateNumber);
  if (!cand) return;
  if (!Array.isArray(cand.tags)) cand.tags = [];
  cand.tags.push("Nový štítek");
  renderCandidates(currentCandidateFilter);
  markUnsavedChanges(true);
  showInPageToast("➕ Nový štítek byl přidán. Můžete do něj kliknout a přepsat text.");
};

window.removeCandidateTag = function(candidateNumber, tagIndex) {
  const cand = appCandidates.find(c => c.number === candidateNumber);
  if (!cand || !Array.isArray(cand.tags)) return;
  cand.tags.splice(tagIndex, 1);
  renderCandidates(currentCandidateFilter);
  markUnsavedChanges(true);
  showInPageToast("🗑️ Štítek byl odebrán.");
};

window.filterCandidates = function(type, element) {
  document.querySelectorAll(".candidate-filter-btn").forEach(btn => {
    btn.classList.remove("bg-bsm-800", "text-white");
    btn.classList.add("bg-white", "text-slate-700", "border-slate-200");
  });
  if (element) {
    element.classList.remove("bg-white", "text-slate-700", "border-slate-200");
    element.classList.add("bg-bsm-800", "text-white");
  }
  renderCandidates(type);
};

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

  const fridayText = appSiteContent?.kdeVolit?.fridayHours || "Pátek 9. října: 14:00 – 22:00";
  const saturdayText = appSiteContent?.kdeVolit?.saturdayHours || "Sobota 10. října: 08:00 – 14:00";
  const idNoteText = appSiteContent?.kdeVolit?.idNote || "Nezapomeňte si vzít s sebou platný občanský průkaz!";
  const mapsBtnText = appSiteContent?.kdeVolit?.mapsBtn || "Otevřít navigaci v Google Mapách";

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

  if (typeof isInPageEditActive !== "undefined" && isInPageEditActive) {
    refreshEditableElements();
  }
};

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
          <span data-editable="ballot_party_info_title">${escapeHtml(appSiteContent?.jakVolit?.partyInfoTitle || "NEJJEDNODUŠŠÍ A NEJÚČINNĚJŠÍ ZPŮSOB (Doporučeno):")}</span>
        </strong>
        <div data-editable="ballot_party_info_desc">${appSiteContent?.jakVolit?.partyInfoDesc || "Označíte <strong>jediným velkým křížkem</strong> rámeček u volebního čísla <strong>6 BSM</strong> v záhlaví. Tím dáváte všech svých <strong>15 hlasů celé naší kandidátce</strong>. Každý kandidát BSM obdrží 1 hlas. Žádný hlas se neztratí a zajistíte maximální podporu celého týmu."}</div>
      </div>
    `;
  } else if (isCross) {
    infoText = `
      <div class="bg-sky-50 border border-sky-200 text-sky-950 rounded-xl p-4 text-sm leading-relaxed mb-6">
        <strong class="font-bold flex items-center gap-1.5 text-sky-900 mb-1">
          <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span data-editable="ballot_cross_info_title">${escapeHtml(appSiteContent?.jakVolit?.crossInfoTitle || "VÝBĚR JEDNOTLIVÝCH KANDIDÁTŮ (Panašování):")}</span>
        </strong>
        <div data-editable="ballot_cross_info_desc">${appSiteContent?.jakVolit?.crossInfoDesc || "Nekřížkujete stranu v záhlaví, ale vybíráte konkrétní kandidáty před jejich jmény. Můžete udělit <strong>nejvýše 15 křížků</strong>."} (Vybráno máte nyní: <strong>${selectedCandidateIds.size} z 15</strong>)</div>
      </div>
    `;
  } else if (isCombo) {
    infoText = `
      <div class="bg-amber-50 border border-amber-200 text-amber-950 rounded-xl p-4 text-sm leading-relaxed mb-6">
        <strong class="font-bold flex items-center gap-1.5 text-amber-900 mb-1">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <span data-editable="ballot_combo_info_title">${escapeHtml(appSiteContent?.jakVolit?.comboInfoTitle || "KOMBINOVANÁ VOLBA:")}</span>
        </strong>
        <div data-editable="ballot_combo_info_desc">${appSiteContent?.jakVolit?.comboInfoDesc || "Dáte křížek do záhlaví BSM a k tomu křížek jednotlivcům z jiných kandidátek. Hlasy pro jiné kandidáty se započítají jako první, a zbývající hlasy z 15 se automaticky přidělí kandidátce BSM shora dolů."}</div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="flex flex-wrap gap-2 mb-6">
      <button 
        onclick="setVotingMode('party')" 
        class="flex-1 min-w-[200px] text-xs md:text-sm font-bold py-3 px-4 rounded-xl border transition-all text-center ${isParty ? 'bg-bsm-800 text-white border-bsm-800 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
        <span data-editable="ballot_tab_party">${escapeHtml(appSiteContent?.jakVolit?.tabParty || "⭐ 1. Celá kandidátka BSM (Doporučeno)")}</span>
      </button>
      <button 
        onclick="setVotingMode('cross')" 
        class="flex-1 min-w-[200px] text-xs md:text-sm font-bold py-3 px-4 rounded-xl border transition-all text-center ${isCross ? 'bg-bsm-800 text-white border-bsm-800 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
        <span data-editable="ballot_tab_cross">${escapeHtml(appSiteContent?.jakVolit?.tabCross || "2. Křížkování kandidátů")}</span> (${selectedCandidateIds.size}/15)
      </button>
      <button 
        onclick="setVotingMode('combo')" 
        class="flex-1 min-w-[200px] text-xs md:text-sm font-bold py-3 px-4 rounded-xl border transition-all text-center ${isCombo ? 'bg-bsm-800 text-white border-bsm-800 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
        <span data-editable="ballot_tab_combo">${escapeHtml(appSiteContent?.jakVolit?.tabCombo || "3. Kombinovaná volba")}</span>
      </button>
    </div>

    ${infoText}

    <div class="bg-amber-50/50 border-2 border-slate-300 rounded-2xl p-6 shadow-inner font-mono text-xs md:text-sm max-w-2xl mx-auto">
      <div class="text-center pb-3 border-b-2 border-slate-400 mb-4">
        <div class="text-[11px] text-slate-500 uppercase tracking-widest font-sans font-bold" data-editable="ballot_header_sub">${escapeHtml(appSiteContent?.jakVolit?.ballotHeaderSub || "Ukázka části volebního lístku")}</div>
        <div class="text-base font-bold font-sans text-slate-900 mt-1" data-editable="ballot_header_title">${escapeHtml(appSiteContent?.jakVolit?.ballotHeaderTitle || "Obec Horní Stropnice – Volby do zastupitelstva obce")}</div>
      </div>

      <div class="border-2 border-bsm-800 rounded-xl overflow-hidden bg-white shadow-sm">
        <div class="bg-bsm-900 text-white p-4 flex items-center justify-between">
          <div>
            <div class="text-xs text-sky-200 uppercase font-sans font-bold" data-editable="ballot_party_num_label">Volební číslo</div>
            <div class="text-2xl font-black font-sans" data-editable="ballot_party_name">${escapeHtml(appSiteContent?.jakVolit?.ballotPartyName || "6. BSM")}</div>
            <div class="text-[11px] text-sky-200 font-sans" data-editable="ballot_party_motto">${escapeHtml(appSiteContent?.jakVolit?.ballotPartyMotto || "Bezpečnost • Stabilita • Mládež")}</div>
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
          ${appCandidates.map(c => {
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

  if (typeof isInPageEditActive !== "undefined" && isInPageEditActive) {
    refreshEditableElements();
  }
}

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
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("feedbacks")
        .insert([{
          settlement: newFeedback.settlement,
          message: newFeedback.message,
          contact: newFeedback.contact,
          status: "new"
        }]);

      if (!error) {
        savedSuccess = true;
      } else {
        console.warn("Chyba při ukládání do Supabase:", error);
      }
    } catch (err) {
      console.warn("Chyba spojení se Supabase:", err);
    }
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
    updateAdminFeedbackCount();
  }
}

// ==============================================================================
// 8. AUTENTIZACE SPRÁVCE (ADMIN LOGIN & SESSION)
// ==============================================================================

function checkAdminSession() {
  const savedUser = localStorage.getItem("bsm_admin_user");
  if (!savedUser) return;
  try {
    currentAdminUser = JSON.parse(savedUser);
    localStorage.setItem("bsm_admin_user", JSON.stringify(currentAdminUser));
    showInPageAdminBar(currentAdminUser.email);
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
      if (currentAdminUser) {
        toggleInPageEditMode();
      } else {
        openAdminLoginModal();
      }
    }

    // Ctrl + S pro uložení změn přímo na stránce
    if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
      if (currentAdminUser && isInPageEditActive) {
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
  if (currentAdminUser) {
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
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
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
    currentAdminUser = userObject;
    localStorage.setItem("bsm_admin_user", JSON.stringify(currentAdminUser));
    showInPageAdminBar(currentAdminUser.email);
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
  if (supabaseClient && currentAdminUser?.source === "supabase") {
    try {
      await supabaseClient.auth.signOut();
    } catch (e) { console.error("Chyba při odhlášení ze Supabase:", e); }
  }
  currentAdminUser = null;
  localStorage.removeItem("bsm_admin_user");
  disableInPageEditing();
  const bar = document.getElementById("inPageAdminBar");
  if (bar) bar.classList.add("hidden");
  showInPageToast("Byl jste úspěšně odhlášen.");
};

// ==============================================================================
// 9. PŘÍMÁ IN-PAGE EDITACE OBSAHU PŘÍMO NA STRÁNCE (NO CONSOLE / VISUAL CMS)
// ==============================================================================

let isInPageEditActive = false;
let hasUnsavedChanges = false;
let draggedPageSectionId = null;
let currentImageEditTarget = null;

window.enableInPageEditing = function() {
  isInPageEditActive = true;
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
  applySectionsToDOM(appSections);

  // Vložit ovládací lišty k jednotlivým modulům
  injectSectionControlBars();

  // Obnovit pilíře a kandidáty pro zobrazení admin tlačítek
  renderProgramPillars();
  renderCandidates(currentCandidateFilter);

  // Obnovit galerii s interaktivní kartou "+"
  initLeafletViewer();

  // Udělat veškeré textové prvky editovatelné
  refreshEditableElements();
};

window.disableInPageEditing = function() {
  isInPageEditActive = false;
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
  applySectionsToDOM(appSections);

  // Obnovit pilíře a kandidáty
  renderProgramPillars();
  renderCandidates(currentCandidateFilter);

  // Obnovit galerii bez karty "+"
  initLeafletViewer();

  // Odstranit contenteditable
  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    el.removeAttribute("contenteditable");
  });
};

window.toggleInPageEditMode = function() {
  if (isInPageEditActive) {
    disableInPageEditing();
    showInPageToast("👁️ Přepnuto do čistého náhledu (jak web vidí běžný občan).");
  } else {
    enableInPageEditing();
    showInPageToast("✏️ Režim úprav aktivován. Klikněte do libovolného textu a pište.");
  }
};

function refreshEditableElements() {
  if (!isInPageEditActive) return;

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
        if (isInPageEditActive) {
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

  appSections.forEach(sec => {
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

  const sorted = [...appSections].sort((a, b) => a.order - b.order);
  const fromIdx = sorted.findIndex(s => s.id === draggedPageSectionId);
  const toIdx = sorted.findIndex(s => s.id === targetSecId);

  if (fromIdx < 0 || toIdx < 0) return;

  const [moved] = sorted.splice(fromIdx, 1);
  sorted.splice(toIdx, 0, moved);

  sorted.forEach((s, idx) => {
    s.order = idx + 1;
  });

  appSections = sorted;
  applySectionsToDOM(appSections);
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
  const sorted = [...appSections].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex(s => s.id === secId);
  if (idx < 0) return;

  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= sorted.length) return;

  const tempOrder = sorted[idx].order;
  sorted[idx].order = sorted[targetIdx].order;
  sorted[targetIdx].order = tempOrder;

  appSections = sorted;
  applySectionsToDOM(appSections);
  injectSectionControlBars();
  markUnsavedChanges(true);
};

window.toggleSectionVisibilityDirect = function(secId) {
  const item = appSections.find(s => s.id === secId);
  if (!item) return;

  item.visible = !(item.visible !== false);
  applySectionsToDOM(appSections);
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
  const cand = appCandidates.find(c => c.number === candidateNumber);
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
    const cand = appCandidates.find(c => c.number === currentImageEditTarget.number);
    if (cand) {
      cand.photo_url = newUrl;
      renderCandidates(currentCandidateFilter);
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

  // 1. Shromáždit texty a multimédia z DOM do appSiteContent
  if (!appSiteContent) appSiteContent = getDefaultSiteContent();

  const getTxt = (id, fallback = "") => {
    const el = document.getElementById(id);
    return el ? el.innerText.trim() : fallback;
  };
  const getSrc = (id, fallback = "") => {
    const el = document.getElementById(id);
    return el ? el.src : fallback;
  };

  appSiteContent.hero = {
    ...appSiteContent.hero,
    bannerImg: getSrc("heroBudovaImg", appSiteContent.hero.bannerImg),
    bannerBadge: getTxt("heroBannerBadge", appSiteContent.hero.bannerBadge),
    bannerHeading: getTxt("heroBannerHeading", appSiteContent.hero.bannerHeading),
    badge: getTxt("heroBadge", appSiteContent.hero.badge),
    slogan: getTxt("heroSlogan", appSiteContent.hero.slogan),
    h1: getTxt("heroH1", appSiteContent.hero.h1),
    introText: getTxt("heroIntroText", appSiteContent.hero.introText),
    fridayHours: getTxt("heroFridayHours", appSiteContent.hero.fridayHours),
    saturdayHours: getTxt("heroSaturdayHours", appSiteContent.hero.saturdayHours),
    logoImg: getSrc("heroLogoImg", appSiteContent.hero.logoImg)
  };

  appSiteContent.onas = {
    ...appSiteContent.onas,
    badge: getTxt("onasBadge", appSiteContent.onas.badge),
    title: getTxt("onasTitle", appSiteContent.onas.title),
    introText: getTxt("onasIntroText", appSiteContent.onas.introText),
    quoteText: getTxt("onasQuoteText", appSiteContent.onas.quoteText),
    quoteAuthor: getTxt("onasQuoteAuthor", appSiteContent.onas.quoteAuthor),
    card1: {
      ...appSiteContent.onas.card1,
      title: getTxt("onasCard1Title", appSiteContent.onas.card1?.title),
      desc: getTxt("onasCard1Desc", appSiteContent.onas.card1?.desc)
    },
    card2: {
      ...appSiteContent.onas.card2,
      title: getTxt("onasCard2Title", appSiteContent.onas.card2?.title),
      desc: getTxt("onasCard2Desc", appSiteContent.onas.card2?.desc)
    },
    card3: {
      ...appSiteContent.onas.card3,
      title: getTxt("onasCard3Title", appSiteContent.onas.card3?.title),
      desc: getTxt("onasCard3Desc", appSiteContent.onas.card3?.desc)
    }
  };

  appSiteContent.program = {
    ...appSiteContent.program,
    badge: getTxt("programBadge", appSiteContent.program.badge),
    title: getTxt("programTitle", appSiteContent.program.title),
    subtitle: getTxt("programSubtitle", appSiteContent.program.subtitle),
    ctaTitle: getTxt("programCtaTitle", appSiteContent.program.ctaTitle),
    ctaDesc: getTxt("programCtaDesc", appSiteContent.program.ctaDesc),
    ctaBtn: getTxt("programCtaBtn", appSiteContent.program.ctaBtn),
    pillars: BSM_DATA.pillars
  };

  appSiteContent.nav = {
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

  appSiteContent.kdeVolit = {
    ...appSiteContent.kdeVolit,
    badge: getTxt("kdeVolitBadge", appSiteContent.kdeVolit?.badge),
    title: getTxt("kdeVolitTitle", appSiteContent.kdeVolit?.title),
    desc: getTxt("kdeVolitDesc", appSiteContent.kdeVolit?.desc),
    fridayHours: fridayHoursEl ? fridayHoursEl.innerText.trim() : (appSiteContent.kdeVolit?.fridayHours || "Pátek 9. října: 14:00 – 22:00"),
    saturdayHours: saturdayHoursEl ? saturdayHoursEl.innerText.trim() : (appSiteContent.kdeVolit?.saturdayHours || "Sobota 10. října: 08:00 – 14:00"),
    idNote: idNoteEl ? idNoteEl.innerText.trim() : (appSiteContent.kdeVolit?.idNote || "Nezapomeňte si vzít s sebou platný občanský průkaz!"),
    mapsBtn: mapsBtnEl ? mapsBtnEl.innerText.trim() : (appSiteContent.kdeVolit?.mapsBtn || "Otevřít navigaci v Google Mapách"),
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

  appSiteContent.jakVolit = {
    ...appSiteContent.jakVolit,
    badge: getTxt("jakVolitBadge", appSiteContent.jakVolit?.badge),
    title: getTxt("jakVolitTitle", appSiteContent.jakVolit?.title),
    desc: getTxt("jakVolitDesc", appSiteContent.jakVolit?.desc),
    tabParty: tabPartyEl ? tabPartyEl.innerText.trim() : (appSiteContent.jakVolit?.tabParty || "⭐ 1. Celá kandidátka BSM (Doporučeno)"),
    tabCross: tabCrossEl ? tabCrossEl.innerText.trim() : (appSiteContent.jakVolit?.tabCross || "2. Křížkování kandidátů"),
    tabCombo: tabComboEl ? tabComboEl.innerText.trim() : (appSiteContent.jakVolit?.tabCombo || "3. Kombinovaná volba"),
    partyInfoTitle: partyTitleEl ? partyTitleEl.innerText.trim() : (appSiteContent.jakVolit?.partyInfoTitle || "NEJJEDNODUŠŠÍ A NEJÚČINNĚJŠÍ ZPŮSOB (Doporučeno):"),
    partyInfoDesc: partyDescEl ? partyDescEl.innerHTML.trim() : (appSiteContent.jakVolit?.partyInfoDesc || ""),
    crossInfoTitle: crossTitleEl ? crossTitleEl.innerText.trim() : (appSiteContent.jakVolit?.crossInfoTitle || "VÝBĚR JEDNOTLIVÝCH KANDIDÁTŮ (Panašování):"),
    crossInfoDesc: crossDescEl ? crossDescEl.innerHTML.trim() : (appSiteContent.jakVolit?.crossInfoDesc || ""),
    comboInfoTitle: comboTitleEl ? comboTitleEl.innerText.trim() : (appSiteContent.jakVolit?.comboInfoTitle || "KOMBINOVANÁ VOLBA:"),
    comboInfoDesc: comboDescEl ? comboDescEl.innerHTML.trim() : (appSiteContent.jakVolit?.comboInfoDesc || ""),
    ballotHeaderSub: ballotSubEl ? ballotSubEl.innerText.trim() : (appSiteContent.jakVolit?.ballotHeaderSub || "Ukázka části volebního lístku"),
    ballotHeaderTitle: ballotTitleEl ? ballotTitleEl.innerText.trim() : (appSiteContent.jakVolit?.ballotHeaderTitle || "Obec Horní Stropnice – Volby do zastupitelstva obce"),
    ballotPartyName: partyNameEl ? partyNameEl.innerText.trim() : (appSiteContent.jakVolit?.ballotPartyName || "6. BSM"),
    ballotPartyMotto: partyMottoEl ? partyMottoEl.innerText.trim() : (appSiteContent.jakVolit?.ballotPartyMotto || "Bezpečnost • Stabilita • Mládež")
  };

  // Uložení aktuálních textů stran letáčku / fotografií
  BSM_DATA.leafletPages.forEach(p => {
    const titleEl = document.querySelector(`[data-editable="leaflet_page_${p.page}_title"]`);
    const descEl = document.querySelector(`[data-editable="leaflet_page_${p.page}_desc"]`);
    if (titleEl) p.title = titleEl.innerText.trim();
    if (descEl) p.desc = descEl.innerText.trim();
  });

  appSiteContent.letacek = {
    ...appSiteContent.letacek,
    badge: getTxt("letacekBadge", appSiteContent.letacek?.badge),
    title: getTxt("letacekTitle", appSiteContent.letacek?.title),
    desc: getTxt("letacekDesc", appSiteContent.letacek?.desc),
    pages: BSM_DATA.leafletPages
  };

  appSiteContent.podnety = {
    ...appSiteContent.podnety,
    badge: getTxt("podnetyBadge", appSiteContent.podnety.badge),
    title: getTxt("podnetyTitle", appSiteContent.podnety.title),
    desc: getTxt("podnetyDesc", appSiteContent.podnety.desc)
  };

  const shWaEl = document.getElementById("shareWhatsappBtn");
  const shFbEl = document.getElementById("shareFacebookBtn");
  const shCpEl = document.getElementById("shareCopyBtn");

  appSiteContent.footer = {
    ...appSiteContent.footer,
    title: getTxt("footerTitle", appSiteContent.footer.title),
    tagline: getTxt("footerTagline", appSiteContent.footer.tagline),
    description: getTxt("footerDescription", appSiteContent.footer.description),
    share: {
      heading: getTxt("shareHeading", "Sdílejte mezi sousedy"),
      desc: getTxt("shareDesc", "Pomozte nám šířit náš program v Horní Stropnici a na všech osadách:"),
      whatsapp: getTxt("shareWhatsappBtn", "WhatsApp"),
      whatsappUrl: shWaEl ? shWaEl.getAttribute("href") : (appSiteContent.footer?.share?.whatsappUrl || ""),
      whatsappMsg: appSiteContent.footer?.share?.whatsappMsg || "",
      facebook: getTxt("shareFacebookBtn", "Facebook"),
      facebookUrl: shFbEl ? shFbEl.getAttribute("href") : (appSiteContent.footer?.share?.facebookUrl || ""),
      copy: getTxt("shareCopyBtn", "📋 Kopírovat odkaz")
    }
  };

  // 2. Shromáždit kandidáty z editovaných karet v DOM včetně štítků
  document.querySelectorAll("[data-candidate]").forEach(field => {
    const num = parseInt(field.getAttribute("data-candidate"), 10);
    const type = field.getAttribute("data-editable");
    const cand = appCandidates.find(c => c.number === num);
    if (!cand) return;

    if (type === "candidate-name") cand.name = field.innerText.trim();
    if (type === "candidate-profession") cand.profession = field.innerText.trim();
    if (type === "candidate-age") cand.age = parseInt(field.innerText.trim(), 10) || null;
    if (type === "candidate-settlement") cand.settlement = field.innerText.trim();
    if (type === "candidate-quote") cand.quote = field.innerText.replace(/^„|“$/g, "").trim();
  });

  // Shromáždit štítky kandidátů
  appCandidates.forEach(cand => {
    const tagEls = document.querySelectorAll(`[data-editable="candidate-tag"][data-candidate="${cand.number}"]`);
    if (tagEls.length > 0 || document.querySelector(`[data-candidate="${cand.number}"]`)) {
      // Jen pokud daný kandidát je na stránce vyrenderován
      cand.tags = Array.from(tagEls).map(el => el.innerText.trim()).filter(Boolean);
    }
  });

  // 3. Uložit do LocalStorage
  localStorage.setItem("bsm_site_content", JSON.stringify(appSiteContent));
  localStorage.setItem("bsm_sections_order", JSON.stringify(appSections));
  localStorage.setItem("bsm_candidates", JSON.stringify(appCandidates));

  // 4. Uložit do Supabase Cloud
  if (supabaseClient) {
    try {
      // 4a. Obsah webu v bsm_site_content
      await supabaseClient.from("site_sections").upsert({
        id: "bsm_site_content",
        title: JSON.stringify(appSiteContent),
        order_index: 999,
        is_visible: false
      });

      // 4b. Sekce webu a jejich pořadí
      const secUpdates = appSections.map(s => ({
        id: s.id,
        title: s.title,
        order_index: s.order,
        is_visible: s.visible !== false
      }));
      await supabaseClient.from("site_sections").upsert(secUpdates);

      // 4c. Kandidáti a fotografie
      const candUpdates = appCandidates.map(c => ({
        number: c.number,
        name: c.name,
        age: c.age,
        profession: c.profession,
        settlement: c.settlement,
        tags: { list: Array.isArray(c.tags) ? c.tags : (c.tags?.list || []), photo_url: c.photo_url || null },
        quote: c.quote,
        highlight: !!c.highlight
      }));
      await supabaseClient.from("candidates").upsert(candUpdates);
    } catch (err) {
      console.warn("Chyba při ukládání do Supabase:", err);
    }
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

  appSiteContent = getDefaultSiteContent();
  appSections = JSON.parse(JSON.stringify(BSM_DATA.defaultSections));
  appCandidates = JSON.parse(JSON.stringify(BSM_DATA.candidates));

  applySiteContentToDOM(appSiteContent);
  applySectionsToDOM(appSections);
  renderCandidates(currentCandidateFilter);
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
    const unread = appFeedbacks.filter(f => f.status === "new").length;
    badge.textContent = unread;
  }
}

async function loadAdminFeedbacks() {
  let list = [];
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) list = data;
    } catch (e) {
      console.warn("Chyba čtení podnětů ze Supabase:", e);
    }
  }

  const local = JSON.parse(localStorage.getItem("bsm_feedbacks") || "[]");
  local.forEach(loc => {
    if (!list.some(item => item.id === loc.id)) list.push(loc);
  });

  appFeedbacks = list;
  updateInPageFeedbackBadge();
  populateInPageSettlementFilter();
  renderInPageFeedbacksList();
}

function populateInPageSettlementFilter() {
  const sel = document.getElementById("inPageFilterSettlement");
  if (!sel) return;
  const osady = [...new Set(appFeedbacks.map(f => f.settlement))].sort();
  sel.innerHTML = `<option value="all">Všechny osady (${appFeedbacks.length})</option>` +
    osady.map(o => `<option value="${o}">${o}</option>`).join("");
}

window.filterAdminFeedbacks = function() {
  renderInPageFeedbacksList();
};

function renderInPageFeedbacksList() {
  const container = document.getElementById("inPageFeedbacksList");
  const filter = document.getElementById("inPageFilterSettlement")?.value || "all";
  if (!container) return;

  const filtered = filter === "all" ? appFeedbacks : appFeedbacks.filter(f => f.settlement === filter);

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
  const item = appFeedbacks.find(f => f.id === id);
  if (!item) return;

  const nextStatus = item.status === "new" ? "resolved" : "new";
  item.status = nextStatus;

  if (supabaseClient) {
    try {
      await supabaseClient.from("feedbacks").update({ status: nextStatus }).eq("id", id);
    } catch (e) { console.error("Chyba aktualizace stavu feedbacku:", e); }
  }

  localStorage.setItem("bsm_feedbacks", JSON.stringify(appFeedbacks));
  renderInPageFeedbacksList();
  updateInPageFeedbackBadge();
};

window.deleteFeedback = async function(id) {
  if (!confirm("Opravdu chcete tento podnět smazat?")) return;

  appFeedbacks = appFeedbacks.filter(f => f.id !== id);

  if (supabaseClient) {
    try {
      await supabaseClient.from("feedbacks").delete().eq("id", id);
    } catch (e) { console.error("Chyba mazání feedbacku ze Supabase:", e); }
  }

  localStorage.setItem("bsm_feedbacks", JSON.stringify(appFeedbacks));
  renderInPageFeedbacksList();
  updateInPageFeedbackBadge();
};

window.exportFeedbacksToCSV = function() {
  if (appFeedbacks.length === 0) {
    alert("Zatím nejsou k dispozici žádné podněty k exportu.");
    return;
  }

  const headers = ["Datum", "Osada", "Podnět / Zpráva", "Kontakt", "Stav"];
  const rows = appFeedbacks.map(f => [
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

// ==============================================================================
// 10. PROHLÍŽEČ LETÁČKU & MOBILNÍ MENU
// ==============================================================================

function initLeafletViewer() {
  const container = document.getElementById("leafletGallery");
  if (!container) return;

  const isEditActive = typeof isInPageEditActive !== "undefined" && isInPageEditActive;

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
    
    const currentMsg = appSiteContent.footer?.share?.whatsappMsg || "Podívejte se na program a kandidáty BSM pro Horní Stropnici (Volební číslo 6): https://bsm-horni-stropnice.vercel.app";
    msgInput.value = currentMsg;
  } else if (options.type === "facebook") {
    modalTitle.innerHTML = "<span>📘</span> Upravit sdílený odkaz pro Facebook";
    msgField.classList.add("hidden");
    urlField.classList.add("hidden");
    if (fbUrlField) {
      fbUrlField.classList.remove("hidden");
      const currentFbShareUrl = appSiteContent.footer?.share?.facebookShareUrl || "https://bsm-horni-stropnice.vercel.app";
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
      if (!appSiteContent.footer.share) appSiteContent.footer.share = {};
      appSiteContent.footer.share.whatsappMsg = customMsg;
      appSiteContent.footer.share.whatsappUrl = newUrl;
    }
  } else if (options.type === "facebook") {
    const customFbUrl = fbUrlInput ? fbUrlInput.value.trim() : "";
    if (customFbUrl) {
      newUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(customFbUrl)}`;
      if (!appSiteContent.footer.share) appSiteContent.footer.share = {};
      appSiteContent.footer.share.facebookShareUrl = customFbUrl;
      appSiteContent.footer.share.facebookUrl = newUrl;
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

    const nextNum = appCandidates.length > 0 ? Math.max(...appCandidates.map(c => c.number || 0)) + 1 : 1;
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
    const cand = appCandidates.find(c => c.number === candidateNumber);
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

  const number = parseInt(numInput.value, 10) || (appCandidates.length + 1);
  const age = parseInt(ageInput.value, 10) || null;
  const profession = profInput.value.trim();
  const settlement = settInput.value.trim() || "Horní Stropnice";
  const quote = quoteInput.value.trim();
  const tags = tagsInput.value.split(",").map(t => t.trim()).filter(Boolean);
  const photo_url = photoInput.value.trim() || null;
  const highlight = highInput.checked;

  if (currentCandidateEditNumber === "new") {
    appCandidates.push({
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
    const cand = appCandidates.find(c => c.number === currentCandidateEditNumber);
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

  appCandidates.sort((a, b) => a.number - b.number);

  renderCandidates(currentCandidateFilter);
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
  const cand = appCandidates.find(c => c.number === candidateNumber);
  if (!cand) return;

  if (!confirm(`Opravdu chcete smazat kandidáta ${cand.name} (#${cand.number}) z kandidátky?`)) return;

  appCandidates = appCandidates.filter(c => c.number !== candidateNumber);
  renderCandidates(currentCandidateFilter);
  renderBallotSimulator();
  markUnsavedChanges(true);
  showInPageToast(`🗑️ Kandidát ${cand.name} byl odstraněn.`);
};
