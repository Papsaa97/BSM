# BSM – Horní Stropnice (Volební číslo 6)
### Webová prezentace pro komunální volby

Moderní, rychlá a responzivní webová prezentace nezávislého sdružení kandidátů **BSM (Bezpečnost • Stabilita • Mládež)** pro volby do zastupitelstva obce Horní Stropnice a jejích osad.

---

## 🚀 Jak web otevřít a spustit

### 1. Okamžité otevření v prohlížeči (bez instalace)
Stačí dvakrát kliknout na soubor `index.html` v této složce a web se okamžitě otevře v libovolném webovém prohlížeči (Chrome, Edge, Firefox, Safari apod.).

### 2. Spuštění lokálního serveru (volitelné)
Pokud chcete web otestovat přes lokální webový server:
```bash
# Přes Python:
python -m http.server 3000

# Nebo přes Node.js (npx serve):
npx serve .
```
A v prohlížeči otevřete adresu `http://localhost:3000`.

---

## 📁 Struktura projektu

- `index.html` – Hlavní kostra webu (strukturované sekce, hlavička, patička, modály).
- `assets/`
  - `css/style.css` – Vlastní CSS styly, animace pulzujícího odznaku čísla 6 a typografie.
  - `js/data.js` – **Hlavní datový soubor.** Zde můžete snadno upravovat texty programu, medailonky kandidátů (jména, profese, věk, citáty) i seznam osad.
  - `js/app.js` – Interaktivní prvky (rozcestník osad pro volební místnosti, simulátor křížkování, prohlížeč letáku, formulář).
  - `img/logo_bsm.svg` – Ostré vektorové logo BSM s motivem Novohradských hor a volebním číslem 6.
  - `img/` – Oříznuté grafické prvky (budova nové hasičárny, krajina).
  - `leaflet/` – Naskenované strany původního volebního letáčku ve vysokém rozlišení.

---

## ✏️ Jak upravit texty a kandidáty

Pokud kamarád pošle finální profese kandidátů nebo rozšířený volební program:
1. Otevřete soubor `assets/js/data.js` v libovolném textovém editoru (Poznámkový blok, VS Code apod.).
2. V sekci `candidates` můžete u každého z 15 kandidátů změnit:
   - `profession` (reálné zaměstnání namísto dočasného placeholderu)
   - `settlement` (odkud z osad kandidát pochází)
   - `tags` (oblasti zájmu)
   - `quote` (krátké osobní vyjádření kandidáta)
3. V sekci `pillars` můžete kdykoliv doplnit další konkrétní body do 3 pilířů (**Bezpečnost, Stabilita, Mládež**).

---

## 🌐 Jak web zveřejnit na internetu (Hosting)

Web je čistě statický (HTML, CSS, JS), což znamená nulové provozní náklady a maximální bezpečnost:
- **GitHub Pages:** Stačí nahrát složku do repozitáře a zapnout Pages (zcela zdarma).
- **Vercel / Netlify:** Stačí přetáhnout složku do okna prohlížeče na [netlify.com/drop](https://app.netlify.com/drop) a web máte za 30 vteřin online s vlastní adresou.
- **Běžný český hosting (Wedos, Forpsi apod.):** Stačí nahrát obsah této složky přes FTP do složky `www`.
