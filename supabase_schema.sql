-- ==============================================================================
-- SQL SCHÉMA PRO VOLEBNÍ PREZENTACI BSM – HORNÍ STROPNICE (VOLEBNÍ ČÍSLO 6)
-- Zkopírujte tento skript do Supabase SQL Editoru (https://supabase.com/dashboard)
-- a klikněte na "Run". Všechny tabulky, bezpečnostní pravidla (RLS) i výchozí data
-- se automaticky vytvoří.
-- ==============================================================================

-- 1. TABULKA: Doručené podněty od občanů
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement TEXT NOT NULL,
    message TEXT NOT NULL,
    contact TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved'))
);

-- Povolení Row Level Security (RLS) pro tabulku feedbacks
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Veřejnost (anonymní návštěvníci) smí vkládat nové podněty
CREATE POLICY "Veřejnost může odeslat podnět" 
ON public.feedbacks 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Pouze přihlášený správce (administrátor) může podněty číst, upravovat a mazat
CREATE POLICY "Pouze přihlášený admin smí číst podněty" 
ON public.feedbacks 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Pouze přihlášený admin smí upravovat podněty" 
ON public.feedbacks 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Pouze přihlášený admin smí mazat podněty" 
ON public.feedbacks 
FOR DELETE 
TO authenticated 
USING (true);


-- 2. TABULKA: Modulární sekce webu (pořadí a viditelnost)
CREATE TABLE IF NOT EXISTS public.site_sections (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;

-- Každý smí číst pořadí a viditelnost sekcí
CREATE POLICY "Veřejnost může číst konfiguraci sekcí" 
ON public.site_sections 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Pouze admin smí měnit pořadí nebo skrývat sekce
CREATE POLICY "Admin může upravovat sekce" 
ON public.site_sections 
FOR ALL 
TO authenticated 
USING (true);

-- Výchozí sekce a jejich pořadí
INSERT INTO public.site_sections (id, title, order_index, is_visible)
VALUES 
    ('hero', 'Úvodní představení a číslo 6', 1, true),
    ('o-nas', 'Kdo jsme a naše vize', 2, true),
    ('program', 'Volební program (3 pilíře)', 3, true),
    ('kandidati', 'Naši kandidáti (15 jmen)', 4, true),
    ('kde-volit', 'Kde volit? (Rozcestník osad)', 5, true),
    ('jak-volit', 'Jak správně volit č. 6', 6, true),
    ('letacek', 'Originální tištěný letáček', 7, true),
    ('podnety', 'Formulář podnětů pro občany', 8, true)
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, order_index = EXCLUDED.order_index;


-- 3. TABULKA: Kandidáti
CREATE TABLE IF NOT EXISTS public.candidates (
    number INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    profession TEXT NOT NULL,
    settlement TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    quote TEXT,
    highlight BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Veřejnost může číst kandidáty" 
ON public.candidates 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Admin může spravovat kandidáty" 
ON public.candidates 
FOR ALL 
TO authenticated 
USING (true);

-- Výchozí kandidáti BSM (1 až 15)
INSERT INTO public.candidates (number, name, age, profession, settlement, tags, quote, highlight)
VALUES 
    (1, 'Michal Kusák', 38, 'Člen výjezdové jednotky hasičů / Technik', 'Horní Stropnice', '["Hasiči JSDH", "Krizové řízení", "Bezpečnost"]'::jsonb, 'Naše obec potřebuje lidi, kteří mluví přímo a když je potřeba pomoct, jdou do akce jako první.', true),
    (2, 'Mgr. Jana Příhodová', 41, 'Pedagožka / Vzdělávání a rozvoj', 'Horní Stropnice', '["Školství", "Mládež", "Kultura"]'::jsonb, 'Kvalitní škola a školka jsou důvodem, proč mladé rodiny v obci zůstávají.', false),
    (3, 'Zdeněk Kříž', 45, 'Technický specialista / Správa majetku', 'Horní Stropnice', '["Infrastruktura", "Rozvoj obce", "Spolky"]'::jsonb, 'Praktická řešení mají vždycky přednost před prázdnými sliby.', false),
    (4, 'Bc. Lucie Mikešová', 34, 'Ekonomka / Veřejná správa', 'Horní Stropnice', '["Finance", "Transparentnost", "Dotace"]'::jsonb, 'Vyrovnaný rozpočet a jasný přehled o každé investici jsou základem důvěry.', false),
    (5, 'Jan Košíček', 47, 'Živnostník / Řemeslník', 'Bedřichov', '["Místní osady", "Podnikání", "Služby"]'::jsonb, 'Chci, aby se na potřeby osad nezapomínalo a každá část obce byla slyšet.', false),
    (6, 'Michal Papoušek', 39, 'Řidič záchranných složek / Hasič', 'Horní Stropnice', '["Hasiči JSDH", "Doprava", "Bezpečnost"]'::jsonb, 'Bezpečné silnice a fungující záchranné složky zachraňují životy.', false),
    (7, 'Tereza Miklová', 29, 'Vychovatelka / Práce s dětmi', 'Horní Stropnice', '["Děti a mládež", "Volný čas", "Kroužky"]'::jsonb, 'Děti si zaslouží bezpečné a podnětné prostředí pro své kroužky a hry.', false),
    (8, 'Mgr. Markéta Szitka', 43, 'Učitelka / Komunitní lektorka', 'Dobrá Voda', '["Vzdělávání", "Kultura", "Tradice"]'::jsonb, 'Novohradsko má bohatou historii a tradice, které musíme předávat dál.', false),
    (9, 'Jan Gloznek', 52, 'Stavební technik / Projektant', 'Horní Stropnice', '["Stavební investice", "Obecní byty", "Chodníky"]'::jsonb, 'Zateplování domů a oprava chodníků musí mít jasný harmonogram a kvalitu.', false),
    (10, 'František Horník', 49, 'Zemědělec / Správce půdy', 'Svébohy', '["Krajina", "Životní prostředí", "Místní osady"]'::jsonb, 'Péče o krajinu Novohradských hor a udržitelné hospodaření pro naše děti.', false),
    (11, 'Petr Šafránek', 36, 'Logistik / Servisní technik', 'Horní Stropnice', '["Provoz obce", "Sport", "Hasiči"]'::jsonb, 'Fungující obec je jako dobře seřízený stroj – každá součástka musí sedět.', false),
    (12, 'Stanislava Hladká', 50, 'Zdravotní sestra / Péče o seniory', 'Horní Stropnice', '["Zdravotnictví", "Senioři", "Sociální péče"]'::jsonb, 'Dostupný lékař a důstojná péče o seniory nesmí být v naší obci luxusem.', false),
    (13, 'Alexandra Kotrčová', 33, 'Kulturní referentka / Administrativa', 'Hojná Voda', '["Společenský život", "Turismus", "Kultura"]'::jsonb, 'Živá obec znamená pospolitost sousedů při společných setkáních.', false),
    (14, 'Václav Sladký', 46, 'Mistr provozu / Energetik', 'Rychnov u Nových Hradů', '["Energetika", "Úspory", "Služby"]'::jsonb, 'Snížení energetické náročnosti obecních budov ušetří peníze na kroužky i silnice.', false),
    (15, 'PaedDr. Jaroslav Baláš', 64, 'Dlouholetý pedagog a metodik', 'Horní Stropnice', '["Zkušenosti", "Vzdělávání", "Rozvaha"]'::jsonb, 'Spojení energie mladých a životní rozvahy starších je pro obec nejlepší recept.', false)
ON CONFLICT (number) DO NOTHING;
