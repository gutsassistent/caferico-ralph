# Progress

## Completed Phases (reference only, not part of current plan)

✅ Redesign (42/42 stories)
✅ Mollie checkout integratie
✅ Code quality audit
✅ Webhook/checkout security (Track A)
✅ Privacy/terms pages + cookie consent (Track E)

---

## Plan — Phase B: Shop (Agent Shop)

Dependencies: Step 1–3 (Phase A, completed by another agent).

- [x] 8. Shop: make post-hero content light — intro + catalog wrapper becomes `.section-light` (`app/[locale]/(pages)/shop/page.tsx`) — DONE (iteration 1)
- [x] 9. ShopCatalog: restyle for light background — sidebar, inputs, cards, chips; keep logic/sticky/results count as-is (`components/ShopCatalog.tsx`) — DONE (iteration 2)

---

## Current

- Working on: All steps complete
- Iteration: 2
- Last action: Restyled ShopCatalog for light background — swapped cream/dark tokens to ink/inkMuted/white for sidebar, cards, inputs, skeleton, empty state; kept mobile drawer dark; kept gold accents and all logic unchanged
- Last result: typecheck + build pass

## Architecture Decisions

- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
- Split-mode approach: hero/nav stays dark (`bg-noir`), content sections can be `.section-light` for a parchment body (decided step 0)
- Light tokens: `parchment` (#F7F0E7) + `ink` (#2C1810) for readable light sections; keep gold accents (decided step 0)
