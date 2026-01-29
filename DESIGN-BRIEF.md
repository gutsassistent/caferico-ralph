# Caférico — Design Overhaul Brief

## Context
Je werkt in een Next.js 15 (App Router, TypeScript, Tailwind CSS) project voor Caférico, een Belgische specialty coffee webshop. De front-end is functioneel met echte WooCommerce data. Jouw taak is de visuele ervaring naar premium-niveau tillen.

## Gebruik je skills
Gebruik de volgende geïnstalleerde skills actief:
- **ui-ux-pro-max** — voor design patterns, kleurtheorie, typography, accessibility
- **next-best-practices** — voor Next.js optimalisaties
- **agent-browser** — om je wijzigingen visueel te verifiëren in de browser
- **frontend-design** — voor bold, memorable design keuzes

## Design Richting
**Vibe:** Elegant, warm, premium, awe-inspiring — zoals een high-end koffiebar in Antwerpen.

**NIET:** Generic e-commerce, Bootstrap-look, Material UI default, koude tech-vibe.

**Referenties qua feel:**
- Specialty coffee sites: bluebottlecoffee.com, trade.coffee, vervecoffee.com
- Premium product sites: aesop.com, byredo.com
- Belgische warmte: ambachtelijk, persoonlijk, geen corporate

## Huidige kleurenpalet (Tailwind config)
```
espresso: '#3C1518'
roast: '#69140E'
cream: '#F2E8CF'
gold: '#D4A574'
noir: '#1A0F0A'
```
Je mag het palet uitbreiden of bijschaven, maar behoud de warme kern. Donkere achtergronden met warme accenten.

## Typography
- Headings: Playfair Display (serif) — mag veranderd worden naar een ander premium serif
- Body: Inter (sans-serif) — mag veranderd worden naar een beter passend sans-serif
- De font pairing moet premium, leesbaar en consistent zijn

## Wat moet verbeterd worden

### 1. Homepage (PRIORITEIT)
- Hero sectie is nu alleen tekst + CSS gradient. Maak het impactvoller:
  - Grotere, meer dramatische hero
  - Betere visuele hiërarchie
  - Animaties die premium voelen (niet overdreven)
- Featured producten sectie: product cards moeten er uitnodigend uitzien met echte foto's
- Subscription CTA sectie: meer visueel onderscheidend
- Merkwaarden sectie: iconografie of illustraties toevoegen
- Overall flow van sectie naar sectie moet vloeiend aanvoelen

### 2. Shop pagina
- Product grid cards: hover effects verfijnen
- Betere visuele scheiding tussen categorieën
- Zoekbalk en filters moeten premium aanvoelen, niet generic

### 3. Product detail pagina
- Image galerij: mooiere presentatie (de foto's zijn er nu)
- Prijsweergave prominenter
- Add-to-cart sectie moet premium aanvoelen
- Beschrijving beter gestyled (WooCommerce HTML content)

### 4. Subscriptions pagina
- Tier cards moeten er luxe uitzien
- Visueel duidelijk maken wat je krijgt per tier
- CTA buttons moeten opvallen

### 5. Over Ons, Contact, FAQ, Blog
- Consistente premium look across alle pagina's
- Parallax effecten of scroll-based animaties waar passend
- Contact formulier: premium styling

### 6. Header & Footer
- Header: verfijnen, logo plaatsing, mobile menu animatie
- Footer: meer visueel aantrekkelijk, niet alleen tekst

### 7. Global
- Page transitions
- Micro-interacties op buttons, links, cards
- Loading states (skeleton screens zijn er al, maar kunnen beter)
- Scroll-to-top button styling
- 404 pagina
- Consistente spacing systeem (8px grid)

## Technische regels
- Tailwind CSS voor alle styling (geen inline styles of CSS modules)
- Animaties via CSS transitions/transforms of Framer Motion als dat al geïnstalleerd is
- Responsive: mobile-first (375px → 768px → 1024px → 1440px)
- Performance: geen zware libraries toevoegen. Lightweight is premium.
- Accessibility: contrast ratios, focus states, alt teksten
- Alle teksten blijven via next-intl (NIET hardcoden)
- Geen bestaande functionaliteit breken (cart, routing, i18n)

## Verificatie
Na elke pagina die je aanpast:
1. Open in browser en controleer visueel (gebruik agent-browser skill)
2. Check mobile view (375px breed)
3. Check dat cart, taalswitch en navigatie nog werken
4. `npm run typecheck` moet slagen
5. `npm run build` moet slagen

## Volgorde
1. Global: kleurenpalet, typography, spacing systeem bijschaven
2. Header & Footer (want die zijn op elke pagina)
3. Homepage
4. Shop pagina
5. Product detail
6. Subscriptions
7. Overige pagina's (About, Contact, FAQ, Blog)
8. Final polish (transitions, micro-interacties, 404)
