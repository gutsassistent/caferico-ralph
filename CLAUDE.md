# Caférico Redesign — Agent Instructions

## Jouw Rol
Je bent een front-end redesign agent voor Caférico (caferico.be), een Belgische specialty coffee webshop. Je werkt aan ONE user story per iteratie vanuit `prd.json`.

## Essentiële Bestanden
- **CONTEXT.md** — Alle bedrijfsinfo, design richting, technische stack, content, afbeeldingen. LEES DIT EERST.
- **prd-mollie.json** — User stories voor Mollie checkout integratie. Pak de eerste story waar `passes: false`.
- **progress.txt** — Learnings van vorige iteraties. Lees dit voor context, append jouw learnings na afloop.

## Technische Stack (NIET afwijken)
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS only (geen CSS modules, geen inline styles)
- **i18n:** next-intl (NL default, EN, FR, ES) — ALLE teksten via next-intl, NIET hardcoden
- **Backend:** WooCommerce REST API (headless, draait op one.com)
- **Checkout:** Mollie (hosted checkout, redirect) — NIET Stripe
- **Subscriptions:** Mollie Recurring API — NIET Stripe
- **Auth:** NextAuth.js
- **Deployment:** Vercel
- **Fonts:** Playfair Display (headings) + Inter (body)

## Design Richting
- Elegant, warm, premium, awe-inspiring
- Deep browns, cream, gold accents, dark backgrounds
- Mobile-first responsive (375px → 768px → 1024px → 1440px)
- Generous whitespace, 8px grid spacing system
- Zie CONTEXT.md sectie 2 voor volledige design brief

## Workflow Per Iteratie
1. Lees `progress.txt` voor context van vorige iteraties
2. Lees `prd.json` en pak de eerste story met `passes: false`
3. Implementeer ALLEEN die ene story
4. Verifieer:
   - `npm run typecheck` slaagt
   - `npm run build` slaagt
   - Visueel correct (mobile + desktop)
   - Bestaande functionaliteit niet gebroken (cart, taalswitch, navigatie)
5. Commit met beschrijvende message
6. Update `prd.json`: zet de story op `"passes": true`
7. Append learnings aan `progress.txt`

## Regels
- **Eén story per iteratie.** Niet meer.
- **Breek niets.** Cart, routing, i18n, bestaande pagina's moeten blijven werken.
- **Alle teksten via next-intl.** Voeg vertalingen toe aan messages/nl.json, en.json, fr.json, es.json.
- **Gebruik echte afbeeldingen** waar beschikbaar (zie CONTEXT.md sectie 5 voor URLs).
- **Tailwind only.** Geen styled-components, geen CSS modules, geen inline styles.
- **Geen nieuwe dependencies** tenzij de story het expliciet vereist.
- **Mobile-first.** Elke component eerst voor 375px, dan opschalen.

## Skills (GEBRUIK DEZE)
Je hebt skills geïnstalleerd die je ACTIEF moet inzetten:
- **ui-ux-pro-max** — design patterns, kleurtheorie, typography, accessibility. Laad bij elke visuele story.
- **next-best-practices** — Next.js optimalisaties. Laad bij performance en architectuur stories.
- **agent-browser** — visueel verifiëren in de browser. Gebruik om je wijzigingen te checken.
- **frontend-design** — bold, memorable design keuzes. Laad bij elke design story.

Laad een skill met: "Load the [skill-name] skill" of lees de SKILL.md in de skills/ directory.

## Huidige Staat
- Redesign fase compleet (42/42 stories done)
- WooCommerce REST API integratie werkt (echte productdata)
- Cart is client-side (localStorage) via CartProvider/CartDrawer
- Nog GEEN checkout flow — dat is wat deze fase bouwt
- Mollie test API key staat in .env.local (MOLLIE_API_KEY)
- WooCommerce draait als headless backend op one.com

## Bestaande Structuur
```
app/[locale]/(pages)/          — pagina's
components/                     — gedeelde componenten
data/                          — mock data (JSON)
messages/                      — i18n vertalingen (nl, en, fr, es)
lib/                           — utilities
types/                         — TypeScript types
tailwind.config.ts             — design tokens
```
