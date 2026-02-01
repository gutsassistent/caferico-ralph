# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

---

## Plan
1. [x] Create `app/[locale]/(pages)/privacy/page.tsx` and `app/[locale]/(pages)/terms/page.tsx` with minimal copy + i18n keys in all locales (placeholders allowed until final text). Depends on: none. Test: routes render in all locales. — DONE (iteration 1)
2. [ ] Add a minimal `CookieConsent` component with localStorage state and link to `/privacy`, wired into `app/[locale]/layout.tsx`. Depends on: 1. Test: banner shows once, dismiss persists on reload.

## Current
- Working on: Step 1 completed
- Iteration: 1
- Last action: Created privacy and terms pages with i18n keys in all 4 locales
- Last result: typecheck passes, build passes, routes render in nl/en/fr/es

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
