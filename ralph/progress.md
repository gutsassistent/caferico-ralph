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

- [x] 22. Contact: convert form section to light and update form inputs for ink text (`app/[locale]/(pages)/contact/page.tsx`, `components/ContactForm.tsx`) — DONE (iteration 1)
- [x] 23. FAQ: convert explorer section to light and update component styling (`app/[locale]/(pages)/faq/page.tsx`, `components/FaqExplorer.tsx`) — DONE (iteration 1)
- [x] 24. Login: convert page + LoginForm to light styling (inputs currently assume dark) (`app/[locale]/(pages)/login/page.tsx`, `components/LoginForm.tsx`) — DONE (iteration 1)
- [x] 25. Checkout: convert page + CheckoutForm to light styling (inputs currently assume dark) (`app/[locale]/(pages)/checkout/page.tsx`, `components/CheckoutForm.tsx`) — DONE (iteration 1)
- [x] 26. Checkout return: convert return content section to light (`app/[locale]/(pages)/checkout/return/page.tsx`, `components/CheckoutReturn.tsx`) — DONE (iteration 1)

### Account address editing (sequential, single agent)

- [x] 27. Add Woo customer update helper — implement `updateCustomer(customerId, patch)` in `lib/woocommerce-customers.ts` — DONE (iteration 1)
- [x] 28. Add address update route — `PUT app/api/account/address/route.ts` updates billing/shipping for current user — DONE (iteration 1)
- [x] 29. Account i18n: add address edit strings — edit/save/cancel + field labels + success/error in all locales (`messages/nl.json`, `messages/en.json`, `messages/fr.json`, `messages/es.json`) — DONE (iteration 1)
- [x] 30. AccountProfile: editable address UI — add edit/save/cancel flows and call the new API (`components/AccountProfile.tsx`) — DONE (iteration 1)
- [x] 31. Account page: convert profile section wrapper to light (`app/[locale]/(pages)/account/page.tsx`) — DONE (iteration 2)

### Phase E: Static Media + SEO Defaults

Dependencies: none, but best done after the relevant pages are stable to reduce merge conflicts.

- [x] 32. Add non-product assets to `/public/images` — move/copy from `scrape/` and/or download; ensure filenames are stable (file additions only) — DONE (iteration 1)
- [x] 33. Swap page image sources to local `/images/...` — home hero, about images, subscriptions hero/card, blog hero images (`app/[locale]/(pages)/page.tsx`, `app/[locale]/(pages)/about/page.tsx`, `app/[locale]/(pages)/subscriptions/page.tsx`, `app/[locale]/(pages)/blog/[slug]/page.tsx`) — DONE (iteration 2)
- [x] 34. Update SEO + schema images to local — change default OG image and structured-data logo/business image to `/logo.png` or `/images/...` (`lib/seo.ts`, `lib/structured-data.ts`) — DONE (iteration 3)

### Phase F: Locations Map Embed

Dependencies: none.

- [x] 35. Locations: add Google Maps embed panel — show a map for the selected location (not 10 iframes) (`components/LocationsGrid.tsx`) — DONE (iteration 1)
- [x] 36. Locations i18n: add map-related labels — e.g. "Bekijk op kaart" / "Directions" in all locales (`messages/nl.json`, `messages/en.json`, `messages/fr.json`, `messages/es.json`) — DONE (iteration 4)

### Phase G: Cookie Consent + Legal Pages

Dependencies: none.

- [x] 37. CookieConsent: add reject option — persist state as `accepted`/`rejected` (`components/CookieConsent.tsx` + i18n) — DONE (iteration 1)
- [x] 38. Privacy + Terms: switch to light-body layout — `.section-light` with ink text and readable spacing (`app/[locale]/(pages)/privacy/page.tsx`, `app/[locale]/(pages)/terms/page.tsx`) — DONE (iteration 2)

### Phase H: Contrast & Final Polish (LAST; solo)

Dependencies: All split-mode conversion steps.

- [x] 39. Contrast audit — ensure ink text on parchment meets >= 4.5:1; fix lingering `text-cream/*` in light sections — DONE (iteration 7)
- [x] 40. Packaging cue roll-out (part 1) — apply `.pill-roastery` to Home trust badges + featured category pills (`app/[locale]/(pages)/page.tsx`) — DONE (iteration 2)
- [x] 41. Packaging cue roll-out (part 2) — apply `.pill-roastery` to Blog tags (`app/[locale]/(pages)/blog/page.tsx`, `app/[locale]/(pages)/blog/[slug]/page.tsx`) — DONE (iteration 3)
- [x] 42. Packaging cue roll-out (part 3) — apply `.pill-roastery` to Shop + Product category chips where appropriate (`components/ShopCatalog.tsx`, `app/[locale]/(pages)/shop/[slug]/page.tsx`) — DONE (iteration 4)
- [ ] 43. Mobile pass (375px) — verify split-mode pages and cart drawer; patch layout issues only

---

## Current

- Working on: Step 42 complete
- Iteration: 10
- Last action: Applied .pill-roastery to Shop catalog product card category chip and Product detail related-products category chip
- Last result: Success — typecheck + build pass

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
