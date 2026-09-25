var e=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(e){throw n=[e],e}},t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n=t((()=>{})),r,i=e((()=>{r={supabaseClient:null,currentAdminUser:null,appSections:[],appCandidates:[],appFeedbacks:[],isInPageEditActive:!1,currentCandidateFilter:`all`,appSiteContent:null},window.appState=r})),a=t((()=>{i();function e(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=String(e),t.innerHTML}document.addEventListener(`DOMContentLoaded`,async()=>{t(),initSupabaseClient(),await loadSiteContent(),await loadAndApplySections(),await loadAndRenderCandidates(),renderProgramPillars(),initSettlementFinder(),initBallotSimulator(),initLeafletViewer(),initFeedbackForm(),initMobileMenu(),checkAdminSession(),setupKeyboardShortcuts()});function t(){window.lucide&&window.lucide.createIcons()}window.escapeHtml=e,window.initLucideIcons=t})),o=t((()=>{i()})),s=t((()=>{i()})),c=t((()=>{i()})),l=t((()=>{i()})),u=t((()=>{i()})),d=t((()=>{i()})),f=t((()=>{i()})),p=t((()=>{i()})),m=t((()=>{i()})),h=t((()=>{i()})),g=t((()=>{i();function e(){let e=localStorage.getItem(`bsm_supabase_config`),n=BSM_DATA.supabase;if(e)try{n=JSON.parse(e)}catch(e){console.error(`Chyba čtení konfigurace Supabase:`,e)}if(window.supabase&&n.url&&n.anonKey)try{r.supabaseClient=window.supabase.createClient(n.url,n.anonKey),console.log(`Supabase klient inicializován pro:`,n.url)}catch(e){console.warn(`Nepodařilo se připojit k Supabase:`,e),r.supabaseClient=null}else r.supabaseClient=null;t()}function t(){let e=document.getElementById(`supabaseStatusBadge`);e&&(r.supabaseClient?(e.innerHTML=`🟢 Supabase Cloud`,e.className=`text-[11px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-semibold`):(e.innerHTML=`🟡 Lokální Demo režim`,e.className=`text-[11px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700 text-amber-300 font-semibold`))}function n(){return{hero:{bannerImg:`assets/img/budova_top.jpg`,bannerBadge:`Nezávislé sdružení kandidátů pro komunální volby`,bannerHeading:`Horní Stropnice a všechny její osady`,badge:`Komunální volby do zastupitelstva`,slogan:`„Zachovat dobré, zlepšit potřebné.“`,h1:`Bezpečnost. Stabilita. Mládež.`,introText:BSM_DATA.general.introText,fridayHours:`14:00 – 22:00`,saturdayHours:`08:00 – 14:00`,logoImg:`assets/img/logo_bsm.svg`},onas:{badge:`Kdo jsme a proč kandidujeme`,title:`Znáte nás z každodenního života v obci`,introText:`Z práce, školy, školky, místních spolků, dětských kroužků, hasičské jednotky i společných akcí. Jsme vaši sousedé a chceme zůstat lidmi, které můžete kdykoliv oslovit se svým názorem, podnětem nebo problémem.`,card1:{icon:`🤝`,title:`Sousedský přístup`,desc:`Obecní politika není o velkých stranických ideologiích, ale o tom, jak se v naší obci žije. Chceme otevřené vedení obce, které naslouchá a řeší reálné problémy lidí.`},card2:{icon:`🌲`,title:`Péče o všech 21 osad`,desc:`Horní Stropnice má unikátní rozlohu a mnoho osad – od Dobré Vody po Rychnov. Žádná část nesmí být na okraji zájmu. Podpora cest, služeb i společenského života patří do všech koutů.`},card3:{icon:`⚖️`,title:`Rozvaha a kontinuita`,desc:`Nechceme bořit to, co dobře funguje. Chceme s rozvahou navázat na rozdělané investice, hlídat transparentní rozpočet a postupně posouvat obec krok za krokem k lepšímu.`},quoteText:BSM_DATA.general.mottoQuote,quoteAuthor:`Tým kandidátky BSM – Volební číslo 6`},program:{badge:`Co chceme pro obec udělat`,title:`Náš volební program pro Horní Stropnici`,subtitle:`Tři klíčové pilíře postavené na reálných potřebách obyvatel obce a všech jejích osad.`,ctaTitle:`Zajímá vás konkrétní detail nebo máte další námět?`,ctaDesc:`Program neustále rozvíjíme v diskuzi s občany. Napište nám svůj nápad přímo našim kandidátům.`,ctaBtn:`Poslat podnět kandidátům`,pillars:JSON.parse(JSON.stringify(BSM_DATA.pillars))},kdeVolit:{badge:`Praktický průvodce pro voliče`,title:`Kde mám volební místnost?`,desc:`Horní Stropnice má celkem 3 volební okrsky pro svých 21 osad. Vyberte nebo vyhledejte vaši obec či osadu a okamžitě zjistíte přesné místo, adresu i otevírací dobu.`,wards:JSON.parse(JSON.stringify(BSM_DATA.wards))},jakVolit:{badge:`Volební rádce`,title:`Jak správně hlasovat pro BSM č. 6?`,desc:`Systém komunálních voleb nabízí 3 způsoby hlasování. Vyzkoušejte si náš interaktivní simulátor, abyste měli jistotu, že váš hlas podpoří náš tým naplno.`},letacek:{badge:`Tištěné materiály do schránek`,title:`Originální volební letáček BSM`,desc:`Prohlédněte si všechny 4 strany oficiálního letáčku, který dostanete do svých poštovních schránek v Horní Stropnici a osadách.`,pages:JSON.parse(JSON.stringify(BSM_DATA.leafletPages))},podnety:{badge:`Vaše obec, váš názor`,title:`Co byste v Horní Stropnici nebo vaší osadě změnili?`,desc:`Chceme být zastupiteli, kteří mají stálý kontakt se sousedy. Napište nám, co vás pálí, jaký nápad máte pro vaši ulici nebo osadu. Každým podnětem se budeme zabývat.`},footer:{title:`BSM Horní Stropnice`,tagline:`Bezpečnost • Stabilita • Mládež`,description:`Nezávislé sdružení kandidátů pro komunální volby do Zastupitelstva obce Horní Stropnice. Volební číslo 6.`,share:{heading:`Sdílejte mezi sousedy`,desc:`Pomozte nám šířit náš program v Horní Stropnici a na všech osadách:`,whatsapp:`WhatsApp`,whatsappUrl:`https://api.whatsapp.com/send?text=Podívejte%20se%20na%20program%20a%20kandidáty%20BSM%20pro%20Horní%20Stropnici%20(Volební%20číslo%206):%20https://bsm-horni-stropnice.vercel.app`,whatsappMsg:`Podívejte se na program a kandidáty BSM pro Horní Stropnici (Volební číslo 6): https://bsm-horni-stropnice.vercel.app`,facebook:`Facebook`,facebookUrl:`https://www.facebook.com/sharer/sharer.php?u=https://bsm-horni-stropnice.vercel.app`,facebookShareUrl:`https://bsm-horni-stropnice.vercel.app`,copy:`📋 Kopírovat odkaz`}}}}async function a(){let e=null;if(r.supabaseClient)try{let{data:t,error:n}=await r.supabaseClient.from(`site_sections`).select(`title`).eq(`id`,`bsm_site_content`).maybeSingle();if(!n&&t&&t.title)try{e=JSON.parse(t.title)}catch(e){console.warn(`Chyba parsování obsahu webu ze Supabase:`,e)}}catch(e){console.warn(`Chyba dotazu na obsah v Supabase:`,e)}if(!e){let t=localStorage.getItem(`bsm_site_content`);if(t)try{e=JSON.parse(t)}catch(e){console.warn(`Chyba čtení bsm_site_content z localStorage:`,e)}}e||=n(),r.appSiteContent=o(n(),e),s(r.appSiteContent)}function o(e,t){let n=Object.assign({},e);return e&&typeof e==`object`&&t&&typeof t==`object`&&Object.keys(t).forEach(r=>{Array.isArray(t[r])?n[r]=t[r]:t[r]&&typeof t[r]==`object`&&!Array.isArray(t[r])&&r in e?n[r]=o(e[r],t[r]):Object.assign(n,{[r]:t[r]})}),n}function s(e){if(!e)return;let t=document.getElementById(`heroBudovaImg`);t&&e.hero?.bannerImg&&(t.src=e.hero.bannerImg);let n=document.getElementById(`heroBannerBadge`);n&&e.hero?.bannerBadge&&(n.textContent=e.hero.bannerBadge);let r=document.getElementById(`heroBannerHeading`);r&&e.hero?.bannerHeading&&(r.textContent=e.hero.bannerHeading);let i=document.getElementById(`heroBadge`);i&&e.hero?.badge&&(i.textContent=e.hero.badge);let a=document.getElementById(`heroSlogan`);a&&e.hero?.slogan&&(a.textContent=e.hero.slogan);let o=document.getElementById(`heroH1`);if(o&&e.hero?.h1){let t=e.hero.h1.split(`.`).map(e=>e.trim()).filter(Boolean);t.length>=3?o.innerHTML=`
        ${escapeHtml(t[0])}. <br class="hidden sm:inline" />
        <span class="text-bsm-800">${escapeHtml(t[1])}.</span> <br class="hidden sm:inline" />
        ${escapeHtml(t[2])}.
      `:o.textContent=e.hero.h1}let s=document.getElementById(`heroIntroText`);s&&e.hero?.introText&&(s.textContent=e.hero.introText);let c=document.getElementById(`heroFridayHours`);c&&e.hero?.fridayHours&&(c.textContent=e.hero.fridayHours);let l=document.getElementById(`heroSaturdayHours`);l&&e.hero?.saturdayHours&&(l.textContent=e.hero.saturdayHours);let d=document.getElementById(`heroLogoImg`);d&&e.hero?.logoImg&&(d.src=e.hero.logoImg);let f=document.getElementById(`onasBadge`);f&&e.onas?.badge&&(f.textContent=e.onas.badge);let p=document.getElementById(`onasTitle`);p&&e.onas?.title&&(p.textContent=e.onas.title);let m=document.getElementById(`onasIntroText`);if(m&&e.onas?.introText&&(m.textContent=e.onas.introText),e.onas?.card1){let t=document.getElementById(`onasCard1Icon`),n=document.getElementById(`onasCard1Title`),r=document.getElementById(`onasCard1Desc`);t&&(t.textContent=e.onas.card1.icon||`🤝`),n&&(n.textContent=e.onas.card1.title||``),r&&(r.textContent=e.onas.card1.desc||``)}if(e.onas?.card2){let t=document.getElementById(`onasCard2Icon`),n=document.getElementById(`onasCard2Title`),r=document.getElementById(`onasCard2Desc`);t&&(t.textContent=e.onas.card2.icon||`🌲`),n&&(n.textContent=e.onas.card2.title||``),r&&(r.textContent=e.onas.card2.desc||``)}if(e.onas?.card3){let t=document.getElementById(`onasCard3Icon`),n=document.getElementById(`onasCard3Title`),r=document.getElementById(`onasCard3Desc`);t&&(t.textContent=e.onas.card3.icon||`⚖️`),n&&(n.textContent=e.onas.card3.title||``),r&&(r.textContent=e.onas.card3.desc||``)}let h=document.getElementById(`onasQuoteText`);h&&e.onas?.quoteText&&(h.textContent=e.onas.quoteText);let g=document.getElementById(`onasQuoteAuthor`);g&&e.onas?.quoteAuthor&&(g.textContent=e.onas.quoteAuthor);let _=document.getElementById(`programBadge`);_&&e.program?.badge&&(_.textContent=e.program.badge);let v=document.getElementById(`programTitle`);v&&e.program?.title&&(v.textContent=e.program.title);let y=document.getElementById(`programSubtitle`);y&&e.program?.subtitle&&(y.textContent=e.program.subtitle);let b=document.getElementById(`programCtaTitle`);b&&e.program?.ctaTitle&&(b.textContent=e.program.ctaTitle);let x=document.getElementById(`programCtaDesc`);x&&e.program?.ctaDesc&&(x.textContent=e.program.ctaDesc);let S=document.getElementById(`programCtaBtn`);S&&e.program?.ctaBtn&&(S.textContent=e.program.ctaBtn),Array.isArray(e.program?.pillars)&&e.program.pillars.length>0&&(BSM_DATA.pillars=e.program.pillars,u());let C=document.getElementById(`kdeVolitBadge`);C&&e.kdeVolit?.badge&&(C.textContent=e.kdeVolit.badge);let w=document.getElementById(`kdeVolitTitle`);w&&e.kdeVolit?.title&&(w.textContent=e.kdeVolit.title);let T=document.getElementById(`kdeVolitDesc`);T&&e.kdeVolit?.desc&&(T.textContent=e.kdeVolit.desc),Array.isArray(e.kdeVolit?.wards)&&e.kdeVolit.wards.length>0&&(BSM_DATA.wards=e.kdeVolit.wards,typeof selectWard==`function`&&selectWard(1));let E=document.getElementById(`jakVolitBadge`);E&&e.jakVolit?.badge&&(E.textContent=e.jakVolit.badge);let D=document.getElementById(`jakVolitTitle`);D&&e.jakVolit?.title&&(D.textContent=e.jakVolit.title);let O=document.getElementById(`jakVolitDesc`);O&&e.jakVolit?.desc&&(O.textContent=e.jakVolit.desc);let k=document.getElementById(`letacekBadge`);k&&e.letacek?.badge&&(k.textContent=e.letacek.badge);let A=document.getElementById(`letacekTitle`);A&&e.letacek?.title&&(A.textContent=e.letacek.title);let j=document.getElementById(`letacekDesc`);j&&e.letacek?.desc&&(j.textContent=e.letacek.desc),Array.isArray(e.letacek?.pages)&&e.letacek.pages.length>0&&(BSM_DATA.leafletPages=e.letacek.pages,N());let M=document.getElementById(`podnetyBadge`);M&&e.podnety?.badge&&(M.textContent=e.podnety.badge);let P=document.getElementById(`podnetyTitle`);P&&e.podnety?.title&&(P.textContent=e.podnety.title);let F=document.getElementById(`podnetyDesc`);F&&e.podnety?.desc&&(F.textContent=e.podnety.desc);let I=document.getElementById(`footerTitle`);I&&e.footer?.title&&(I.textContent=e.footer.title);let L=document.getElementById(`footerTagline`);L&&e.footer?.tagline&&(L.textContent=e.footer.tagline);let R=document.getElementById(`footerDescription`);R&&e.footer?.description&&(R.textContent=e.footer.description);let z=document.getElementById(`footerLogoImg`);if(z&&e.hero?.logoImg&&(z.src=e.hero.logoImg),e.nav){let t=document.getElementById(`navOnas`);t&&e.nav.onas&&(t.textContent=e.nav.onas);let n=document.getElementById(`navProgram`);n&&e.nav.program&&(n.textContent=e.nav.program);let r=document.getElementById(`navKandidati`);r&&e.nav.kandidati&&(r.textContent=e.nav.kandidati);let i=document.getElementById(`navKdeVolit`);i&&e.nav.kdeVolit&&(i.textContent=e.nav.kdeVolit);let a=document.getElementById(`navJakVolit`);a&&e.nav.jakVolit&&(a.textContent=e.nav.jakVolit);let o=document.getElementById(`navLetacek`);o&&e.nav.letacek&&(o.textContent=e.nav.letacek);let s=document.getElementById(`navCta`);if(s&&e.nav.cta){let t=s.querySelector(`span`);t?t.textContent=e.nav.cta:s.textContent=e.nav.cta}}if(e.footer?.share){let t=document.getElementById(`shareHeading`);t&&e.footer.share.heading&&(t.textContent=e.footer.share.heading);let n=document.getElementById(`shareDesc`);n&&e.footer.share.desc&&(n.textContent=e.footer.share.desc);let r=document.getElementById(`shareWhatsappBtn`);r&&(e.footer.share.whatsapp&&(r.textContent=e.footer.share.whatsapp),e.footer.share.whatsappUrl&&(r.href=e.footer.share.whatsappUrl));let i=document.getElementById(`shareFacebookBtn`);i&&(e.footer.share.facebook&&(i.textContent=e.footer.share.facebook),e.footer.share.facebookUrl&&(i.href=e.footer.share.facebookUrl));let a=document.getElementById(`shareCopyBtn`);a&&e.footer.share.copy&&(a.textContent=e.footer.share.copy)}}async function c(){let e=null;if(r.supabaseClient)try{let{data:t,error:n}=await r.supabaseClient.from(`site_sections`).select(`*`).order(`order_index`,{ascending:!0});!n&&t&&t.length>0&&(e=t.filter(e=>e.id!==`bsm_site_content`).map(e=>({id:e.id,title:e.title,order:e.order_index,visible:e.is_visible})))}catch(e){console.warn(`Chyba čtení sekcí ze Supabase:`,e)}if(!e){let t=localStorage.getItem(`bsm_sections_order`);if(t)try{e=JSON.parse(t).filter(e=>e.id!==`bsm_site_content`)}catch(e){console.error(`Chyba parsování sekcí z localStorage:`,e)}}(!e||e.length===0)&&(e=JSON.parse(JSON.stringify(BSM_DATA.defaultSections))),r.appSections=e,l(r.appSections)}function l(e){let t=document.getElementById(`modularSectionsContainer`);if(!t)return;let n=[...e].sort((e,t)=>e.order-t.order),i=r.isInPageEditActive!==void 0&&r.isInPageEditActive;n.forEach(e=>{let n=document.getElementById(e.id);n&&(t.appendChild(n),e.visible===!1?i?(n.classList.remove(`hidden`),n.classList.add(`section-hidden-admin`)):(n.classList.add(`hidden`),n.classList.remove(`section-hidden-admin`)):(n.classList.remove(`hidden`),n.classList.remove(`section-hidden-admin`)))})}function u(){let e=document.getElementById(`pillarsContainer`);e&&(e.innerHTML=BSM_DATA.pillars.map((e,t)=>`
      <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/80 overflow-hidden flex flex-col relative group">
        <div class="p-6 md:p-8 flex-1 flex flex-col">
          <div class="flex items-center justify-between gap-3 mb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-sky-100 text-sky-800" data-editable="pillar-badge" data-pillar="${t}">
              ${escapeHtml(e.badge)}
            </span>
            <span class="text-xs font-bold text-slate-400">PILÍŘ 0${t+1}</span>
          </div>

          <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-2" data-editable="pillar-title" data-pillar="${t}">
            ${escapeHtml(e.title)}
          </h3>
          <p class="text-sky-900/80 font-medium text-sm mb-4" data-editable="pillar-subtitle" data-pillar="${t}">
            ${escapeHtml(e.subtitle)}
          </p>
          <p class="text-slate-600 text-sm leading-relaxed mb-6" data-editable="pillar-desc" data-pillar="${t}">
            ${escapeHtml(e.description)}
          </p>

          <div class="space-y-3 pt-2 border-t border-slate-100 flex-1">
            ${e.points.map((e,n)=>`
              <div class="group/point bg-slate-50 hover:bg-sky-50/60 p-3.5 rounded-xl border border-slate-200/60 transition-colors relative">
                <div class="flex items-start gap-3">
                  <div class="mt-0.5 text-sky-700 flex-shrink-0">
                    <svg class="w-4 h-4 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-bold text-slate-800 group-hover/point:text-sky-900 transition-colors" data-editable="point-title" data-pillar="${t}" data-point="${n}">
                      ${escapeHtml(e.title)}
                    </h4>
                    <p class="text-xs text-slate-500 mt-1 leading-normal" data-editable="point-detail" data-pillar="${t}" data-point="${n}">
                      ${escapeHtml(e.detail)}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onclick="deletePillarPoint(${t}, ${n})" 
                    class="pillar-point-delete-btn text-slate-400 hover:text-red-500 font-black text-xs p-1 ml-1 transition-colors cursor-pointer"
                    title="Smazat tento bod programu">
                    🗑️
                  </button>
                </div>
              </div>
            `).join(``)}
          </div>

          <div class="pt-4 text-center">
            <button 
              type="button" 
              onclick="addNewPillarPoint(${t})" 
              class="pillar-point-add-btn text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3.5 py-1.5 rounded-xl border border-dashed border-sky-300 transition-all cursor-pointer">
              ➕ Přidat bod do tohoto pilíře
            </button>
          </div>
        </div>
      </div>
    `).join(``),initLucideIcons(),r.isInPageEditActive!==void 0&&r.isInPageEditActive&&T())}window.addNewPillarPoint=function(e){BSM_DATA.pillars[e]&&(BSM_DATA.pillars[e].points.push({title:`Nový bod volebního programu`,detail:`Zadejte podrobný popis tohoto programového záměru...`}),u(),E(!0),M(`➕ Nový bod byl přidán do pilíře ${BSM_DATA.pillars[e].title}.`))},window.deletePillarPoint=function(e,t){BSM_DATA.pillars[e]&&confirm(`Opravdu chcete tento bod programu odstranit?`)&&(BSM_DATA.pillars[e].points.splice(t,1),u(),E(!0),M(`🗑️ Bod programu byl odstraněn.`))};async function d(){let e=null;if(r.supabaseClient)try{let{data:t,error:n}=await r.supabaseClient.from(`candidates`).select(`*`).order(`number`,{ascending:!0});!n&&t&&t.length>0&&(e=t)}catch(e){console.warn(`Chyba čtení kandidátů ze Supabase:`,e)}if(!e){let t=localStorage.getItem(`bsm_candidates`);if(t)try{e=JSON.parse(t)}catch(e){console.error(`Chyba parsování kandidátů z localStorage:`,e)}}(!e||e.length===0)&&(e=JSON.parse(JSON.stringify(BSM_DATA.candidates))),e.forEach(e=>{e.tags&&typeof e.tags==`object`&&!Array.isArray(e.tags)&&(e.tags.photo_url&&(e.photo_url=e.tags.photo_url),e.tags=Array.isArray(e.tags.list)?e.tags.list:[])}),r.appCandidates=e,f(r.currentCandidateFilter)}function f(e=`all`){let t=document.getElementById(`candidatesGrid`);if(!t)return;r.currentCandidateFilter=e;let n=e===`all`?r.appCandidates:r.appCandidates.filter(t=>(Array.isArray(t.tags)?t.tags:[]).some(t=>t.toLowerCase().includes(e.toLowerCase())));t.innerHTML=n.map(e=>{let t=e.name.replace(/Mgr\.|Bc\.|PaedDr\./g,``).trim().split(` `).map(e=>e[0]).join(``).slice(0,2),n=Array.isArray(e.tags)?e.tags:[],r=e.photo_url||``;return`
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col relative group">
        <!-- Admin lišta -->
        <div class="candidate-card-admin-bar">
          <button 
            type="button" 
            onclick="openCandidateEditModal(${e.number})" 
            class="text-sky-300 hover:text-white px-2 py-1 rounded text-xs font-bold bg-slate-800 hover:bg-slate-700 transition-colors" 
            title="Otevřít okno pro úpravu kandidáta">
            ✏️ Upravit profil
          </button>
        </div>

        <!-- Pozice na kandidátce -->
        <div class="absolute top-4 right-4 flex items-center gap-1.5">
          <span class="w-7 h-7 rounded-full bg-sky-100 text-sky-900 font-extrabold text-xs flex items-center justify-center shadow-inner">
            ${e.number}
          </span>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <!-- Profilová fotografie nebo iniciály s gradientem -->
          <div class="relative img-edit-container flex-shrink-0 group/photo">
            ${r?`
              <div class="w-16 h-16 rounded-full overflow-hidden shadow-md ring-4 ring-sky-100 bg-slate-100">
                <img 
                  id="candidatePhoto-${e.number}"
                  src="${escapeHtml(r)}" 
                  alt="${escapeHtml(e.name)}" 
                  class="w-full h-full object-cover" 
                  onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-full h-full bg-gradient-to-br from-sky-700 to-sky-900 text-white font-bold text-lg flex items-center justify-center\\'>${t}</div>';" 
                />
              </div>
            `:`
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-sky-700 to-sky-900 text-white font-bold text-lg flex items-center justify-center shadow-md ring-4 ring-sky-50">
                <span id="candidatePhotoFallback-${e.number}">${t}</span>
              </div>
            `}
            <button 
              type="button" 
              onclick="openImageEditModalForCandidate(${e.number})" 
              class="img-edit-btn !text-[10px] !py-0.5 !px-1.5 !top-0 !left-0 whitespace-nowrap shadow-lg">
              📷 Foto
            </button>
          </div>

          <div class="pr-8 flex-1">
            <h4 class="font-extrabold text-slate-900 text-base leading-snug group-hover:text-sky-800 transition-colors" data-editable="candidate-name" data-candidate="${e.number}">
              ${escapeHtml(e.name)}
            </h4>
            <div class="flex flex-wrap items-center gap-1.5 text-xs text-sky-800 font-semibold mt-0.5">
              <span data-editable="candidate-profession" data-candidate="${e.number}">${escapeHtml(e.profession)}</span>
              <span class="text-slate-300">•</span>
              <span data-editable="candidate-age" data-candidate="${e.number}">${e.age||``}</span>
              <span class="text-slate-500 font-medium">let</span>
            </div>
            <p class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <span>📍</span> <span data-editable="candidate-settlement" data-candidate="${e.number}">${escapeHtml(e.settlement)}</span>
            </p>
          </div>
        </div>

        <!-- Citát / Proč kandiduje -->
        <div class="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 italic mb-4 flex-1 border border-slate-100" data-editable="candidate-quote" data-candidate="${e.number}">
          ${escapeHtml(e.quote||``)}
        </div>

        <!-- Tagy a zaměření -->
        <div class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          ${n.map((t,n)=>`
            <span class="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full transition-all group/tag">
              <span data-editable="candidate-tag" data-candidate="${e.number}" data-tag-index="${n}">${escapeHtml(t)}</span>
              <button 
                type="button" 
                onclick="removeCandidateTag(${e.number}, ${n})" 
                class="candidate-tag-delete-btn text-slate-400 hover:text-red-500 font-black text-xs px-0.5 transition-colors cursor-pointer" 
                title="Smazat tento štítek">×</button>
            </span>
          `).join(``)}
          <button 
            type="button" 
            onclick="addCandidateTag(${e.number})" 
            class="candidate-tag-add-btn text-[10px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-0.5 rounded-full border border-dashed border-sky-300 transition-colors cursor-pointer"
            title="Přidat další štítek pro tohoto kandidáta">
            + Štítek
          </button>
        </div>
      </div>
    `}).join(``);let i=document.getElementById(`candidatesCountBadge`);i&&(i.textContent=`${n.length} z ${r.appCandidates.length} kandidátů`),r.isInPageEditActive!==void 0&&r.isInPageEditActive&&T()}window.addCandidateTag=function(e){let t=r.appCandidates.find(t=>t.number===e);t&&(Array.isArray(t.tags)||(t.tags=[]),t.tags.push(`Nový štítek`),f(r.currentCandidateFilter),E(!0),M(`➕ Nový štítek byl přidán. Můžete do něj kliknout a přepsat text.`))},window.removeCandidateTag=function(e,t){let n=r.appCandidates.find(t=>t.number===e);n&&Array.isArray(n.tags)&&(n.tags.splice(t,1),f(r.currentCandidateFilter),E(!0),M(`🗑️ Štítek byl odebrán.`))},window.filterCandidates=function(e,t){document.querySelectorAll(`.candidate-filter-btn`).forEach(e=>{e.classList.remove(`bg-bsm-800`,`text-white`),e.classList.add(`bg-white`,`text-slate-700`,`border-slate-200`)}),t&&(t.classList.remove(`bg-white`,`text-slate-700`,`border-slate-200`),t.classList.add(`bg-bsm-800`,`text-white`)),f(e)};function p(){let e=document.getElementById(`settlementChips`),t=document.getElementById(`wardResultCard`),n=document.getElementById(`settlementSearchInput`);e&&t&&(e.innerHTML=BSM_DATA.allSettlements.map(e=>`
    <button 
      onclick="selectSettlement('${e.name}')" 
      class="settlement-chip text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-300 text-slate-700 transition-all shadow-sm">
      ${e.name}
    </button>
  `).join(``),n&&n.addEventListener(`input`,t=>{let n=t.target.value.toLowerCase().trim();e.querySelectorAll(`.settlement-chip`).forEach(e=>{e.textContent.toLowerCase().includes(n)?e.classList.remove(`hidden`):e.classList.add(`hidden`)});let r=BSM_DATA.allSettlements.find(e=>e.name.toLowerCase()===n);r&&selectSettlement(r.name)}),selectSettlement(`Horní Stropnice`))}window.selectSettlement=function(e){let t=BSM_DATA.allSettlements.find(t=>t.name===e);if(!t)return;let n=BSM_DATA.wards.find(e=>e.id===t.wardId);if(!n)return;document.querySelectorAll(`.settlement-chip`).forEach(t=>{t.textContent.trim()===e?(t.classList.add(`bg-bsm-800`,`text-white`,`border-bsm-800`),t.classList.remove(`bg-white`,`text-slate-700`,`border-slate-200`)):(t.classList.remove(`bg-bsm-800`,`text-white`,`border-bsm-800`),t.classList.add(`bg-white`,`text-slate-700`,`border-slate-200`))});let i=document.getElementById(`wardResultCard`);if(!i)return;let a=r.appSiteContent?.kdeVolit?.fridayHours||`Pátek 9. října: 14:00 – 22:00`,o=r.appSiteContent?.kdeVolit?.saturdayHours||`Sobota 10. října: 08:00 – 14:00`,s=r.appSiteContent?.kdeVolit?.idNote||`Nezapomeňte si vzít s sebou platný občanský průkaz!`,c=r.appSiteContent?.kdeVolit?.mapsBtn||`Otevřít navigaci v Google Mapách`;i.innerHTML=`
    <div class="bg-gradient-to-br from-bsm-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-bsm-700/50">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-sky-800/80 pb-4">
        <div>
          <span class="text-xs uppercase tracking-widest text-sky-300 font-bold" data-editable="ward_selected_label">Vybraná osada / obec:</span>
          <h3 class="text-2xl font-black text-white flex items-center gap-2">
            <span>📍</span> <span data-editable="ward_settlement_name">${e}</span>
          </h3>
        </div>
        <div class="bg-sky-500/20 text-sky-200 border border-sky-400/40 px-4 py-2 rounded-xl text-center">
          <div class="text-[11px] font-bold uppercase tracking-wider" data-editable="ward_box_label">Váš volební okrsek</div>
          <div class="text-xl font-black text-white" data-editable="ward_number_label">ČÍSLO ${n.number}</div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <div class="text-xs font-semibold text-sky-300 uppercase tracking-wider mb-1" data-editable="ward_room_label">Místo volební místnosti:</div>
          <div class="text-lg font-bold text-white mb-1" data-editable="ward_${n.id}_title" data-ward-id="${n.id}" data-ward-field="title">${escapeHtml(n.title)}</div>
          <div class="text-sm text-sky-100/90 mb-3" data-editable="ward_${n.id}_location" data-ward-id="${n.id}" data-ward-field="location">${escapeHtml(n.location)}</div>
          <div class="text-xs text-sky-200 bg-slate-950/60 p-3 rounded-lg border border-sky-800/50" data-editable="ward_${n.id}_desc" data-ward-id="${n.id}" data-ward-field="description">
            ℹ️ ${escapeHtml(n.description)}
          </div>
        </div>

        <div>
          <div class="text-xs font-semibold text-sky-300 uppercase tracking-wider mb-1" data-editable="ward_hours_label">Volební dny a čas:</div>
          <div class="space-y-1.5 text-sm mb-4">
            <div class="flex items-center gap-2 text-sky-100">
              <span data-editable="ward_friday_hours">${escapeHtml(a)}</span>
            </div>
            <div class="flex items-center gap-2 text-sky-100">
              <span data-editable="ward_saturday_hours">${escapeHtml(o)}</span>
            </div>
          </div>

          <div class="text-xs text-sky-300 uppercase tracking-wider mb-1">Spadá sem celkem ${n.settlements.length} osad:</div>
          <p class="text-xs text-slate-300 leading-relaxed">
            ${n.settlements.join(` • `)}
          </p>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-sky-800/80 flex flex-wrap items-center justify-between gap-4">
        <a 
          href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.mapQuery)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          id="wardMapsBtn"
          data-editable="ward_maps_btn"
          class="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-sky-500/20">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span>${escapeHtml(c)}</span>
        </a>
        <span class="text-xs text-sky-300/80" data-editable="ward_id_note">${escapeHtml(s)}</span>
      </div>
    </div>
  `,r.isInPageEditActive!==void 0&&r.isInPageEditActive&&T()};var m=`party`,h=new Set;function g(){document.getElementById(`ballotSimulatorContainer`)&&_()}window.setVotingMode=function(e){m=e,h.clear(),_()},window.toggleCandidateVote=function(e){if(m!==`party`){if(h.has(e))h.delete(e);else{if(h.size>=15){alert(`V komunálních volbách v Horní Stropnici můžete udělit nejvýše 15 hlasů.`);return}h.add(e)}_()}};function _(){let e=document.getElementById(`ballotSimulatorContainer`);if(!e)return;let t=m===`party`,n=m===`cross`,i=m===`combo`,a=``;t?a=`
      <div class="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 text-sm leading-relaxed mb-6">
        <strong class="font-bold flex items-center gap-1.5 text-emerald-800 mb-1">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span data-editable="ballot_party_info_title">${escapeHtml(r.appSiteContent?.jakVolit?.partyInfoTitle||`NEJJEDNODUŠŠÍ A NEJÚČINNĚJŠÍ ZPŮSOB (Doporučeno):`)}</span>
        </strong>
        <div data-editable="ballot_party_info_desc">${r.appSiteContent?.jakVolit?.partyInfoDesc||`Označíte <strong>jediným velkým křížkem</strong> rámeček u volebního čísla <strong>6 BSM</strong> v záhlaví. Tím dáváte všech svých <strong>15 hlasů celé naší kandidátce</strong>. Každý kandidát BSM obdrží 1 hlas. Žádný hlas se neztratí a zajistíte maximální podporu celého týmu.`}</div>
      </div>
    `:n?a=`
      <div class="bg-sky-50 border border-sky-200 text-sky-950 rounded-xl p-4 text-sm leading-relaxed mb-6">
        <strong class="font-bold flex items-center gap-1.5 text-sky-900 mb-1">
          <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span data-editable="ballot_cross_info_title">${escapeHtml(r.appSiteContent?.jakVolit?.crossInfoTitle||`VÝBĚR JEDNOTLIVÝCH KANDIDÁTŮ (Panašování):`)}</span>
        </strong>
        <div data-editable="ballot_cross_info_desc">${r.appSiteContent?.jakVolit?.crossInfoDesc||`Nekřížkujete stranu v záhlaví, ale vybíráte konkrétní kandidáty před jejich jmény. Můžete udělit <strong>nejvýše 15 křížků</strong>.`} (Vybráno máte nyní: <strong>${h.size} z 15</strong>)</div>
      </div>
    `:i&&(a=`
      <div class="bg-amber-50 border border-amber-200 text-amber-950 rounded-xl p-4 text-sm leading-relaxed mb-6">
        <strong class="font-bold flex items-center gap-1.5 text-amber-900 mb-1">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <span data-editable="ballot_combo_info_title">${escapeHtml(r.appSiteContent?.jakVolit?.comboInfoTitle||`KOMBINOVANÁ VOLBA:`)}</span>
        </strong>
        <div data-editable="ballot_combo_info_desc">${r.appSiteContent?.jakVolit?.comboInfoDesc||`Dáte křížek do záhlaví BSM a k tomu křížek jednotlivcům z jiných kandidátek. Hlasy pro jiné kandidáty se započítají jako první, a zbývající hlasy z 15 se automaticky přidělí kandidátce BSM shora dolů.`}</div>
      </div>
    `),e.innerHTML=`
    <div class="flex flex-wrap gap-2 mb-6">
      <button 
        onclick="setVotingMode('party')" 
        class="flex-1 min-w-[200px] text-xs md:text-sm font-bold py-3 px-4 rounded-xl border transition-all text-center ${t?`bg-bsm-800 text-white border-bsm-800 shadow-md`:`bg-white text-slate-700 border-slate-200 hover:bg-slate-50`}">
        <span data-editable="ballot_tab_party">${escapeHtml(r.appSiteContent?.jakVolit?.tabParty||`⭐ 1. Celá kandidátka BSM (Doporučeno)`)}</span>
      </button>
      <button 
        onclick="setVotingMode('cross')" 
        class="flex-1 min-w-[200px] text-xs md:text-sm font-bold py-3 px-4 rounded-xl border transition-all text-center ${n?`bg-bsm-800 text-white border-bsm-800 shadow-md`:`bg-white text-slate-700 border-slate-200 hover:bg-slate-50`}">
        <span data-editable="ballot_tab_cross">${escapeHtml(r.appSiteContent?.jakVolit?.tabCross||`2. Křížkování kandidátů`)}</span> (${h.size}/15)
      </button>
      <button 
        onclick="setVotingMode('combo')" 
        class="flex-1 min-w-[200px] text-xs md:text-sm font-bold py-3 px-4 rounded-xl border transition-all text-center ${i?`bg-bsm-800 text-white border-bsm-800 shadow-md`:`bg-white text-slate-700 border-slate-200 hover:bg-slate-50`}">
        <span data-editable="ballot_tab_combo">${escapeHtml(r.appSiteContent?.jakVolit?.tabCombo||`3. Kombinovaná volba`)}</span>
      </button>
    </div>

    ${a}

    <div class="bg-amber-50/50 border-2 border-slate-300 rounded-2xl p-6 shadow-inner font-mono text-xs md:text-sm max-w-2xl mx-auto">
      <div class="text-center pb-3 border-b-2 border-slate-400 mb-4">
        <div class="text-[11px] text-slate-500 uppercase tracking-widest font-sans font-bold" data-editable="ballot_header_sub">${escapeHtml(r.appSiteContent?.jakVolit?.ballotHeaderSub||`Ukázka části volebního lístku`)}</div>
        <div class="text-base font-bold font-sans text-slate-900 mt-1" data-editable="ballot_header_title">${escapeHtml(r.appSiteContent?.jakVolit?.ballotHeaderTitle||`Obec Horní Stropnice – Volby do zastupitelstva obce`)}</div>
      </div>

      <div class="border-2 border-bsm-800 rounded-xl overflow-hidden bg-white shadow-sm">
        <div class="bg-bsm-900 text-white p-4 flex items-center justify-between">
          <div>
            <div class="text-xs text-sky-200 uppercase font-sans font-bold" data-editable="ballot_party_num_label">Volební číslo</div>
            <div class="text-2xl font-black font-sans" data-editable="ballot_party_name">${escapeHtml(r.appSiteContent?.jakVolit?.ballotPartyName||`6. BSM`)}</div>
            <div class="text-[11px] text-sky-200 font-sans" data-editable="ballot_party_motto">${escapeHtml(r.appSiteContent?.jakVolit?.ballotPartyMotto||`Bezpečnost • Stabilita • Mládež`)}</div>
          </div>
          <div class="text-center">
            <div class="text-[10px] text-sky-200 uppercase font-sans font-bold mb-1" data-editable="ballot_party_vote_label">Hlas straně</div>
            <div 
              class="w-12 h-12 bg-white rounded-lg border-2 border-dashed border-sky-400 text-bsm-900 flex items-center justify-center font-black text-2xl cursor-pointer hover:bg-sky-50 shadow-inner"
              onclick="setVotingMode('party')">
              ${t||i?`✕`:``}
            </div>
          </div>
        </div>

        <div class="divide-y divide-slate-100 max-h-[380px] overflow-y-auto font-sans">
          ${r.appCandidates.map(e=>{let r=t||n&&h.has(e.number);return`
              <div 
                onclick="${n?`toggleCandidateVote(${e.number})`:``}"
                class="p-2.5 flex items-center justify-between gap-3 hover:bg-sky-50/50 transition-colors ${n?`cursor-pointer`:``}">
                <div class="flex items-center gap-2.5">
                  <div class="w-5 h-5 rounded border ${r?`bg-bsm-700 border-bsm-700 text-white`:`border-slate-300 bg-white`} flex items-center justify-center text-xs font-bold">
                    ${r?`✓`:``}
                  </div>
                  <span class="text-slate-400 font-bold text-xs w-4">${e.number}.</span>
                  <span class="font-bold text-slate-800 text-xs">${e.name}</span>
                </div>
                <span class="text-[11px] text-slate-500 truncate max-w-[160px]">${e.profession}${e.age?`, ${e.age} let`:``}</span>
              </div>
            `}).join(``)}
        </div>
      </div>
    </div>
  `,r.isInPageEditActive!==void 0&&r.isInPageEditActive&&T()}function v(){let e=document.getElementById(`citizenFeedbackForm`),t=document.getElementById(`feedbackSettlement`);t&&(t.innerHTML=`
      <option value="">-- Vyberte vaši osadu / část obce --</option>
      ${BSM_DATA.allSettlements.map(e=>`<option value="${e.name}">${e.name}</option>`).join(``)}
    `),e&&e.addEventListener(`submit`,y)}async function y(e){e.preventDefault();let t=document.getElementById(`feedbackSettlement`).value,n=document.getElementById(`feedbackMessage`).value.trim(),i=document.getElementById(`feedbackContact`).value.trim(),a=e.target.querySelector(`button[type='submit']`),o=document.getElementById(`feedbackStatus`);if(!n){alert(`Prosím napište váš nápad nebo podnět.`);return}let s=a.innerHTML;a.disabled=!0,a.innerHTML=`
    <span class="inline-flex items-center gap-2">
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      Odesílám podnět...
    </span>
  `;let c={id:`fb_`+Date.now(),settlement:t||`Horní Stropnice (obec)`,message:n,contact:i||`neuvedeno`,created_at:new Date().toISOString(),status:`new`},l=!1;if(r.supabaseClient)try{let{data:e,error:t}=await r.supabaseClient.from(`feedbacks`).insert([{settlement:c.settlement,message:c.message,contact:c.contact,status:`new`}]);t?console.warn(`Chyba při ukládání do Supabase:`,t):l=!0}catch(e){console.warn(`Chyba spojení se Supabase:`,e)}if(!l){let e=JSON.parse(localStorage.getItem(`bsm_feedbacks`)||`[]`);e.unshift(c),localStorage.setItem(`bsm_feedbacks`,JSON.stringify(e)),l=!0}a.disabled=!1,a.innerHTML=s,l&&(o&&(o.classList.remove(`hidden`),o.innerHTML=`
        <div class="bg-emerald-500/20 border border-emerald-400 text-emerald-100 p-5 rounded-2xl text-sm shadow-xl">
          <div class="flex items-center gap-2 font-bold text-white text-base mb-1">
            <span>✅</span> Váš podnět byl úspěšně zaznamenán!
          </div>
          <p class="text-xs text-emerald-200 leading-relaxed">
            Děkujeme za váš zájem o osadu <strong>${c.settlement}</strong>. Všechny podněty průběžně pročítáme v administraci a zařazujeme do priorit našeho týmu BSM.
          </p>
        </div>
      `,o.scrollIntoView({behavior:`smooth`,block:`nearest`})),e.target.reset(),updateAdminFeedbackCount())}function b(){let e=localStorage.getItem(`bsm_admin_user`);if(e)try{r.currentAdminUser=JSON.parse(e),localStorage.setItem(`bsm_admin_user`,JSON.stringify(r.currentAdminUser)),S(r.currentAdminUser.email),enableInPageEditing()}catch(e){console.error(`Chyba obnovy admin session:`,e),localStorage.removeItem(`bsm_admin_user`)}}function x(){window.addEventListener(`keydown`,e=>{e.ctrlKey&&e.shiftKey&&(e.key===`A`||e.key===`a`)&&(e.preventDefault(),r.currentAdminUser?toggleInPageEditMode():openAdminLoginModal()),(e.ctrlKey||e.metaKey)&&(e.key===`s`||e.key===`S`)&&r.currentAdminUser&&r.isInPageEditActive&&(e.preventDefault(),saveInPageChanges()),e.key===`Escape`&&(closeAdminLoginModal(),closeLeafletModal(),closeImageEditModal(),closeFeedbackDrawer())})}window.openAdminLoginModal=function(){if(r.currentAdminUser){enableInPageEditing(),M(`Jste přihlášen. Režim přímých úprav na stránce je aktivní.`);return}let e=document.getElementById(`adminLoginModal`);e&&(e.classList.remove(`hidden`),document.body.classList.add(`overflow-hidden`))},window.closeAdminLoginModal=function(){let e=document.getElementById(`adminLoginModal`);e&&e.classList.add(`hidden`),document.body.classList.remove(`overflow-hidden`);let t=document.getElementById(`adminLoginError`);t&&t.classList.add(`hidden`)},window.handleAdminLogin=async function(e){e.preventDefault();let t=document.getElementById(`adminLoginEmail`).value.trim(),n=document.getElementById(`adminLoginPassword`).value,i=document.getElementById(`adminLoginSubmitBtn`),a=document.getElementById(`adminLoginError`);i.disabled=!0,i.textContent=`Ověřuji přihlášení...`,a.classList.add(`hidden`);let o=!1,s=null;if(r.supabaseClient)try{let{data:e,error:i}=await r.supabaseClient.auth.signInWithPassword({email:t,password:n});!i&&e&&e.user?(o=!0,s={email:e.user.email,id:e.user.id,source:`supabase`}):console.warn(`Chyba Supabase Auth:`,i)}catch(e){console.warn(`Chyba při přihlašování přes Supabase:`,e)}i.disabled=!1,i.textContent=`Přihlásit se do správy`,o&&s?(r.currentAdminUser=s,localStorage.setItem(`bsm_admin_user`,JSON.stringify(r.currentAdminUser)),S(r.currentAdminUser.email),closeAdminLoginModal(),enableInPageEditing(),M(`✨ Vítejte! Režim přímých úprav přímo na stránce byl aktivován. Klikněte do libovolného textu a začněte psát.`)):(a.classList.remove(`hidden`),a.textContent=`Neplatné přihlašovací údaje nebo chyba připojení k databázi.`)};function S(e){let t=document.getElementById(`inPageAdminBar`),n=document.getElementById(`adminUserEmail`);t&&t.classList.remove(`hidden`),n&&(n.textContent=`(${e})`),O()}window.logoutAdmin=async function(){if(r.supabaseClient&&r.currentAdminUser?.source===`supabase`)try{await r.supabaseClient.auth.signOut()}catch(e){console.error(`Chyba při odhlášení ze Supabase:`,e)}r.currentAdminUser=null,localStorage.removeItem(`bsm_admin_user`),disableInPageEditing();let e=document.getElementById(`inPageAdminBar`);e&&e.classList.add(`hidden`),M(`Byl jste úspěšně odhlášen.`)};var C=null,w=null;window.enableInPageEditing=function(){r.isInPageEditActive=!0,document.body.classList.add(`admin-edit-active`);let e=document.getElementById(`toggleEditModeBtn`),t=document.getElementById(`editModeIcon`),n=document.getElementById(`editModeText`);e&&(e.className=`bg-sky-600 hover:bg-sky-500 text-white font-extrabold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm`,t&&(t.textContent=`✏️`),n&&(n.textContent=`Režim úprav: ZAPNUT`));let i=document.getElementById(`adminEditHint`);i&&i.classList.remove(`hidden`);let a=document.getElementById(`leafletAdminToolbar`);a&&(a.classList.remove(`hidden`),a.style.display=`flex`),l(r.appSections),D(),u(),f(r.currentCandidateFilter),N(),T()},window.disableInPageEditing=function(){r.isInPageEditActive=!1,document.body.classList.remove(`admin-edit-active`);let e=document.getElementById(`toggleEditModeBtn`),t=document.getElementById(`editModeIcon`),n=document.getElementById(`editModeText`);e&&(e.className=`bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5`,t&&(t.textContent=`👁️`),n&&(n.textContent=`Režim náhledu: NÁHLED`));let i=document.getElementById(`adminEditHint`);i&&i.classList.add(`hidden`);let a=document.getElementById(`leafletAdminToolbar`);a&&(a.classList.add(`hidden`),a.style.display=`none`),l(r.appSections),u(),f(r.currentCandidateFilter),N(),document.querySelectorAll(`[contenteditable="true"]`).forEach(e=>{e.removeAttribute(`contenteditable`)})},window.toggleInPageEditMode=function(){r.isInPageEditActive?(disableInPageEditing(),M(`👁️ Přepnuto do čistého náhledu (jak web vidí běžný občan).`)):(enableInPageEditing(),M(`✏️ Režim úprav aktivován. Klikněte do libovolného textu a pište.`))};function T(){r.isInPageEditActive&&(document.querySelectorAll(`#heroBannerBadge.#heroBannerHeading.#heroBadge.#heroSlogan.#heroH1.#heroIntroText.#heroFridayHours.#heroSaturdayHours.#onasBadge.#onasTitle.#onasIntroText.#onasQuoteText.#onasQuoteAuthor.#onasCard1Title.#onasCard1Desc.#onasCard2Title.#onasCard2Desc.#onasCard3Title.#onasCard3Desc.#programBadge.#programTitle.#programSubtitle.#programCtaTitle.#programCtaDesc.#programCtaBtn.#kdeVolitBadge.#kdeVolitTitle.#kdeVolitDesc.#jakVolitBadge.#jakVolitTitle.#jakVolitDesc.#letacekBadge.#letacekTitle.#letacekDesc.#podnetyBadge.#podnetyTitle.#podnetyDesc.#footerTitle.#footerTagline.#footerDescription.[data-editable]`.split(`.`).join(`,`)).forEach(e=>{e.setAttribute(`contenteditable`,`true`),e.setAttribute(`spellcheck`,`false`),e.dataset.listenerAttached||(e.dataset.listenerAttached=`true`,e.addEventListener(`input`,()=>{E(!0)}))}),document.querySelectorAll(`a[data-editable]`).forEach(e=>{e.dataset.clickPreventAttached||(e.dataset.clickPreventAttached=`true`,e.addEventListener(`click`,e=>{r.isInPageEditActive&&e.preventDefault()}))}))}function E(e){let t=document.getElementById(`unsavedDot`),n=document.getElementById(`inPageSaveBtn`);if(t&&t.classList.toggle(`hidden`,!e),n){let t=n.querySelector(`span:nth-child(2)`);e?(n.className=`bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-1.5 rounded-xl transition-all shadow-lg flex items-center gap-1.5 animate-pulse ring-2 ring-amber-300`,t&&(t.textContent=`Uložit změny *`)):(n.className=`bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-[1.02]`,t&&(t.textContent=`Uložit změny`))}}function D(){document.getElementById(`modularSectionsContainer`)&&r.appSections.forEach(e=>{let t=document.getElementById(e.id);if(!t)return;t.classList.contains(`relative`)||t.classList.add(`relative`);let n=t.querySelector(`.page-section-control-bar`);n||(n=document.createElement(`div`),n.className=`page-section-control-bar`,t.prepend(n)),n.innerHTML=`
      <div 
        class="section-drag-btn" 
        draggable="true" 
        ondragstart="handlePageSectionDragStart(event, '${e.id}')"
        ondragend="handlePageSectionDragEnd(event)"
        title="Uchopit a přetáhnout celý tento modul na jiné místo na stránce"
      >
        <span>⠿</span> Přesunout modul: ${e.title}
      </div>
      <div class="flex items-center gap-1">
        <button 
          type="button" 
          onclick="moveSectionDirect('${e.id}', -1)" 
          class="p-1 px-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-bold" 
          title="Posunout nahoru">
          ▲
        </button>
        <button 
          type="button" 
          onclick="moveSectionDirect('${e.id}', 1)" 
          class="p-1 px-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-bold" 
          title="Posunout dolů">
          ▼
        </button>
        <button 
          type="button" 
          onclick="toggleSectionVisibilityDirect('${e.id}')" 
          class="p-1 px-2 rounded hover:bg-slate-800 ${e.visible===!1?`text-amber-300 bg-amber-950/60`:`text-slate-300 hover:text-white`} transition-colors text-xs font-bold" 
          title="Skrýt / Zobrazit sekci na webu">
          ${e.visible===!1?`🙈 Skrytý`:`👁️ Zobrazen`}
        </button>
      </div>
    `,t.ondragover=t=>handlePageSectionDragOver(t,e.id),t.ondragenter=t=>handlePageSectionDragEnter(t,e.id),t.ondragleave=t=>handlePageSectionDragLeave(t,e.id),t.ondrop=t=>handlePageSectionDrop(t,e.id),e.visible===!1?t.classList.add(`section-hidden-admin`):t.classList.remove(`section-hidden-admin`)})}window.handlePageSectionDragStart=function(e,t){C=t,e.dataTransfer.effectAllowed=`move`,e.dataTransfer.setData(`text/plain`,t);let n=document.getElementById(t);n&&n.classList.add(`section-drag-active`)},window.handlePageSectionDragOver=function(e,t){e.preventDefault(),e.dataTransfer.dropEffect=`move`},window.handlePageSectionDragEnter=function(e,t){if(!C||C===t)return;let n=document.getElementById(t);n&&n.classList.add(`section-drop-target`)},window.handlePageSectionDragLeave=function(e,t){let n=document.getElementById(t);n&&n.classList.remove(`section-drop-target`)},window.handlePageSectionDrop=function(e,t){e.preventDefault();let n=document.getElementById(t);if(n&&n.classList.remove(`section-drop-target`),!C||C===t)return;let i=[...r.appSections].sort((e,t)=>e.order-t.order),a=i.findIndex(e=>e.id===C),o=i.findIndex(e=>e.id===t);if(a<0||o<0)return;let[s]=i.splice(a,1);i.splice(o,0,s),i.forEach((e,t)=>{e.order=t+1}),r.appSections=i,l(r.appSections),D(),E(!0),M(`🔄 Modul byl přesunut.`)},window.handlePageSectionDragEnd=function(e){C=null,document.querySelectorAll(`section`).forEach(e=>{e.classList.remove(`section-drag-active`,`section-drop-target`)})},window.moveSectionDirect=function(e,t){let n=[...r.appSections].sort((e,t)=>e.order-t.order),i=n.findIndex(t=>t.id===e);if(i<0)return;let a=i+t;if(a<0||a>=n.length)return;let o=n[i].order;n[i].order=n[a].order,n[a].order=o,r.appSections=n,l(r.appSections),D(),E(!0)},window.toggleSectionVisibilityDirect=function(e){let t=r.appSections.find(t=>t.id===e);t&&(t.visible=t.visible===!1,l(r.appSections),D(),E(!0),M(t.visible?`👁️ Modul ${t.title} bude zobrazen.`:`🙈 Modul ${t.title} byl skryt.`))},window.openImageEditModal=function(e,t){w={type:`element`,id:e};let n=document.getElementById(e),r=n?n.src:``,i=document.getElementById(`imageEditModal`),a=document.getElementById(`imageEditUrlInput`),o=document.getElementById(`imageEditPreview`);a&&(a.value=r),o&&(o.src=r),i&&i.classList.remove(`hidden`)},window.openImageEditModalForCandidate=function(e){w={type:`candidate`,number:e};let t=r.appCandidates.find(t=>t.number===e)?.photo_url||``,n=document.getElementById(`imageEditModal`),i=document.getElementById(`imageEditUrlInput`),a=document.getElementById(`imageEditPreview`);i&&(i.value=t),a&&(a.src=t),n&&n.classList.remove(`hidden`)},window.openImageEditModalForLeaflet=function(e){w={type:`leaflet`,page:e};let t=BSM_DATA.leafletPages.find(t=>t.page===e)?.src||``,n=document.getElementById(`imageEditModal`),r=document.getElementById(`imageEditUrlInput`),i=document.getElementById(`imageEditPreview`);r&&(r.value=t),i&&(i.src=t),n&&n.classList.remove(`hidden`)},window.closeImageEditModal=function(){let e=document.getElementById(`imageEditModal`);e&&e.classList.add(`hidden`),w=null},window.previewImageEditUrl=function(e){let t=document.getElementById(`imageEditPreview`);t&&(t.src=e.trim())},window.applyImageEditChanges=function(){let e=document.getElementById(`imageEditUrlInput`),t=e?e.value.trim():``;if(w){if(w.type===`element`){let e=document.getElementById(w.id);e&&(e.src=t)}else if(w.type===`candidate`){let e=r.appCandidates.find(e=>e.number===w.number);e&&(e.photo_url=t,f(r.currentCandidateFilter))}else if(w.type===`leaflet`){let e=BSM_DATA.leafletPages.find(e=>e.page===w.page);e&&(e.src=t,N())}closeImageEditModal(),E(!0),M(`📷 Obrázek byl změněn! Nezapomeňte kliknout na Uložit změny.`)}},window.saveInPageChanges=async function(){let e=document.getElementById(`inPageSaveBtn`);e&&(e.disabled=!0,e.innerHTML=`<span>⏳</span> Ukládám do Supabase...`),r.appSiteContent||(r.appSiteContent=n());let t=(e,t=``)=>{let n=document.getElementById(e);return n?n.innerText.trim():t},i=(e,t=``)=>{let n=document.getElementById(e);return n?n.src:t};r.appSiteContent.hero={...r.appSiteContent.hero,bannerImg:i(`heroBudovaImg`,r.appSiteContent.hero.bannerImg),bannerBadge:t(`heroBannerBadge`,r.appSiteContent.hero.bannerBadge),bannerHeading:t(`heroBannerHeading`,r.appSiteContent.hero.bannerHeading),badge:t(`heroBadge`,r.appSiteContent.hero.badge),slogan:t(`heroSlogan`,r.appSiteContent.hero.slogan),h1:t(`heroH1`,r.appSiteContent.hero.h1),introText:t(`heroIntroText`,r.appSiteContent.hero.introText),fridayHours:t(`heroFridayHours`,r.appSiteContent.hero.fridayHours),saturdayHours:t(`heroSaturdayHours`,r.appSiteContent.hero.saturdayHours),logoImg:i(`heroLogoImg`,r.appSiteContent.hero.logoImg)},r.appSiteContent.onas={...r.appSiteContent.onas,badge:t(`onasBadge`,r.appSiteContent.onas.badge),title:t(`onasTitle`,r.appSiteContent.onas.title),introText:t(`onasIntroText`,r.appSiteContent.onas.introText),quoteText:t(`onasQuoteText`,r.appSiteContent.onas.quoteText),quoteAuthor:t(`onasQuoteAuthor`,r.appSiteContent.onas.quoteAuthor),card1:{...r.appSiteContent.onas.card1,title:t(`onasCard1Title`,r.appSiteContent.onas.card1?.title),desc:t(`onasCard1Desc`,r.appSiteContent.onas.card1?.desc)},card2:{...r.appSiteContent.onas.card2,title:t(`onasCard2Title`,r.appSiteContent.onas.card2?.title),desc:t(`onasCard2Desc`,r.appSiteContent.onas.card2?.desc)},card3:{...r.appSiteContent.onas.card3,title:t(`onasCard3Title`,r.appSiteContent.onas.card3?.title),desc:t(`onasCard3Desc`,r.appSiteContent.onas.card3?.desc)}},r.appSiteContent.program={...r.appSiteContent.program,badge:t(`programBadge`,r.appSiteContent.program.badge),title:t(`programTitle`,r.appSiteContent.program.title),subtitle:t(`programSubtitle`,r.appSiteContent.program.subtitle),ctaTitle:t(`programCtaTitle`,r.appSiteContent.program.ctaTitle),ctaDesc:t(`programCtaDesc`,r.appSiteContent.program.ctaDesc),ctaBtn:t(`programCtaBtn`,r.appSiteContent.program.ctaBtn),pillars:BSM_DATA.pillars},r.appSiteContent.nav={onas:t(`navOnas`,`O nás`),program:t(`navProgram`,`Volební program`),kandidati:t(`navKandidati`,`Kandidáti`),kdeVolit:t(`navKdeVolit`,`Kde volit?`),jakVolit:t(`navJakVolit`,`Jak volit?`),letacek:t(`navLetacek`,`Letáček`),cta:t(`navCta`,`Jak podpořit č. 6`)},document.querySelectorAll(`[data-ward-id]`).forEach(e=>{let t=parseInt(e.getAttribute(`data-ward-id`),10),n=e.getAttribute(`data-ward-field`),r=BSM_DATA.wards.find(e=>e.id===t);r&&n&&(r[n]=e.innerText.trim())});let a=document.querySelector(`[data-editable="ward_friday_hours"]`),o=document.querySelector(`[data-editable="ward_saturday_hours"]`),s=document.querySelector(`[data-editable="ward_id_note"]`),c=document.querySelector(`[data-editable="ward_maps_btn"]`);r.appSiteContent.kdeVolit={...r.appSiteContent.kdeVolit,badge:t(`kdeVolitBadge`,r.appSiteContent.kdeVolit?.badge),title:t(`kdeVolitTitle`,r.appSiteContent.kdeVolit?.title),desc:t(`kdeVolitDesc`,r.appSiteContent.kdeVolit?.desc),fridayHours:a?a.innerText.trim():r.appSiteContent.kdeVolit?.fridayHours||`Pátek 9. října: 14:00 – 22:00`,saturdayHours:o?o.innerText.trim():r.appSiteContent.kdeVolit?.saturdayHours||`Sobota 10. října: 08:00 – 14:00`,idNote:s?s.innerText.trim():r.appSiteContent.kdeVolit?.idNote||`Nezapomeňte si vzít s sebou platný občanský průkaz!`,mapsBtn:c?c.innerText.trim():r.appSiteContent.kdeVolit?.mapsBtn||`Otevřít navigaci v Google Mapách`,wards:BSM_DATA.wards};let l=document.querySelector(`[data-editable="ballot_tab_party"]`),u=document.querySelector(`[data-editable="ballot_tab_cross"]`),d=document.querySelector(`[data-editable="ballot_tab_combo"]`),f=document.querySelector(`[data-editable="ballot_party_info_title"]`),p=document.querySelector(`[data-editable="ballot_party_info_desc"]`),m=document.querySelector(`[data-editable="ballot_cross_info_title"]`),h=document.querySelector(`[data-editable="ballot_cross_info_desc"]`),g=document.querySelector(`[data-editable="ballot_combo_info_title"]`),_=document.querySelector(`[data-editable="ballot_combo_info_desc"]`),v=document.querySelector(`[data-editable="ballot_header_sub"]`),y=document.querySelector(`[data-editable="ballot_header_title"]`),b=document.querySelector(`[data-editable="ballot_party_name"]`),x=document.querySelector(`[data-editable="ballot_party_motto"]`);r.appSiteContent.jakVolit={...r.appSiteContent.jakVolit,badge:t(`jakVolitBadge`,r.appSiteContent.jakVolit?.badge),title:t(`jakVolitTitle`,r.appSiteContent.jakVolit?.title),desc:t(`jakVolitDesc`,r.appSiteContent.jakVolit?.desc),tabParty:l?l.innerText.trim():r.appSiteContent.jakVolit?.tabParty||`⭐ 1. Celá kandidátka BSM (Doporučeno)`,tabCross:u?u.innerText.trim():r.appSiteContent.jakVolit?.tabCross||`2. Křížkování kandidátů`,tabCombo:d?d.innerText.trim():r.appSiteContent.jakVolit?.tabCombo||`3. Kombinovaná volba`,partyInfoTitle:f?f.innerText.trim():r.appSiteContent.jakVolit?.partyInfoTitle||`NEJJEDNODUŠŠÍ A NEJÚČINNĚJŠÍ ZPŮSOB (Doporučeno):`,partyInfoDesc:p?p.innerHTML.trim():r.appSiteContent.jakVolit?.partyInfoDesc||``,crossInfoTitle:m?m.innerText.trim():r.appSiteContent.jakVolit?.crossInfoTitle||`VÝBĚR JEDNOTLIVÝCH KANDIDÁTŮ (Panašování):`,crossInfoDesc:h?h.innerHTML.trim():r.appSiteContent.jakVolit?.crossInfoDesc||``,comboInfoTitle:g?g.innerText.trim():r.appSiteContent.jakVolit?.comboInfoTitle||`KOMBINOVANÁ VOLBA:`,comboInfoDesc:_?_.innerHTML.trim():r.appSiteContent.jakVolit?.comboInfoDesc||``,ballotHeaderSub:v?v.innerText.trim():r.appSiteContent.jakVolit?.ballotHeaderSub||`Ukázka části volebního lístku`,ballotHeaderTitle:y?y.innerText.trim():r.appSiteContent.jakVolit?.ballotHeaderTitle||`Obec Horní Stropnice – Volby do zastupitelstva obce`,ballotPartyName:b?b.innerText.trim():r.appSiteContent.jakVolit?.ballotPartyName||`6. BSM`,ballotPartyMotto:x?x.innerText.trim():r.appSiteContent.jakVolit?.ballotPartyMotto||`Bezpečnost • Stabilita • Mládež`},BSM_DATA.leafletPages.forEach(e=>{let t=document.querySelector(`[data-editable="leaflet_page_${e.page}_title"]`),n=document.querySelector(`[data-editable="leaflet_page_${e.page}_desc"]`);t&&(e.title=t.innerText.trim()),n&&(e.desc=n.innerText.trim())}),r.appSiteContent.letacek={...r.appSiteContent.letacek,badge:t(`letacekBadge`,r.appSiteContent.letacek?.badge),title:t(`letacekTitle`,r.appSiteContent.letacek?.title),desc:t(`letacekDesc`,r.appSiteContent.letacek?.desc),pages:BSM_DATA.leafletPages},r.appSiteContent.podnety={...r.appSiteContent.podnety,badge:t(`podnetyBadge`,r.appSiteContent.podnety.badge),title:t(`podnetyTitle`,r.appSiteContent.podnety.title),desc:t(`podnetyDesc`,r.appSiteContent.podnety.desc)};let S=document.getElementById(`shareWhatsappBtn`),C=document.getElementById(`shareFacebookBtn`);if(document.getElementById(`shareCopyBtn`),r.appSiteContent.footer={...r.appSiteContent.footer,title:t(`footerTitle`,r.appSiteContent.footer.title),tagline:t(`footerTagline`,r.appSiteContent.footer.tagline),description:t(`footerDescription`,r.appSiteContent.footer.description),share:{heading:t(`shareHeading`,`Sdílejte mezi sousedy`),desc:t(`shareDesc`,`Pomozte nám šířit náš program v Horní Stropnici a na všech osadách:`),whatsapp:t(`shareWhatsappBtn`,`WhatsApp`),whatsappUrl:S?S.getAttribute(`href`):r.appSiteContent.footer?.share?.whatsappUrl||``,whatsappMsg:r.appSiteContent.footer?.share?.whatsappMsg||``,facebook:t(`shareFacebookBtn`,`Facebook`),facebookUrl:C?C.getAttribute(`href`):r.appSiteContent.footer?.share?.facebookUrl||``,copy:t(`shareCopyBtn`,`📋 Kopírovat odkaz`)}},document.querySelectorAll(`[data-candidate]`).forEach(e=>{let t=parseInt(e.getAttribute(`data-candidate`),10),n=e.getAttribute(`data-editable`),i=r.appCandidates.find(e=>e.number===t);i&&(n===`candidate-name`&&(i.name=e.innerText.trim()),n===`candidate-profession`&&(i.profession=e.innerText.trim()),n===`candidate-age`&&(i.age=parseInt(e.innerText.trim(),10)||null),n===`candidate-settlement`&&(i.settlement=e.innerText.trim()),n===`candidate-quote`&&(i.quote=e.innerText.replace(/^„|“$/g,``).trim()))}),r.appCandidates.forEach(e=>{let t=document.querySelectorAll(`[data-editable="candidate-tag"][data-candidate="${e.number}"]`);(t.length>0||document.querySelector(`[data-candidate="${e.number}"]`))&&(e.tags=Array.from(t).map(e=>e.innerText.trim()).filter(Boolean))}),localStorage.setItem(`bsm_site_content`,JSON.stringify(r.appSiteContent)),localStorage.setItem(`bsm_sections_order`,JSON.stringify(r.appSections)),localStorage.setItem(`bsm_candidates`,JSON.stringify(r.appCandidates)),r.supabaseClient)try{await r.supabaseClient.from(`site_sections`).upsert({id:`bsm_site_content`,title:JSON.stringify(r.appSiteContent),order_index:999,is_visible:!1});let e=r.appSections.map(e=>({id:e.id,title:e.title,order_index:e.order,is_visible:e.visible!==!1}));await r.supabaseClient.from(`site_sections`).upsert(e);let t=r.appCandidates.map(e=>({number:e.number,name:e.name,age:e.age,profession:e.profession,settlement:e.settlement,tags:{list:Array.isArray(e.tags)?e.tags:e.tags?.list||[],photo_url:e.photo_url||null},quote:e.quote,highlight:!!e.highlight}));await r.supabaseClient.from(`candidates`).upsert(t)}catch(e){console.warn(`Chyba při ukládání do Supabase:`,e)}E(!1),e&&(e.disabled=!1,e.className=`bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-[1.02]`,e.innerHTML=`<span>💾</span> <span>Uložit změny</span> <span id="unsavedDot" class="hidden w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>`),M(`✅ Veškeré změny byly úspěšně uloženy do Supabase a jsou ihned viditelné!`)},window.resetInPageContentToDefaults=function(){confirm(`Opravdu si přejete obnovit všechny texty, fotky i uspořádání modulů do původního stavu?`)&&(localStorage.removeItem(`bsm_site_content`),localStorage.removeItem(`bsm_sections_order`),localStorage.removeItem(`bsm_candidates`),r.appSiteContent=n(),r.appSections=JSON.parse(JSON.stringify(BSM_DATA.defaultSections)),r.appCandidates=JSON.parse(JSON.stringify(BSM_DATA.candidates)),s(r.appSiteContent),l(r.appSections),f(r.currentCandidateFilter),D(),saveInPageChanges(),M(`🔄 Obsah byl obnoven do výchozího stavu.`))},window.openFeedbackDrawer=function(){let e=document.getElementById(`inPageFeedbackDrawer`),t=document.getElementById(`inPageFeedbackBackdrop`);e&&e.classList.add(`drawer-open`),t&&t.classList.remove(`hidden`),k()},window.closeFeedbackDrawer=function(){let e=document.getElementById(`inPageFeedbackDrawer`),t=document.getElementById(`inPageFeedbackBackdrop`);e&&e.classList.remove(`drawer-open`),t&&t.classList.add(`hidden`)};function O(){let e=document.getElementById(`inPageFeedbackBadge`);e&&(e.textContent=r.appFeedbacks.filter(e=>e.status===`new`).length)}async function k(){let e=[];if(r.supabaseClient)try{let{data:t,error:n}=await r.supabaseClient.from(`feedbacks`).select(`*`).order(`created_at`,{ascending:!1});!n&&t&&(e=t)}catch(e){console.warn(`Chyba čtení podnětů ze Supabase:`,e)}JSON.parse(localStorage.getItem(`bsm_feedbacks`)||`[]`).forEach(t=>{e.some(e=>e.id===t.id)||e.push(t)}),r.appFeedbacks=e,O(),A(),j()}function A(){let e=document.getElementById(`inPageFilterSettlement`);if(!e)return;let t=[...new Set(r.appFeedbacks.map(e=>e.settlement))].sort();e.innerHTML=`<option value="all">Všechny osady (${r.appFeedbacks.length})</option>`+t.map(e=>`<option value="${e}">${e}</option>`).join(``)}window.filterAdminFeedbacks=function(){j()};function j(){let e=document.getElementById(`inPageFeedbacksList`),t=document.getElementById(`inPageFilterSettlement`)?.value||`all`;if(!e)return;let n=t===`all`?r.appFeedbacks:r.appFeedbacks.filter(e=>e.settlement===t);if(n.length===0){e.innerHTML=`
      <div class="text-center py-12 text-slate-500 bg-slate-900/60 rounded-2xl border border-slate-800">
        <div class="text-3xl mb-2">📭</div>
        <p class="font-bold text-slate-300">Zatím nebyly doručeny žádné podněty.</p>
        <p class="text-xs text-slate-500 mt-1">Zprávy od občanů se zobrazí zde.</p>
      </div>
    `;return}e.innerHTML=n.map(e=>{let t=e.status===`new`,n=new Date(e.created_at).toLocaleString(`cs-CZ`,{day:`2-digit`,month:`2-digit`,year:`numeric`,hour:`2-digit`,minute:`2-digit`});return`
      <div class="bg-slate-900 border ${t?`border-sky-500/60 bg-sky-950/20`:`border-slate-800`} p-4 rounded-2xl space-y-2.5">
        <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black px-2 py-0.5 rounded-full ${t?`bg-sky-500 text-slate-950`:`bg-slate-800 text-slate-400`}">
              ${t?`NOVÉ`:`VYŘÍZENO`}
            </span>
            <span class="font-bold text-white text-xs">📍 ${escapeHtml(e.settlement)}</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">🕒 ${n}</span>
        </div>

        <p class="text-xs text-slate-200 leading-relaxed">
          ${escapeHtml(e.message)}
        </p>

        <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
          <div class="text-slate-400 truncate">
            <span class="font-semibold text-slate-300">Kontakt:</span> ${escapeHtml(e.contact)||`neuveden`}
          </div>

          <div class="flex items-center gap-1.5 flex-shrink-0">
            <button 
              onclick="toggleFeedbackStatus('${e.id}')" 
              class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${t?`bg-emerald-600 hover:bg-emerald-500 text-white`:`bg-slate-800 hover:bg-slate-700 text-slate-300`}">
              ${t?`Vyřízeno`:`Nové`}
            </button>
            <button 
              onclick="deleteFeedback('${e.id}')" 
              class="p-1 px-2 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-200 transition-colors">
              Smazat
            </button>
          </div>
        </div>
      </div>
    `}).join(``)}window.toggleFeedbackStatus=async function(e){let t=r.appFeedbacks.find(t=>t.id===e);if(!t)return;let n=t.status===`new`?`resolved`:`new`;if(t.status=n,r.supabaseClient)try{await r.supabaseClient.from(`feedbacks`).update({status:n}).eq(`id`,e)}catch(e){console.error(`Chyba aktualizace stavu feedbacku:`,e)}localStorage.setItem(`bsm_feedbacks`,JSON.stringify(r.appFeedbacks)),j(),O()},window.deleteFeedback=async function(e){if(confirm(`Opravdu chcete tento podnět smazat?`)){if(r.appFeedbacks=r.appFeedbacks.filter(t=>t.id!==e),r.supabaseClient)try{await r.supabaseClient.from(`feedbacks`).delete().eq(`id`,e)}catch(e){console.error(`Chyba mazání feedbacku ze Supabase:`,e)}localStorage.setItem(`bsm_feedbacks`,JSON.stringify(r.appFeedbacks)),j(),O()}},window.exportFeedbacksToCSV=function(){if(r.appFeedbacks.length===0){alert(`Zatím nejsou k dispozici žádné podněty k exportu.`);return}let e=[`Datum`,`Osada`,`Podnět / Zpráva`,`Kontakt`,`Stav`],t=r.appFeedbacks.map(e=>[`"${new Date(e.created_at).toLocaleString(`cs-CZ`)}"`,`"${e.settlement}"`,`"${e.message.replace(/"/g,`""`)}"`,`"${e.contact||``}"`,`"${e.status}"`]),n=`﻿`+[e.join(`;`),...t.map(e=>e.join(`;`))].join(`
`),i=new Blob([n],{type:`text/csv;charset=utf-8;`}),a=URL.createObjectURL(i),o=document.createElement(`a`);o.href=a,o.download=`podnety-bsm-horni-stropnice-${new Date().toISOString().slice(0,10)}.csv`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(a)};function M(e){let t=document.getElementById(`inPageToast`);t||(t=document.createElement(`div`),t.id=`inPageToast`,t.className=`fixed bottom-5 right-5 z-[150] bg-slate-900 border border-sky-500/60 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 transform translate-y-12 opacity-0 flex items-center gap-2`,document.body.appendChild(t)),t.innerHTML=e,t.classList.remove(`translate-y-12`,`opacity-0`),t.classList.add(`translate-y-0`,`opacity-100`),setTimeout(()=>{t.classList.remove(`translate-y-0`,`opacity-100`),t.classList.add(`translate-y-12`,`opacity-0`)},4e3)}function N(){let e=document.getElementById(`leafletGallery`);if(!e)return;let t=r.isInPageEditActive!==void 0&&r.isInPageEditActive,n=BSM_DATA.leafletPages.map((e,t)=>`
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col relative">
      
      <!-- Ovládací lišta fotografie pro správce (posun, smazání) -->
      <div class="photo-card-control-bar">
        <button 
          type="button" 
          onclick="event.stopPropagation(); moveLeafletPhoto(${t}, -1)" 
          class="text-sky-300 hover:text-white px-1.5 py-0.5 rounded text-xs font-bold ${t===0?`opacity-30 cursor-not-allowed`:`cursor-pointer`}" 
          title="Posunout doleva"
          ${t===0?`disabled`:``}>◀</button>
        <button 
          type="button" 
          onclick="event.stopPropagation(); moveLeafletPhoto(${t}, 1)" 
          class="text-sky-300 hover:text-white px-1.5 py-0.5 rounded text-xs font-bold ${t===BSM_DATA.leafletPages.length-1?`opacity-30 cursor-not-allowed`:`cursor-pointer`}" 
          title="Posunout doprava"
          ${t===BSM_DATA.leafletPages.length-1?`disabled`:``}>▶</button>
        <button 
          type="button" 
          onclick="event.stopPropagation(); deleteLeafletPhoto(${e.page})" 
          class="text-red-400 hover:text-red-200 px-1.5 py-0.5 rounded text-xs font-bold cursor-pointer" 
          title="Smazat tuto fotografii / stranu">🗑️</button>
      </div>

      <div class="relative overflow-hidden bg-slate-100 aspect-[3/4] cursor-pointer" onclick="openLeafletModal('${e.src}', '${e.title}')">
        <img 
          id="leaflet-page-img-${e.page}"
          src="${e.src}" 
          alt="${e.title}" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="bg-white/95 text-slate-900 font-bold px-3 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-1.5">
            🔍 Zvětšit foto ${t+1}
          </span>
        </div>
      </div>
      <div class="img-edit-container">
        <button 
          onclick="event.stopPropagation(); openImageEditModalForLeaflet(${e.page})" 
          class="img-edit-btn"
          title="Změnit obrázek / fotografii">
          📷 Změnit fotografii
        </button>
      </div>
      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span class="text-[10px] font-extrabold text-bsm-800 uppercase tracking-wider">Foto / Strana ${t+1}</span>
          <h4 class="font-bold text-slate-900 text-sm mt-0.5" data-editable="leaflet_page_${e.page}_title">${escapeHtml(e.title)}</h4>
          <p class="text-xs text-slate-500 mt-1" data-editable="leaflet_page_${e.page}_desc">${escapeHtml(e.desc)}</p>
        </div>
        <button 
          onclick="openLeafletModal('${e.src}', '${e.title}')" 
          class="mt-3 w-full text-xs font-semibold py-2 px-3 bg-slate-100 hover:bg-sky-100 text-bsm-900 rounded-lg transition-colors text-center">
          Zobrazit v plné velikosti
        </button>
      </div>
    </div>
  `).join(``);t&&(n+=`
      <div onclick="addNewLeafletPhoto()" class="leaflet-add-card group" title="Klikněte pro přidání další fotografie / strany do galerie">
        <div class="w-14 h-14 rounded-full bg-sky-600 group-hover:bg-sky-500 text-white flex items-center justify-center text-2xl font-black shadow-md mb-2 transition-transform group-hover:scale-110">
          ➕
        </div>
        <div class="font-extrabold text-slate-900 text-sm">Přidat fotografii / stranu</div>
        <div class="text-xs text-slate-500 mt-1">Nahrát další snímek nebo stranu do galerie</div>
      </div>
    `),e.innerHTML=n,t&&T()}window.addNewLeafletPhoto=function(){let e=BSM_DATA.leafletPages,t=e.length>0?Math.max(...e.map(e=>e.page||0))+1:1;e.push({page:t,title:`Fotografie č. ${e.length+1}`,desc:`Zadejte popis této fotografie nebo materiálu...`,src:`assets/leaflet/letacek_1_uvod.jpg`}),N(),E(!0),M(`➕ Nová fotografie přidána (celkem ${e.length}). Můžete změnit obrázek i popis.`)},window.deleteLeafletPhoto=function(e){if(BSM_DATA.leafletPages.length<=1){alert(`V galerii musí zůstat alespoň 1 fotografie.`);return}confirm(`Opravdu chcete tuto fotografii z webu odstranit?`)&&(BSM_DATA.leafletPages=BSM_DATA.leafletPages.filter(t=>t.page!==e),N(),E(!0),M(`🗑️ Fotografie byla odstraněna (zbývá ${BSM_DATA.leafletPages.length}).`))},window.moveLeafletPhoto=function(e,t){let n=BSM_DATA.leafletPages,r=e+t;if(r<0||r>=n.length)return;let i=n[e];n[e]=n[r],n[r]=i,N(),E(!0)},window.openLeafletModal=function(e,t){let n=document.getElementById(`leafletModal`),r=document.getElementById(`leafletModalImg`),i=document.getElementById(`leafletModalTitle`);n&&r&&(r.src=e,i&&(i.textContent=t),n.classList.remove(`hidden`),document.body.classList.add(`overflow-hidden`))},window.closeLeafletModal=function(){let e=document.getElementById(`leafletModal`);e&&(e.classList.add(`hidden`),document.body.classList.remove(`overflow-hidden`))};function P(){let e=document.getElementById(`mobileMenuToggle`),t=document.getElementById(`mobileMenu`);e&&t&&(e.addEventListener(`click`,()=>{t.classList.toggle(`hidden`)}),t.querySelectorAll(`a`).forEach(e=>{e.addEventListener(`click`,()=>{t.classList.add(`hidden`)})}))}var F=null;window.openLinkEditModal=function(e,t={}){let n=document.getElementById(e);if(!n)return;F={elementId:e,options:t};let i=document.getElementById(`linkEditModal`),a=document.getElementById(`linkEditModalTitle`),o=document.getElementById(`linkEditTextInput`),s=document.getElementById(`linkEditUrlInput`),c=document.getElementById(`linkEditCustomMessageField`),l=document.getElementById(`linkEditMessageInput`),u=document.getElementById(`linkEditNewTabInput`),d=document.getElementById(`linkEditUrlField`),f=document.getElementById(`linkEditFacebookUrlField`),p=document.getElementById(`linkEditFacebookUrlInput`);if(i&&o&&s){if(o.value=n.innerText.trim(),s.value=n.getAttribute(`href`)||``,t.type===`whatsapp`)a.innerHTML=`<span>💬</span> Upravit tlačítko a zprávu pro WhatsApp`,c.classList.remove(`hidden`),d.classList.add(`hidden`),f&&f.classList.add(`hidden`),l.value=r.appSiteContent.footer?.share?.whatsappMsg||`Podívejte se na program a kandidáty BSM pro Horní Stropnici (Volební číslo 6): https://bsm-horni-stropnice.vercel.app`;else if(t.type===`facebook`){if(a.innerHTML=`<span>📘</span> Upravit sdílený odkaz pro Facebook`,c.classList.add(`hidden`),d.classList.add(`hidden`),f){f.classList.remove(`hidden`);let e=r.appSiteContent.footer?.share?.facebookShareUrl||`https://bsm-horni-stropnice.vercel.app`;p&&(p.value=e)}}else a.innerHTML=`<span>🔗</span> Upravit odkaz a tlačítko`,c.classList.add(`hidden`),d.classList.remove(`hidden`),f&&f.classList.add(`hidden`);u.checked=n.getAttribute(`target`)===`_blank`,i.classList.remove(`hidden`)}},window.closeLinkEditModal=function(){let e=document.getElementById(`linkEditModal`);e&&e.classList.add(`hidden`),F=null},window.saveLinkEditModal=function(){if(!F)return;let{elementId:e,options:t}=F,n=document.getElementById(e),i=document.getElementById(`linkEditTextInput`),a=document.getElementById(`linkEditUrlInput`),o=document.getElementById(`linkEditMessageInput`),s=document.getElementById(`linkEditFacebookUrlInput`);if(!n||!i||!a)return;let c=i.value.trim(),l=a.value.trim();if(c&&(n.innerText=c),t.type===`whatsapp`){let e=o.value.trim();e&&(l=`https://api.whatsapp.com/send?text=${encodeURIComponent(e)}`,r.appSiteContent.footer.share||(r.appSiteContent.footer.share={}),r.appSiteContent.footer.share.whatsappMsg=e,r.appSiteContent.footer.share.whatsappUrl=l)}else if(t.type===`facebook`){let e=s?s.value.trim():``;e&&(l=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(e)}`,r.appSiteContent.footer.share||(r.appSiteContent.footer.share={}),r.appSiteContent.footer.share.facebookShareUrl=e,r.appSiteContent.footer.share.facebookUrl=l)}l&&n.setAttribute(`href`,l),newTabInput.checked?n.setAttribute(`target`,`_blank`):n.removeAttribute(`target`),E(!0),M(`🔗 Odkaz tlačítka byl úspěšně upraven.`),closeLinkEditModal()},window.copyPageShareLink=function(){navigator.clipboard.writeText(window.location.href),M(`📋 Odkaz na web byl zkopírován do schránky!`)};var I=null;window.openCandidateEditModal=function(e){let t=document.getElementById(`candidateEditModal`),n=document.getElementById(`candidateEditModalTitle`),i=document.getElementById(`candDeleteBtn`),a=document.getElementById(`candEditNumber`),o=document.getElementById(`candEditName`),s=document.getElementById(`candEditAge`),c=document.getElementById(`candEditProfession`),l=document.getElementById(`candEditSettlement`),u=document.getElementById(`candEditQuote`),d=document.getElementById(`candEditTagsInput`),f=document.getElementById(`candEditPhotoUrl`),p=document.getElementById(`candEditHighlight`);if(t&&o){if(e===`new`)I=`new`,n.innerHTML=`<span>➕</span> Přidat nového kandidáta`,i.classList.add(`hidden`),a.value=r.appCandidates.length>0?Math.max(...r.appCandidates.map(e=>e.number||0))+1:1,o.value=``,s.value=``,c.value=``,l.value=`Horní Stropnice`,u.value=``,d.value=``,f.value=``,p.checked=!1,renderCandidateModalTagBadges(``),previewCandidateModalPhoto(``);else{I=e;let t=r.appCandidates.find(t=>t.number===e);if(!t)return;n.innerHTML=`<span>👤</span> Upravit profil: ${escapeHtml(t.name)} (#${t.number})`,i.classList.remove(`hidden`),a.value=t.number,o.value=t.name||``,s.value=t.age||``,c.value=t.profession||``,l.value=t.settlement||``,u.value=t.quote||``,d.value=(Array.isArray(t.tags)?t.tags:[]).join(`, `),renderCandidateModalTagBadges(d.value),f.value=t.photo_url||``,previewCandidateModalPhoto(t.photo_url||``),p.checked=!!t.highlight}t.classList.remove(`hidden`)}},window.closeCandidateEditModal=function(){let e=document.getElementById(`candidateEditModal`);e&&e.classList.add(`hidden`),I=null},window.renderCandidateModalTagBadges=function(e){let t=document.getElementById(`candModalTagsPreview`);if(!t)return;let n=(e||``).split(`,`).map(e=>e.trim()).filter(Boolean);if(n.length===0){t.innerHTML=`<span class="text-[11px] text-slate-500 italic">Zatím žádné štítky. Zadejte např. Hasiči JSDH, Bezpečnost</span>`;return}t.innerHTML=n.map((e,t)=>`
    <span class="inline-flex items-center gap-1.5 text-xs bg-sky-950 text-sky-200 border border-sky-600/40 px-2.5 py-1 rounded-full font-medium">
      <span>${escapeHtml(e)}</span>
      <button 
        type="button" 
        onclick="removeTagFromCandidateModal(${t})" 
        class="text-sky-400 hover:text-red-400 font-black cursor-pointer">×</button>
    </span>
  `).join(``)},window.removeTagFromCandidateModal=function(e){let t=document.getElementById(`candEditTagsInput`);if(!t)return;let n=t.value.split(`,`).map(e=>e.trim()).filter(Boolean);n.splice(e,1),t.value=n.join(`, `),renderCandidateModalTagBadges(t.value)},window.previewCandidateModalPhoto=function(e){let t=document.getElementById(`candModalPhotoPreview`),n=document.getElementById(`candModalPhotoFallback`),r=document.getElementById(`candEditName`);if(t&&n){if(e&&e.trim().length>3)t.src=e.trim(),t.classList.remove(`hidden`),n.classList.add(`hidden`);else{t.src=``,t.classList.add(`hidden`),n.classList.remove(`hidden`);let e=r?r.value.trim():``;n.textContent=e?e.split(` `).map(e=>e[0]).join(``).slice(0,2):`?`}}},window.saveCandidateEditModal=function(){let e=document.getElementById(`candEditNumber`),t=document.getElementById(`candEditName`),n=document.getElementById(`candEditAge`),i=document.getElementById(`candEditProfession`),a=document.getElementById(`candEditSettlement`),o=document.getElementById(`candEditQuote`),s=document.getElementById(`candEditTagsInput`),c=document.getElementById(`candEditPhotoUrl`),l=document.getElementById(`candEditHighlight`),u=t.value.trim();if(!u){alert(`Zadejte prosím jméno a příjmení kandidáta.`);return}let d=parseInt(e.value,10)||r.appCandidates.length+1,p=parseInt(n.value,10)||null,m=i.value.trim(),h=a.value.trim()||`Horní Stropnice`,g=o.value.trim(),v=s.value.split(`,`).map(e=>e.trim()).filter(Boolean),y=c.value.trim()||null,b=l.checked;if(I===`new`)r.appCandidates.push({number:d,name:u,age:p,profession:m,settlement:h,quote:g,tags:v,photo_url:y,highlight:b}),M(`➕ Kandidát ${u} byl přidán do seznamu.`);else{let e=r.appCandidates.find(e=>e.number===I);e&&(e.number=d,e.name=u,e.age=p,e.profession=m,e.settlement=h,e.quote=g,e.tags=v,e.photo_url=y,e.highlight=b,M(`✅ Profil kandidáta ${u} byl aktualizován.`))}r.appCandidates.sort((e,t)=>e.number-t.number),f(r.currentCandidateFilter),_(),E(!0),closeCandidateEditModal()},window.deleteCandidateFromModal=function(){I!==`new`&&(deleteCandidateDirect(I),closeCandidateEditModal())},window.deleteCandidateDirect=function(e){let t=r.appCandidates.find(t=>t.number===e);t&&confirm(`Opravdu chcete smazat kandidáta ${t.name} (#${t.number}) z kandidátky?`)&&(r.appCandidates=r.appCandidates.filter(t=>t.number!==e),f(r.currentCandidateFilter),_(),E(!0),M(`🗑️ Kandidát ${t.name} byl odstraněn.`))},window.initSupabaseClient=e,window.updateSupabaseStatusBadge=t,window.getDefaultSiteContent=n,window.loadSiteContent=a,window.deepMergeSiteContent=o,window.applySiteContentToDOM=s,window.loadAndApplySections=c,window.applySectionsToDOM=l,window.renderProgramPillars=u,window.loadAndRenderCandidates=d,window.renderCandidates=f,window.initSettlementFinder=p,window.initBallotSimulator=g,window.renderBallotSimulator=_,window.initFeedbackForm=v,window.handleCitizenFeedbackSubmit=y,window.checkAdminSession=b,window.setupKeyboardShortcuts=x,window.showInPageAdminBar=S,window.refreshEditableElements=T,window.markUnsavedChanges=E,window.injectSectionControlBars=D,window.updateInPageFeedbackBadge=O,window.loadAdminFeedbacks=k,window.populateInPageSettlementFilter=A,window.renderInPageFeedbacksList=j,window.showInPageToast=M,window.initLeafletViewer=N,window.initMobileMenu=P})),_=t((()=>{i()})),v=t((()=>{i(),a(),o(),s(),c(),l(),u(),d(),f(),p(),m(),h(),g(),_()}));n(),v();