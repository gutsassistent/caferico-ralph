# Progress

## Completed Phases (reference only, not part of current plan)

✅ Redesign (42/42 stories)
✅ Mollie checkout integratie
✅ Code quality audit
✅ Webhook/checkout security (Track A)
✅ Privacy/terms pages + cookie consent (Track E)

---

## Plan — Agent Header (Steps 13–15)

Dependencies: Step 1–3 (Phase A, completed by another agent).

- [x] 13. Cart drawer: light visuals — parchment drawer surface + ink text; keep overlay dark (`components/CartDrawer.tsx`) — DONE (iteration 1)
- [x] 14. Cart drawer: ensure image visibility — add deterministic fallback (never blank) when `item.image` missing (`components/CartDrawer.tsx`) — DONE (iteration 2)
- [ ] 15. Header: new cart icon SVG — replace current icon; verify badge contrast on dark header (`components/Header.tsx`)

---

## Current

- Working on: Step 15
- Iteration: 2
- Last action: Added coffee-bean SVG icon to CartDrawer image fallback so missing images show a visible placeholder (dark gradient + grain texture + bean icon)
- Last result: typecheck + build pass

## Architecture Decisions

- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
- Split-mode approach: hero/nav stays dark (`bg-noir`), content sections can be `.section-light` for a parchment body (decided step 0)
- Light tokens: `parchment` (#F7F0E7) + `ink` (#2C1810) for readable light sections; keep gold accents (decided step 0)
