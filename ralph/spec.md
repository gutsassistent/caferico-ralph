# Spec — Caférico

## What we're building (concrete)
UI/UX polish fase voor Caférico (split‑mode), gebaseerd op fjoez.txt + Image #1/#2:
1. **Split‑mode visual system** — dark hero/nav (`#1A0F0A`) + light body (`#F7F0E7`) met bestaande luxe sfeer.
2. **Design tokens bijwerken** — behoud Playfair/Inter, gold/roast accents, meer contrast in light sections.
3. **Homepage curation** — max 3–4 producten, compact en clean.
4. **Shop filters** — filtering werkt + sticky filter panel + betere layout/spacing.
5. **Product gallery** — single‑image producten tonen geen extra/lege canvas; multi‑image wel.
6. **Cart visuals** — cart drawer lichter, productafbeeldingen altijd zichtbaar, nieuw cart icon.
7. **Contrast & vibrance** — UI voelt niet “te donker”; light sections domineren content.
8. **Account adres bewerken** — form editable i.p.v. read‑only.
9. **Static media** — alle niet‑product beelden uit `/public` (productimages blijven WC).
10. **Verkooppunten** — Google Maps embed op locaties.
11. **Algemene voorwaarden + cookie consent** — audit/fix waar nodig.
12. **Packaging cue** — roastery label/pill styling geïnspireerd op Image #1.

## Acceptance Criteria
- Split‑mode actief: hero/nav donker, content‑body licht (parchment) op alle hoofdpagina’s.
- Body tekst donker en leesbaar op light‑background; contrast ≥ 4.5:1.
- Homepage toont maximaal 4 producten.
- Shop filters werken met AND‑logica + sticky panel blijft zichtbaar bij scroll.
- Product cards: geen lege canvas bij single image; multi‑image blijft als carousel.
- Cart drawer: productafbeeldingen zichtbaar + nieuwe cart icon toegepast.
- Niet‑product beelden komen uit `/public` (geen WC‑afhankelijkheid).
- Account adres is bewerkbaar en opslaan werkt.
- Google Maps zichtbaar op verkooppunten pagina.
- Terms + cookie consent gecontroleerd en aangepast waar nodig.
- Alle tekst via next‑intl, geen hardcoded labels.

## Out of Scope
- Geen volledige rebrand of nieuw font‑paar (Playfair/Inter blijft).
- Geen prijsrange slider of extra filtercategorieën.
- Geen nieuwe backend features of data‑migraties.
- Geen URL query‑params voor filters.
- Geen nieuwe marketing flows (double opt‑in, spam protection, admin dashboards).

## Technical Constraints
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS only
- next-intl (NL, EN, FR, ES)
- WooCommerce REST API (headless, one.com)
- Mollie checkout (niet Stripe)
- NextAuth.js voor auth
- Vercel deployment
