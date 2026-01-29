# Caférico — Compleet Context Document voor Redesign Agent

> Dit document bevat ALLE informatie die je nodig hebt om de front-end van Café RICO te redesignen. Lees dit volledig door voordat je begint.

---

## 1. Bedrijfsinformatie

| Veld | Waarde |
|------|--------|
| **Naam** | Café RICO (officieel met hoofdletter RICO) |
| **Opgericht** | 2018 |
| **Missie** | (H)eerlijke, ecologisch geteelde specialty koffie uit Honduras |
| **Adres** | Beekstraat 138, 9420 Erpe-Mere (Mere), België |
| **Email** | info@caferico.be |
| **Telefoon** | 0474 96 40 90 |
| **Website** | caferico.be |
| **Naam betekenis** | RICO = Spaans voor "heel lekker, heerlijk" |

### Oprichters
Leerden elkaar ~20 jaar geleden kennen in Honduras. Werkten daar met ecologische landbouw en boerenorganisaties. Richtten in 2018 Café RICO op om (h)eerlijke koffie naar België te brengen.

### Coöperatieve & Oorsprong
- **Coöperatieve:** COMBRIFOL — 193 boerenfamilies in Honduras
- **Regio:** Marcala, Honduras (beschermde oorsprongsbenaming)
- **Hoogte:** 1.350–1.850m boven zeespiegel
- **Koffievariëteiten:** Catuaí, Bourbon, Típica, Pache, Paca, Catimores
- **Biolabel:** EU-biolabel + Mayacert

### Kwaliteitsscores
- **84** op SCAA-schaal (Q-grader Tom Janssen, OR Coffee)
- **86** van Marcala-koffieraad

### Smaakprofiel
Fruitig, levendige aciditeit, citrusvruchten, perzik, honing, bloemige afdronk, chocolade.

### Productlijn
Drie sterktes (lokaal gebrand in België):
1. **Mild** — light roast
2. **Intens** — medium roast
3. **Espresso** — dark roast
4. **Decaf** — 100% natuurlijk gedecafeïneerd via CO2-methode (proces in Duitsland)

Beschikbaar als bonen en gemalen, in 250g en 500g.

---

## 2. Design Richting

### Vibe
**Elegant, warm, premium, awe-inspiring** — zoals een high-end koffiebar in Antwerpen.

### NIET
Generic e-commerce, Bootstrap-look, Material UI default, koude tech-vibe.

### Referenties qua feel
- Specialty coffee: bluebottlecoffee.com, trade.coffee, vervecoffee.com
- Premium product: aesop.com, byredo.com
- Belgische warmte: ambachtelijk, persoonlijk, geen corporate

### Huidige kleurenpalet (Tailwind config)
```
espresso: '#3C1518'   — donker bordeaux/bruin
roast:    '#69140E'   — warm donkerrood
cream:    '#F2E8CF'   — warm crème
gold:     '#D4A574'   — warm goud
noir:     '#1A0F0A'   — bijna-zwart bruin
```
Mag uitgebreid of bijgeschaafd worden, maar behoud de warme kern. Donkere achtergronden met warme accenten.

**Kleuren huidige WordPress-site ter referentie:** Zwart (#000000) achtergrond, goud (#af8f48) accenten, wit tekst.

### Typography
- **Headings:** Playfair Display (serif) — mag veranderd naar ander premium serif
- **Body:** Inter (sans-serif) — mag veranderd naar beter passend sans-serif
- Font pairing moet premium, leesbaar en consistent zijn

---

## 3. Technische Stack

| Component | Technologie |
|-----------|-------------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| i18n | next-intl (NL default, EN, FR, ES) |
| Backend | WooCommerce REST API (headless, draait op one.com) |
| Checkout | Mollie (hosted checkout, redirect) |
| Subscriptions | Mollie Recurring API |
| Auth | NextAuth.js |
| Deployment | Vercel |
| Fonts | Playfair Display + Inter (via Google Fonts) |

### Technische Regels
- **Tailwind CSS** voor alle styling (geen inline styles of CSS modules)
- **Animaties** via CSS transitions/transforms of Framer Motion (als geïnstalleerd)
- **Responsive:** mobile-first (375px → 768px → 1024px → 1440px)
- **Performance:** geen zware libraries. Lightweight is premium.
- **Accessibility:** contrast ratios, focus states, alt teksten
- **Alle teksten via next-intl** (NIET hardcoden)
- **Geen bestaande functionaliteit breken** (cart, routing, i18n)
- **Spacing:** 8px grid systeem

### Verificatie na elke wijziging
1. Open in browser en controleer visueel
2. Check mobile view (375px breed)
3. Check dat cart, taalswitch en navigatie werken
4. `npm run typecheck` moet slagen
5. `npm run build` moet slagen

---

## 4. Logo

- **Bestand:** `Logo-zb-wit-zwart-Café-Rico-druppels-rechts.png`
- **URL:** `https://www.caferico.be/wp-content/uploads/2018/04/Logo-zb-wit-zwart-Café-Rico-druppels-rechts.png`
- Wit logo op transparante achtergrond
- Gebruikt in header en als achtergrond watermark op pagina's

---

## 5. Beschikbare Afbeeldingen

### Logo & Branding
| Beschrijving | URL |
|-------------|-----|
| Logo (wit, transparant) | `https://www.caferico.be/wp-content/uploads/2018/04/Logo-zb-wit-zwart-Café-Rico-druppels-rechts.png` |

### Honduras & Oorsprong
| Beschrijving | URL |
|-------------|-----|
| Honduras kaart | `https://www.caferico.be/wp-content/uploads/2018/05/kaart-honduras.png` |
| Marcala landschap | `https://www.caferico.be/wp-content/uploads/2018/05/marcala-landschap.png` |
| Koffieboer foto | `https://www.caferico.be/wp-content/uploads/2018/05/koffieboer-4-Copy-1000×536.jpg` |
| Droogtunnel | `https://www.caferico.be/wp-content/uploads/2018/05/droogtunnel-klein.png` |

### Producten
| Beschrijving | URL |
|-------------|-----|
| Espresso product | `https://www.caferico.be/wp-content/uploads/2024/10/espresso_koffie.png` |
| Decaf product | `https://www.caferico.be/wp-content/uploads/2024/10/decaf_koffie.png` |
| Bonen 500g | `https://www.caferico.be/wp-content/uploads/2024/10/bonen_500.png` |
| Light roast mild | `https://www.caferico.be/wp-content/uploads/2024/10/light_roast_mild.png` |
| Online kopen banner | `https://www.caferico.be/wp-content/uploads/2025/05/online-kopen.png` |

### Sfeerbeelden
| Beschrijving | URL |
|-------------|-----|
| Honduras sfeer 1 | `https://www.caferico.be/wp-content/uploads/2025/05/DSCF3617.jpg` |
| Honduras sfeer 2 | `https://www.caferico.be/wp-content/uploads/2025/05/DSCF0031-scaled.jpg` |
| Honduras sfeer 3 | `https://www.caferico.be/wp-content/uploads/2025/05/20180110_111420-scaled.jpg` |

### Personen
| Beschrijving | URL |
|-------------|-----|
| Q-grader Tom Janssen | `https://www.caferico.be/wp-content/uploads/2018/05/Tom-Janssens.jpg` |

---

## 6. Pagina-structuur & Content

### Pagina's die bestaan
1. **Home** — Hero, featured producten, merkwaarden, subscription CTA
2. **Webshop/Winkel** — Product grid met filters
3. **Product Detail** — Afbeeldingen, beschrijving, varianten, add-to-cart
4. **Smaak** — Smaakprofiel, terroir, verwerkingsproces
5. **Over Café Rico** — Verhaal, missie, COMBRIFOL
6. **Veelgestelde Vragen** — FAQ accordion
7. **Contact** — Formulier + contactgegevens
8. **Verkooppunten** — Fysieke winkels lijst
9. **Blog/Artikelen** — Incl. decaf artikel
10. **Subscriptions** — Abonnement tiers
11. **Privacy- en cookiebeleid**
12. **Mijn account** — Login, profiel, bestellingen
13. **Afrekenen** — Checkout flow
14. **Winkelmand** — Cart overzicht
15. **404** — Foutpagina

---

## 7. Content per Pagina

### Home
- Hero: krachtige visuele introductie, missiestatement
- Featured producten: mild, intens, espresso, decaf
- Merkwaarden: (H)eerlijk, Ecologisch, Specialty, Honduras
- Subscription CTA: maandelijks koffie-abonnement
- Testimonials

### Over Ons
- Bijna 20 jaar geleden leerden oprichters elkaar kennen in Honduras (ecologische landbouw)
- 2018: Café RICO opgericht
- **(H)eerlijk:** Coöperatieve COMBRIFOL, 193 boerenfamilies, eerlijke prijs, vormingen
- **Ecologisch:** EU-biolabel, Mayacert, biologische teelt
- **Honduras:** Marcala-regio, beschermde oorsprongsbenaming, 1350–1850m hoogte
- **Smaak:** Score 84 (Q-grader Tom), score 86 (Marcala-koffieraad)

### Smaak
- Fruitige smaak, levendige aciditeit, citrusvruchten, perzik, honing, bloemige afdronk
- Marcala-regio: bergstreek, optimale PH-waarde, microklimaat
- Variëteiten: Catuaí, Bourbon, Típica, Pache, Paca, Catimores
- Proces: zorgvuldige pluk (alleen rijpe dieprode bessen), wassen, drogen in droogtunnels, branden in België

### FAQ
1. **Wat is specialty coffee?** — Koffie van één bepaalde origine, niet gemengd, score >80 SCAA. Café Rico scoort 84 op SCAA-schaal, afkomstig uit Marcala Honduras.
2. **Light/medium/dark roast verschil?** — Uitgebreide uitleg over roostering, smaak, kleur, toepassing per type.
3. **Is Honduras een koffieland?** — Ja, koffie >3% BBP, 30% landbouwproductie, belangrijkste exportproduct.
4. **Wat is een Q-grader?** — Opgeleide koffieproever die scores geeft op aroma, smaak, body, etc.
5. **Hoe wordt biokoffie gedecafeïneerd?** — CO2-methode, natuurlijk, in Duitsland, geen chemicaliën.
6. **Nog een vraag?** — Mail naar info@caferico.be

### Contact
- "Een vraag, een suggestie? Geef ons een seintje."
- info@caferico.be
- 0474 96 40 90
- Beekstraat 138, 9420 Erpe-Mere

### Verkooppunten
- **Café RICO:** Beekstraat 138, 9420 Mere
- **RICO lab:** Cogelsplein 26, 2100 Antwerpen
- **OHNE winkels:** Gent, Zwalm, Nevele, Ternat, Merelbeke
- **Bakkerij François:** Erpe-Mere
- **Boer Bas:** Brugge
- **Akker en Ambacht:** Gent
- **Proxy Delhaize:** Bambrugge
- **Het Smaakpaletje:** Erpe-Mere
- **Viva Latino Market:** Brussel
- **Hops 'n More:** Leuven
- En meer...

### Decaf Artikel
- 100% natuurlijk gedecafeïneerd via CO2-methode
- Proces in Duitsland
- Verandert niets aan smaak
- Beschikbaar als bonen en gemalen in 250g en 500g

### Privacy & Cookies
- Gegevens nooit aan derden doorgegeven
- Naam/adres voor verzending, email voor betaling, telefoon voor contact
- WooCommerce cookies + Jetpack analytics cookies
- Recht op inzage/aanpassing/verwijdering via info@caferico.be

---

## 8. Testimonials

> **Tom Janssen**, koffiebrander OR Coffee:
> "Persoonlijk vind ik het een lekkere koffie die zeker mag getoond worden. Een goede volle smaak, beetje chocolade. Zal bij vele mensen in de smaak vallen."

> **Lesly Yohana Dominguez**, koffieboerin RAOS:
> "Koffie oogsten is niet alleen mannenwerk. Wij vrouwen vinden kwaliteit belangrijk en leggen ons dan ook toe op zorgvuldig werk. Zodat onze koffie onze trots wordt!"

> **Joke Scherpereel**, koffieliefhebber:
> "Heerlijke koffie!! Zelfs mee op reis geweest naar Schotland!!"

---

## 9. Subscription Tiers (voorstel)

| Tier | Hoeveelheid | Prijs/maand | Korting |
|------|------------|-------------|---------|
| Proeverij | 250g | €6,50 | ~6% |
| Klassiek | 500g | €12,50 | ~9% |
| Atelier | 1kg | €22,90 | ~13% |

- Klant kiest per tier: bonen of gemalen
- Maandelijks, pauzeerbaar, annuleerbaar

---

## 10. Design Prioriteiten (volgorde)

1. **Global:** kleurenpalet, typography, spacing systeem bijschaven
2. **Header & Footer** (zichtbaar op elke pagina)
3. **Homepage** (hoogste prioriteit)
4. **Shop pagina**
5. **Product detail**
6. **Subscriptions**
7. **Overige pagina's** (About, Contact, FAQ, Blog, Verkooppunten)
8. **Final polish** (transitions, micro-interacties, 404)

### Per pagina aandachtspunten

**Homepage:**
- Dramatische hero (niet alleen tekst + gradient)
- Featured producten met echte foto's en uitnodigende cards
- Subscription CTA visueel onderscheidend
- Merkwaarden met iconografie/illustraties
- Vloeiende flow tussen secties

**Shop:**
- Premium product grid cards met hover effects
- Visuele scheiding tussen categorieën
- Premium zoekbalk en filters

**Product Detail:**
- Mooie image galerij
- Prominente prijsweergave
- Premium add-to-cart sectie
- Goed gestylede WooCommerce HTML content

**Subscriptions:**
- Luxe tier cards
- Visueel duidelijk wat je krijgt per tier
- Opvallende CTA buttons

**Header & Footer:**
- Verfijnde header, logo plaatsing, mobile menu animatie
- Visueel aantrekkelijke footer

**Global:**
- Page transitions
- Micro-interacties op buttons, links, cards
- Betere skeleton loading states
- Scroll-to-top button
- Branded 404 pagina
- Consistente spacing (8px grid)

---

## 11. Architectuur

```
┌─────────────────┐     ┌──────────────────┐
│   Vercel         │     │   one.com         │
│   (Next.js app) │────▶│   (WooCommerce)   │
│   caferico.be    │ API │   headless backend│
└────────┬────────┘     └──────────────────┘
         │
         │ Mollie API
         ▼
┌─────────────────┐
│   Mollie         │
│   Checkout +     │
│   Subscriptions  │
└─────────────────┘
```

---

## 12. Skills voor de Agent

Gebruik deze geïnstalleerde skills actief:
- **ui-ux-pro-max** — design patterns, kleurtheorie, typography, accessibility
- **next-best-practices** — Next.js optimalisaties
- **agent-browser** — wijzigingen visueel verifiëren in de browser
- **frontend-design** — bold, memorable design keuzes
