# Progress

## Completed Phases (reference only, not part of current plan)

✅ Redesign (42/42 stories)
✅ Mollie checkout integratie
✅ Code quality audit
✅ Webhook/checkout security (Track A)
✅ Privacy/terms pages + cookie consent (Track E)
✅ Phase A: Foundation (steps 1-3)

---

## Plan — Phase B: Product Pages (Agent Product, steps 10-12)

Dependencies: Phase A (steps 1–3) completed.

- [x] 10. Product page: make main content light — gallery + purchase + tabs on parchment; fix any `prose-invert` conflicts (`app/[locale]/(pages)/shop/[slug]/page.tsx`) — DONE (iteration 1)
- [x] 11. ProductTabs: add light variant styles — remove `prose-invert` for light sections and ensure readable typography (`components/ProductTabs.tsx`) — DONE (iteration 2)
- [x] 12. Product gallery: single-image behavior — hide thumbnails + prev/next + dots when `images.length <= 1` (`components/ProductImageGallery.tsx`) — DONE (iteration 3)

---

## Current

- Working on: ALL DONE
- Iteration: 3
- Last action: Removed placeholder thumbnail boxes for single-image products; nav arrows, dots, thumbnails, and lightbox nav already guarded by images.length > 1
- Last result: typecheck + build pass

## Architecture Decisions

- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
- Split-mode approach: hero/nav stays dark (`bg-noir`), content sections can be `.section-light` for a parchment body (decided step 0)
- Light tokens: `parchment` (#F7F0E7) + `ink` (#2C1810) for readable light sections; keep gold accents (decided step 0)
