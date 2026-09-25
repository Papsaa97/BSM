import { state } from './state.js';

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
    } catch (e) { /* tiché – použijí se výchozí hodnoty */ }
  }

  if (window.supabase && config.url && config.anonKey) {
    try {
      state.supabaseClient = window.supabase.createClient(config.url, config.anonKey);
    } catch (err) {
      state.supabaseClient = null;
    }
  } else {
    state.supabaseClient = null;
  }

  updateSupabaseStatusBadge();
}

function updateSupabaseStatusBadge() {
  const badge = document.getElementById("supabaseStatusBadge");
  if (!badge) return;

  if (state.supabaseClient) {
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
  if (state.supabaseClient) {
    try {
      const { data, error } = await state.supabaseClient
        .from("site_sections")
        .select("title")
        .eq("id", "bsm_site_content")
        .maybeSingle();

      if (!error && data && data.title) {
        try {
          content = JSON.parse(data.title);
        } catch (e) { /* tiché – použije se fallback */ }
      }
    } catch (err) { /* tiché – použije se fallback */ }
  }

  // 2. Fallback do LocalStorage
  if (!content) {
    const saved = localStorage.getItem("bsm_site_content");
    if (saved) {
      try {
        content = JSON.parse(saved);
      } catch (e) { /* tiché */ }
    }
  }

  // 3. Fallback do výchozích hodnot
  if (!content) {
    content = getDefaultSiteContent();
  }

  state.appSiteContent = deepMergeSiteContent(getDefaultSiteContent(), content);
  applySiteContentToDOM(state.appSiteContent);
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



// Global exports
window.initSupabaseClient = initSupabaseClient;
window.updateSupabaseStatusBadge = updateSupabaseStatusBadge;
window.getDefaultSiteContent = getDefaultSiteContent;
window.loadSiteContent = loadSiteContent;
window.deepMergeSiteContent = deepMergeSiteContent;
window.applySiteContentToDOM = applySiteContentToDOM;
