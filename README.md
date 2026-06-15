# 🎮 Minecraft Whitelist Web App — Špičkový registrační portál

Tato složka obsahuje prémiovou, moderní a plně animovanou webovou aplikaci pro automatickou registraci hráčů na Minecraft server přes Discord. Aplikace vyniká špičkovým UX, plynulými přechody, 8bitovými zvuky a gamifikovanými prvky inspirovanými hrou Minecraft.

## 🚀 Hlavní funkce

### 1. Plynulý Flexbox Carousel & Dynamická výška
* **Žádné blikání**: Všechny kroky registrace jsou uspořádány vedle sebe v horizontálním slideru. Pozadí a skleněný rám (`.card-container`) zůstávají statické, zatímco obsah hladce klouže.
* **Resizing na míru**: Výška hlavního boxu se automaticky a hladce přizpůsobuje výšce aktivního kroku, čímž se eliminují prázdná místa a skoky v rozvržení.
* **Autoscroll**: Při přechodu na další krok se stránka automaticky vycentruje na střed obrazovky uživatele.

### 2. Dvoufázová světluška (Flying Guide Firefly)
* **Navádění na IP adresu**: Při úspěšném dokončení registrace vyletí z levého okraje světluška, která se wobbly stylem probojuje k IP adrese serveru, narazí do ní, vytvoří vlnu jiskřiček a ukáže bublinu `Zkopíruj IP! 📡`. IP adresa poté začne lákavě pulzovat.
* **Navádění na návod**: Jakmile uživatel zkopíruje IP adresu, světluška vyrazí podruhé — tentokrát k tlačítku „Jak hrát?“, aby uživatele navedla na survival manuál.

### 3. Epická animace zkopírování IP
* Kliknutí na IP adresu vyvolá intenzivní otřes okna, plnohodnotný konfetový ohňostroj, dvojitý výbuch jisker a zobrazení plovoucího zeleného neonového odznaku `IP Zkopírována! 📋`.
* **Zvýraznění verze**: Verze serveru (`Java 26.1.2`) se zpočátku zobrazuje neutrálně. Teprve po úspěšném zkopírování IP adresy se s mírným zpožděním rozsvítí do pulzujícího smaragdového rámečku doprovázeného dalším XP zvukem, což hráči jasně napoví, s jakou verzí se připojit.

### 4. Gamifikované schvalování pravidel (Spotlight Focus)
* **Plynulé rozostření (Spotlight)**: Nepřečtená pravidla jsou zpočátku mírně ztmavená a rozmazaná (`opacity: 0.35`, `filter: blur(1.2px)`). Pouze aktuálně aktivní pravidlo se plně rozsvítí, doostří, posune dopředu a získá zlatou záři, což přirozeně a čistě zaměří pozornost uživatele (jako Apple/herní rozhraní).
* **Vlající světluška (Wobbly Firefly)**: Vedle aktivního pravidla jemně poletuje a dýchá (animace na pozadí) naváděcí světluška.
* **Zvuková odezva**: Přejíždění myší přes nepřečtená pravidla vydává jemný zvuk rozhraní (ticking). Kliknutí na každé pravidlo změní jeho ikonu na `✅`, přehraje tón z pentatonické stupnice (XP ding), ztlumí ho a přesune doostřený spotlight na další pravidlo.
* **Dokončení výzvy**: Po odklikání všech pravidel se spustí konfety, přehraje se slavnostní zvuk a zobrazí se herní toast: `Výzva splněna! Pravidla přečtena! 📜`.

### 5. Interaktivní Survival Manuál
* Po kliknutí na tlačítko „Dozvědět se více“ se hladce rozbalí panel s návody (jak vytvořit rezidenci, seznam základních příkazů, odkaz na online mapu). Panel podporuje přepínání záložek s efektem vysílání energetických částic.

---

## 🛠️ Použité technologie
* **HTML5**: Sémantická struktura a SVG prvky (např. kruhový ukazatel postupu u pravidel).
* **Vanilla CSS**: Moderní designový jazyk s využitím Glassmorphismu (backdrop-filter), CSS proměnných, animací na míru, 3D perspektivy a flexboxových rozvržení.
* **JavaScript (ES6+)**: Kompletní aplikační logika, ovládání animací, částicové efekty (jiskry, konfety), detekce kolizí a generování 8bitových zvuků v reálném čase přes **Web Audio API** (bez potřeby stahování audio souborů).
* **Mojang API Integration**: Načítání a validace skinu hráče podle zadané přezdívky.

---

## 📂 Soubory v této složce
* [index.html](file:///home/michal/DiscordBot/Discord%20Bot/minecraft%20whitelist/index.html) — Hlavní značení, struktura kroků, formulářů a návodu.
* [style.css](file:///home/michal/DiscordBot/Discord%20Bot/minecraft%20whitelist/style.css) — Designový systém, barevná paleta, skleněné efekty a kompletní animace.
* [script.js](file:///home/michal/DiscordBot/Discord%20Bot/minecraft%20whitelist/script.js) — Klientská logika, přechody, Web Audio dings, částice a světlušky.
