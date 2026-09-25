# Návod na zprovoznění Supabase a nasazení na Vercel

Tento průvodce vás krok za krokem provede zprovozněním databáze na **Supabase** a nasazením webu na **Vercel** během 5 minut zcela zdarma.

---

## ČÁST 1: Založení databáze na Supabase (cca 3 minuty)

1. Jděte na [supabase.com](https://supabase.com) a klikněte na **"Start your project"** (přihlásit se můžete přes GitHub nebo e-mail).
2. Klikněte na **"New project"**:
   - **Name:** `bsm-horni-stropnice` (nebo libovolný název)
   - **Database Password:** zvolte si bezpečné heslo
   - **Region:** vyberte `Frankfurt (eu-central-1)` pro nejrychlejší odezvu v ČR
3. Po vytvoření projektu klikněte v levém menu na **"SQL Editor"** (ikona terminálu).
4. Klikněte na **"New query"**, otevřete soubor [`supabase_schema.sql`](./supabase_schema.sql), zkopírujte celý jeho obsah a vložte jej do okna SQL editoru.
5. Klikněte na zelené tlačítko **"Run"**.
   - Během 2 sekund se vytvoří tabulky `feedbacks`, `site_sections`, `candidates` i bezpečnostní pravidla.
6. Založte si účet správce:
   - V levém menu klikněte na **"Authentication"** -> **"Users"** -> **"Add user"** -> **"Create user"**.
   - Zadejte svůj e-mail a heslo, kterým se budete přihlašovat na webu do administrace.
   - Zaškrtněte *"Auto Confirm User?"* (aby nebylo nutné potvrzovat přes e-mail).
7. Získejte své API klíče:
   - V levém menu klikněte na **"Project Settings"** (ozubené kolo) -> **"API"**.
   - Zkopírujte si:
     - **Project URL** (např. `https://xyzcompany.supabase.co`)
     - **Project API keys: `anon` `public`** (dlouhý řetězec)

---

## ČÁST 2: Propojení klíčů na webu

Máte dvě možnosti:
1. **Přímo v administraci webu:**
   - Otevřete web a v patičce klikněte na **"⚙️ Správa webu"** (nebo stiskněte klávesovou zkratku `Ctrl + Shift + A`).
   - Přepněte se na záložku **"Nastavení Supabase"**, vložte *Project URL* a *anon key* a klikněte na **"Uložit a připojit"**.
2. **Nebo přímo v souboru `assets/js/data.js`:**
   - Do objektu `BSM_DATA.supabase` vložte zkopírované hodnoty `url` a `anonKey`.

---

## ČÁST 3: Nasazení na Vercel (cca 2 minuty)

### Možnost A: Přes Vercel CLI (nejrychlejší z počítače)
V příkazovém řádku ve složce projektu stačí spustit:
```bash
cmd /c "npx vercel"
```
Vercel se zeptá na pár otázek (potvrďte Enterem) a během 30 vteřin vám vygeneruje živou URL adresu (např. `https://bsm-horni-stropnice.vercel.app`), kterou můžete rovnou poslat kamarádovi nebo občanům.

### Možnost B: Přes GitHub a Vercel Web
1. Nahrajte složku projektu do repozitáře na [GitHub.com](https://github.com).
2. Přihlaste se na [vercel.com](https://vercel.com).
3. Klikněte na **"Add New..."** -> **"Project"** a vyberte repozitář `bsm-horni-stropnice`.
4. Klikněte na **"Deploy"**.
5. Hotovo! Web se automaticky zaktualizuje při každém novém commitu do repozitáře.

---

## 🔒 Bezpečnost a ochrana dat
- Veřejnost a boti vidí pouze povolená data.
- Do tabulky `feedbacks` může anonymní uživatel pouze **vkládat** svůj podnět.
- Číst doručené zprávy a měnit pořadí sekcí či kandidátů smí **výhradně přihlášený správce**.
