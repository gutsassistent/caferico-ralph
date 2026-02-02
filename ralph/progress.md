# Progress

## Completed Phases (reference only, not part of current plan)

✅ Redesign (42/42 stories)
✅ Mollie checkout integratie
✅ Code quality audit
✅ Webhook/checkout security (Track A)
✅ Privacy/terms pages + cookie consent (Track E)
✅ Phase A: Foundation (steps 1-3)
✅ Phase B: Split-Mode Core Commerce (steps 4-15)


---

## Current


### Phase C: Split-Mode Across Main Pages (Wave 2: parallel)

Dependencies: Step 1–3.
Goal: hero/nav can stay dark, but content bodies should default to light where appropriate.

- [ ] 16. Blog listing: convert listing/grid section to light — cards/tags adjusted for ink text (`app/[locale]/(pages)/blog/page.tsx`)
- [ ] 17. Blog detail: convert article body + related posts to light — adjust tag pills and borders (`app/[locale]/(pages)/blog/[slug]/page.tsx`)
- [ ] 18. About: start split-mode conversion (part 1) — convert Intro section to light (`app/[locale]/(pages)/about/page.tsx`)
- [ ] 19. About: continue split-mode conversion (part 2) — convert map/images section to light (`app/[locale]/(pages)/about/page.tsx`)
- [x] 20. Subscriptions: convert tiers + FAQ sections to light; keep hero dark (`app/[locale]/(pages)/subscriptions/page.tsx`) — DONE (iteration 1)
- [ ] 21. Locations: convert locations grid section to light; update card styling for ink text (`app/[locale]/(pages)/verkooppunten/page.tsx`, `components/LocationsGrid.tsx`)


## Architecture Decisions

- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
- Split-mode approach: hero/nav stays dark (`bg-noir`), content sections can be `.section-light` for a parchment body (decided step 0)
- Light tokens: `parchment` (#F7F0E7) + `ink` (#2C1810) for readable light sections; keep gold accents (decided step 0)
- Packaging cue: standardize pills/badges via a `.pill-roastery` utility (decided step 0)
- Static images: non-product imagery should live in `/public/images` and be referenced by pages + SEO defaults (decided step 0)
- Google Maps: embed via iframe; prefer single selected-location map panel to avoid 10 heavy embeds (decided step 0)
- Account edit: update WooCommerce customer billing/shipping via authenticated API route + `woocommerce-customers` helper (decided step 0)
