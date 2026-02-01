# Progress

## Completed Phases (reference only, not part of current plan)

✅ Redesign (42/42 stories)
✅ Mollie checkout integratie
✅ Code quality audit
✅ Webhook/checkout security (Track A)
✅ Privacy/terms pages + cookie consent (Track E)
✅ Phase A: Foundation (steps 1-3)

---

## Plan — Agent Home (Steps 4-7)

Dependencies: Phase A (steps 1-3) completed.
Target file: `app/[locale]/(pages)/page.tsx`

- [x] 4. Home: convert Featured Products section to light — DONE (iteration 1)
- [ ] 5. Home: convert Our Story section to light — parchment bg + ink text
- [ ] 6. Home: convert Values section to light — update card surfaces/text for light
- [ ] 7. Home curation verification — confirm homepage renders max 4 products (already `per_page: '4'`), adjust only if regression

---

## Current

- Working on: Step 5
- Iteration: 1
- Last action: Converted Featured Products section to section-light with parchment bg + ink text colors
- Last result: typecheck + build pass; cards use bg-white/60 + ink text on parchment background

## Architecture Decisions

- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
- Split-mode approach: hero/nav stays dark (`bg-noir`), content sections can be `.section-light` for a parchment body (decided step 0)
- Light tokens: `parchment` (#F7F0E7) + `ink` (#2C1810) for readable light sections; keep gold accents (decided step 0)
