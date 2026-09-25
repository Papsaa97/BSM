/**
 * Data pro volební prezentaci BSM – Horní Stropnice
 * Volební číslo: 6
 */

const BSM_DATA = {
  general: {
    partyName: "BSM",
    fullName: "Bezpečnost • Stabilita • Mládež",
    type: "Nezávislé sdružení kandidátů",
    ballotNumber: 6,
    municipality: "Horní Stropnice a její osady",
    region: "Novohradské hory, Jihočeský kraj",
    introHeadline: "Jsme vaši sousedé a chceme zůstat lidmi, které můžete kdykoliv oslovit",
    slogan: "Zachovat dobré, zlepšit potřebné.",
    introText: "Znáte nás z každodenního života v obci. Z práce, školy, školky, místních spolků, dětských kroužků, hasičské jednotky i společných akcí. Jsme lidé různých generací, profesí a zkušeností, které spojuje vztah k místu, kde společně žijeme. Chceme zachovat to, co v naší obci dobře funguje, a s rozvahou pracovat na tom, co je možné zlepšit.",
    mottoQuote: "„Víme, že všechno nelze uskutečnit hned a najednou. S odpovědným přístupem a vytrvalostí však budeme pracovat na tom, aby se život v naší obci a jejích osadách neustále rozvíjel.“",
    electionDates: "Pátek 9. října 14:00 – 22:00 | Sobota 10. října 8:00 – 14:00",
    electionNote: "Komunální volby do zastupitelstva obce (15 mandátů)"
  },

  // 3 hlavní programové pilíře z volebního letáku (v tematických bublinách)
  pillars: [
    {
      id: "bezpecnost",
      title: "BEZPEČNOST",
      subtitle: "Bezpečný domov, bezpečné cesty a ochrana pro každého",
      color: "blue",
      icon: "shield-check",
      badge: "Priorita č. 1",
      description: "Pocit bezpečí je základ spokojeného života. Chceme chránit naše děti při cestách do školy, podpořit ty, kteří v nouzi nasazují vlastní zdraví, a zodpovědně hlídat obecní finance.",
      points: [
        {
          title: "Rozšíření sítě chodníků a bezpečnostních prvků na cestách",
          detail: "Zajištění bezpečného pohybu pro chodce, seniory i děti u frekventovaných silnic, přechodů, zastávek a cest spojujících jednotlivé části obce a osady."
        },
        {
          title: "Materiální podpora výjezdové jednotky hasičů (JSDH)",
          detail: "Naši hasiči jsou páteří záchranného systému obce. Zajistíme moderní ochrannou výstroj, spolehlivou zásahovou techniku a důstojné zázemí pro jejich obětavou práci."
        },
        {
          title: "Vícestupňová autorizace u obecních financí",
          detail: "Zavedení transparentní a bezpečné vícestupňové kontroly každého finančního toku obce. Žádná platba nesmí proběhnout bez důkladné revize a odpovědnosti."
        },
        {
          title: "Kamerový systém na opakovaně poškozovaná místa",
          detail: "Cílené instalace bezpečnostních kamerových bodů u sběrných míst, dětských hřišť a obecního majetku s cílem zamezit vandalismu a černým skládkám."
        }
      ]
    },
    {
      id: "stabilita",
      title: "STABILITA",
      subtitle: "Zachování klíčových služeb a vyrovnané hospodaření obce",
      color: "emerald",
      icon: "building-2",
      badge: "Základ rozvoje",
      description: "Nechceme hazardovat s rozpočtem ani s kvalitou života. Naším cílem je udržet poctivě vybudované služby přímo v obci a dotáhnout rozdělané investice bez zadlužování.",
      points: [
        {
          title: "Udržitelnost služeb pro všechny občany",
          detail: "Aktivní podpora a garance zachování školy, školky, ordinací praktických i dětských lékařů, pošty a sportovního zázemí přímo v obci."
        },
        {
          title: "Pokračování v rozpracovaných investicích",
          detail: "Dokončení a rozvoj zóny ZTV Bedřichov pro novou výstavbu, kontinuální opravy infrastruktury a zateplování bytových domů pro snížení energií."
        },
        {
          title: "Byty v obecním vlastnictví a přijatelné nájmy",
          detail: "Obecní bytový fond musí sloužit místním lidem a mladým rodinám. Pravidelná údržba, transparentní přidělování a férové, dostupné nájemné."
        },
        {
          title: "Finanční a materiální podpora kultury a sportu",
          detail: "Pravidelná dotační a organizační podpora pro místní spolky, hasiče, sportovní kluby a tradiční společenské a sousedské akce ve všech osadách."
        },
        {
          title: "Vyrovnaný transparentní rozpočet",
          detail: "Odpovědné hospodaření bez skrytých schodků. Každá koruna občanů musí být využita efektivně s maximálním využitím krajských i státních dotací."
        },
        {
          title: "Participativní část rozpočtu pro nápady občanů",
          detail: "Vyčlenění konkrétní části obecního rozpočtu, o jejímž využití budou přímo rozhodovat a hlasovat sami občané v jednotlivých osadách na své projekty."
        }
      ]
    },
    {
      id: "mladez",
      title: "MLÁDEŽ",
      subtitle: "Podmínky pro děti a mladé lidi, aby z obce neodcházeli",
      color: "amber",
      icon: "sparkles",
      badge: "Budoucnost obce",
      description: "Děti a mladí lidé jsou tepnou Horní Stropnice. Pokud vytvoříme moderní školu, pestré kroužky a kvalitní sportoviště, obec zůstane živá i pro příští generace.",
      points: [
        {
          title: "Škola a školka – postupná modernizace objektů a vybavení",
          detail: "Moderní interaktivní učebny, rekonstrukce sociálních zařízení, zkvalitnění školní jídelny a příjemné venkovní prostory pro výuku i relaxaci."
        },
        {
          title: "Finanční a materiální podpora dětských kroužků",
          detail: "Zvýšení příspěvků na činnost zájmových, sportovních i hasičských kroužků, aby žádné dítě nebylo vyřazeno z důvodu finanční náročnosti."
        },
        {
          title: "Plán renovací a výstavby moderních sportovišť",
          detail: "Systematická údržba stávajících kurtů, hřišť a tělocvičny a příprava nových venkovních workoutových a herních prvků."
        },
        {
          title: "Více dětských hřišť a prostor pro setkávání teenagerů",
          detail: "Bezpečná hřiště v obci i jednotlivých osadách a vyhrazené, kulturní místo, kde se mohou náctiletí setkávat s vrstevníky bez rušení okolí."
        }
      ]
    }
  ],

  // Seznam 15 kandidátů z oficiální kandidátní listiny (Volební číslo 6)
  candidates: [
    {
      number: 1,
      name: "Michal Kusák",
      age: 38,
      title: "Lídr kandidátky BSM",
      profession: "Člen výjezdové jednotky hasičů / Technik",
      settlement: "Horní Stropnice",
      tags: ["Hasiči JSDH", "Krizové řízení", "Bezpečnost"],
      quote: "Naše obec potřebuje lidi, kteří mluví přímo a když je potřeba pomoct, jdou do akce jako první.",
      highlight: true
    },
    {
      number: 2,
      name: "Mgr. Jana Příhodová",
      age: 41,
      title: "Kandidátka BSM",
      profession: "Pedagožka / Vzdělávání a rozvoj",
      settlement: "Horní Stropnice",
      tags: ["Školství", "Mládež", "Kultura"],
      quote: "Kvalitní škola a školka jsou důvodem, proč mladé rodiny v obci zůstávají."
    },
    {
      number: 3,
      name: "Zdeněk Kříž",
      age: 45,
      title: "Kandidát BSM",
      profession: "Technický specialista / Správa majetku",
      settlement: "Horní Stropnice",
      tags: ["Infrastruktura", "Rozvoj obce", "Spolky"],
      quote: "Praktická řešení mají vždycky přednost před prázdnými sliby."
    },
    {
      number: 4,
      name: "Bc. Lucie Mikešová",
      age: 34,
      title: "Kandidátka BSM",
      profession: "Ekonomka / Veřejná správa",
      settlement: "Horní Stropnice",
      tags: ["Finance", "Transparentnost", "Dotace"],
      quote: "Vyrovnaný rozpočet a jasný přehled o každé investici jsou základem důvěry."
    },
    {
      number: 5,
      name: "Jan Košíček",
      age: 47,
      title: "Kandidát BSM",
      profession: "Živnostník / Řemeslník",
      settlement: "Bedřichov",
      tags: ["Místní osady", "Podnikání", "Služby"],
      quote: "Chci, aby se na potřeby osad nezapomínalo a každá část obce byla slyšet."
    },
    {
      number: 6,
      name: "Michal Papoušek",
      age: 39,
      title: "Kandidát BSM",
      profession: "Řidič záchranných složek / Hasič",
      settlement: "Horní Stropnice",
      tags: ["Hasiči JSDH", "Doprava", "Bezpečnost"],
      quote: "Bezpečné silnice a fungující záchranné složky zachraňují životy."
    },
    {
      number: 7,
      name: "Tereza Miklová",
      age: 29,
      title: "Kandidátka BSM",
      profession: "Vychovatelka / Práce s dětmi",
      settlement: "Horní Stropnice",
      tags: ["Děti a mládež", "Volný čas", "Kroužky"],
      quote: "Děti si zaslouží bezpečné a podnětné prostředí pro své kroužky a hry."
    },
    {
      number: 8,
      name: "Mgr. Markéta Szitka",
      age: 43,
      title: "Kandidátka BSM",
      profession: "Učitelka / Komunitní lektorka",
      settlement: "Dobrá Voda",
      tags: ["Vzdělávání", "Kultura", "Tradice"],
      quote: "Novohradsko má bohatou historii a tradice, které musíme předávat dál."
    },
    {
      number: 9,
      name: "Jan Gloznek",
      age: 52,
      title: "Kandidát BSM",
      profession: "Stavební technik / Projektant",
      settlement: "Horní Stropnice",
      tags: ["Stavební investice", "Obecní byty", "Chodníky"],
      quote: "Zateplování domů a oprava chodníků musí mít jasný harmonogram a kvalitu."
    },
    {
      number: 10,
      name: "František Horník",
      age: 49,
      title: "Kandidát BSM",
      profession: "Zemědělec / Správce půdy",
      settlement: "Svébohy",
      tags: ["Krajina", "Životní prostředí", "Místní osady"],
      quote: "Péče o krajinu Novohradských hor a udržitelné hospodaření pro naše děti."
    },
    {
      number: 11,
      name: "Petr Šafránek",
      age: 36,
      title: "Kandidát BSM",
      profession: "Logistik / Servisní technik",
      settlement: "Horní Stropnice",
      tags: ["Provoz obce", "Sport", "Hasiči"],
      quote: "Fungující obec je jako dobře seřízený stroj – každá součástka musí sedět."
    },
    {
      number: 12,
      name: "Stanislava Hladká",
      age: 50,
      title: "Kandidátka BSM",
      profession: "Zdravotní sestra / Péče o seniory",
      settlement: "Horní Stropnice",
      tags: ["Zdravotnictví", "Senioři", "Sociální péče"],
      quote: "Dostupný lékař a důstojná péče o seniory nesmí být v naší obci luxusem."
    },
    {
      number: 13,
      name: "Alexandra Kotrčová",
      age: 33,
      title: "Kandidátka BSM",
      profession: "Kulturní referentka / Administrativa",
      settlement: "Hojná Voda",
      tags: ["Společenský život", "Turismus", "Kultura"],
      quote: "Živá obec znamená pospolitost sousedů při společných setkáních."
    },
    {
      number: 14,
      name: "Václav Sladký",
      age: 46,
      title: "Kandidát BSM",
      profession: "Mistr provozu / Energetik",
      settlement: "Rychnov u Nových Hradů",
      tags: ["Energetika", "Úspory", "Služby"],
      quote: "Snížení energetické náročnosti obecních budov ušetří peníze na kroužky i silnice."
    },
    {
      number: 15,
      name: "PaedDr. Jaroslav Baláš",
      age: 64,
      title: "Kandidát BSM",
      profession: "Dlouholetý pedagog a metodik",
      settlement: "Horní Stropnice",
      tags: ["Zkušenosti", "Vzdělávání", "Rozvaha"],
      quote: "Spojení energie mladých a životní rozvahy starších je pro obec nejlepší recept."
    }
  ],

  // 3 volební okrsky a jejich spádové osady
  wards: [
    {
      id: 1,
      number: 1,
      title: "Okrsek č. 1 – Místní knihovna",
      location: "Horní Stropnice čp. 68",
      description: "Přízemí budovy místní knihovny v centru Horní Stropnice.",
      hours: "Pátek 14:00 – 22:00 | Sobota 8:00 – 14:00",
      mapQuery: "Místní knihovna Horní Stropnice 68",
      settlements: [
        "Horní Stropnice",
        "Dlouhé Stropnice",
        "Paseky",
        "Šejb",
        "Světví",
        "Vyhlídky",
        "Bedřichov",
        "Humenice",
        "Dobrá Voda",
        "Hojná Voda",
        "Staré Hutě",
        "Chlupatá Ves"
      ]
    },
    {
      id: 2,
      number: 2,
      title: "Okrsek č. 2 – Svébohy",
      location: "Svébohy čp. 14",
      description: "Společenské prostory osady Svébohy.",
      hours: "Pátek 14:00 – 22:00 | Sobota 8:00 – 14:00",
      mapQuery: "Svébohy 14 Horní Stropnice",
      settlements: [
        "Svébohy",
        "Olbramov",
        "Veska",
        "Meziluží",
        "Krčín",
        "Hlinov",
        "Střeziměřice"
      ]
    },
    {
      id: 3,
      number: 3,
      title: "Okrsek č. 3 – Klubovna Rychnov u NH",
      location: "Rychnov u Nových Hradů čp. 24",
      description: "Místní klubovna v Rychnově u Nových Hradů.",
      hours: "Pátek 14:00 – 22:00 | Sobota 8:00 – 14:00",
      mapQuery: "Rychnov u Nových Hradů 24",
      settlements: [
        "Rychnov u Nových Hradů",
        "Konratice"
      ]
    }
  ],

  // Všechny osady v abecedním pořadí pro rychlé vyhledávání
  allSettlements: [
    { name: "Bedřichov", wardId: 1 },
    { name: "Chlupatá Ves", wardId: 1 },
    { name: "Dlouhé Stropnice", wardId: 1 },
    { name: "Dobrá Voda", wardId: 1 },
    { name: "Hlinov", wardId: 2 },
    { name: "Hojná Voda", wardId: 1 },
    { name: "Horní Stropnice", wardId: 1 },
    { name: "Humenice", wardId: 1 },
    { name: "Konratice", wardId: 3 },
    { name: "Krčín", wardId: 2 },
    { name: "Meziluží", wardId: 2 },
    { name: "Olbramov", wardId: 2 },
    { name: "Paseky", wardId: 1 },
    { name: "Rychnov u Nových Hradů", wardId: 3 },
    { name: "Staré Hutě", wardId: 1 },
    { name: "Střeziměřice", wardId: 2 },
    { name: "Svébohy", wardId: 2 },
    { name: "Světví", wardId: 1 },
    { name: "Šejb", wardId: 1 },
    { name: "Veska", wardId: 2 },
    { name: "Vyhlídky", wardId: 1 }
  ],

  // Originální naskenované stránky volebního letáku pro náhled
  leafletPages: [
    {
      page: 1,
      title: "Titulní strana & Představení",
      desc: "Úvodní slovo občanům, logo BSM a volební číslo 6",
      src: "assets/leaflet/letacek_1_uvod.jpg"
    },
    {
      page: 2,
      title: "Volební program BSM",
      desc: "3 hlavní pilíře: Bezpečnost, Stabilita a Mládež",
      src: "assets/leaflet/letacek_2_program.jpg"
    },
    {
      page: 3,
      title: "Naši kandidáti",
      desc: "Kompletní 15členná kandidátní listina občanů",
      src: "assets/leaflet/letacek_3_kandidati.jpg"
    },
    {
      page: 4,
      title: "Volební místnosti a jak volit",
      desc: "Rozdělení osad do okrsků a návod na hlasování",
      src: "assets/leaflet/letacek_4_volby.jpg"
    }
  ],

  // Modulární sekce webu - správce může měnit pořadí nebo skrýt
  defaultSections: [
    { id: "hero", title: "Úvodní představení a číslo 6", order: 1, visible: true },
    { id: "o-nas", title: "Kdo jsme a naše vize", order: 2, visible: true },
    { id: "program", title: "Volební program (3 pilíře)", order: 3, visible: true },
    { id: "kandidati", title: "Naši kandidáti (15 jmen)", order: 4, visible: true },
    { id: "kde-volit", title: "Kde volit? (Rozcestník osad)", order: 5, visible: true },
    { id: "jak-volit", title: "Jak správně volit č. 6", order: 6, visible: true },
    { id: "letacek", title: "Originální tištěný letáček", order: 7, visible: true },
    { id: "podnety", title: "Formulář podnětů pro občany", order: 8, visible: true }
  ],

  // Konfigurace připojení k Supabase
  supabase: {
    url: "https://bwydmkobkvzscswmphou.supabase.co",      // např. "https://abcdefgh.supabase.co"
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eWRta29ia3Z6c2Nzd21waG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyODA0NjIsImV4cCI6MjEwNTg1NjQ2Mn0.Il5FKtp5SdlNqo9AIqSXgabzWSxiDrG9lUUvzBwhx94"   // např. "eyJhbGciOi..."
  }
};

