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
- [x] 5. Home: convert Our Story section to light — DONE (iteration 2)
- [x] 6. Home: convert Values section to light — DONE (iteration 3)
- [x] 7. Home curation verification — DONE (iteration 4)

---

## Current

- Working on: ALL DONE
- Iteration: 4
- Last action: Verified homepage renders max 4 products (per_page: '4' confirmed in page.tsx:30)
- Last result: typecheck + build pass; no regression, no changes needed

## Architecture Decisions

- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
- Split-mode approach: hero/nav stays dark (`bg-noir`), content sections can be `.section-light` for a parchment body (decided step 0)
- Light tokens: `parchment` (#F7F0E7) + `ink` (#2C1810) for readable light sections; keep gold accents (decided step 0)
