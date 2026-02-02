# Progress

## Completed Phases (reference only, not part of current plan)

✅ Redesign (42/42 stories)
✅ Mollie checkout integratie
✅ Code quality audit
✅ Webhook/checkout security (Track A)
✅ Privacy/terms pages + cookie consent (Track E)
✅ Phase A: Foundation (steps 1-3)
✅ Phase B: Split-Mode Core Commerce (steps 4-15)
✅ Phase C: Split-Mode Across Main Pages (steps 16-21)

---

## Phase D: Forms & Account (Wave 3)

### Forms split-mode (parallel agents)

- [ ] 22. Contact: convert form section to light and update form inputs for ink text (`app/[locale]/(pages)/contact/page.tsx`, `components/ContactForm.tsx`)
- [ ] 23. FAQ: convert explorer section to light and update component styling (`app/[locale]/(pages)/faq/page.tsx`, `components/FaqExplorer.tsx`)
- [ ] 24. Login: convert page + LoginForm to light styling (inputs currently assume dark) (`app/[locale]/(pages)/login/page.tsx`, `components/LoginForm.tsx`)
- [ ] 25. Checkout: convert page + CheckoutForm to light styling (inputs currently assume dark) (`app/[locale]/(pages)/checkout/page.tsx`, `components/CheckoutForm.tsx`)
- [ ] 26. Checkout return: convert return content section to light (`app/[locale]/(pages)/checkout/return/page.tsx`)

### Account address editing (sequential, single agent)

- [x] 27. Add Woo customer update helper — implement `updateCustomer(customerId, patch)` in `lib/woocommerce-customers.ts` — DONE (iteration 1)
- [ ] 28. Add address update route — `PUT app/api/account/address/route.ts` updates billing/shipping for current user
- [ ] 29. Account i18n: add address edit strings — edit/save/cancel + field labels + success/error in all locales (`messages/nl.json`, `messages/en.json`, `messages/fr.json`, `messages/es.json`)
- [ ] 30. AccountProfile: editable address UI — add edit/save/cancel flows and call the new API (`components/AccountProfile.tsx`)
- [ ] 31. Account page: convert profile section wrapper to light (`app/[locale]/(pages)/account/page.tsx`)

---

## Current

- Working on: Step 28 (address update route)
- Iteration: 1
- Last action: Added updateCustomer() to lib/woocommerce-customers.ts
- Last result: Typecheck passes; build fails due to missing .env.local (pre-existing env issue, not code-related)

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
