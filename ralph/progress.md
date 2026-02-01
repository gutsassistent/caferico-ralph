# Progress

## Completed Phases (reference only, not part of current plan)

✅ Redesign (42/42 stories)
✅ Mollie checkout integratie
✅ Code quality audit
✅ Webhook/checkout security (Track A)
✅ Privacy/terms pages + cookie consent (Track E)

---

## Plan — UI/UX Polish (Split-Mode)

This plan is structured for "waves" of 2–4 parallel agents while keeping merge conflicts low.
Rule of thumb: each step targets a small, testable change (<= ~50 LOC or isolated file additions) and ends with `npm run typecheck` + `npm run build`.

### Phase A: Foundation (MUST be first; solo)

Dependencies: none. All split-mode steps depend on these tokens/utilities.

- [ ] 1. Add light-body tokens to Tailwind — add `parchment: '#F7F0E7'`, `ink: '#2C1810'`, `inkMuted: '#5A3E33'` to `tailwind.config.ts` (single-file change)
- [ ] 2. Add matching CSS vars + update `color-scheme` — add `--color-parchment`/`--color-ink`/`--color-ink-muted` and set `:root { color-scheme: light dark; }` in `app/globals.css`
- [ ] 3. Add global split-mode + packaging utilities — in `app/globals.css` add `@layer components` utilities: `.section-light`, `.section-dark`, `.pill-roastery` (packaging cue base)

### Phase B: Split-Mode Core Commerce (Wave 1: parallel after Phase A)

Dependencies: Step 1–3.

- [ ] 4. Home: convert Featured Products section to light — parchment bg + ink text; keep hero dark (`app/[locale]/(pages)/page.tsx`)
- [ ] 5. Home: convert Our Story section to light — parchment bg + ink text (`app/[locale]/(pages)/page.tsx`)
- [ ] 6. Home: convert Values section to light — update card surfaces/text for light (`app/[locale]/(pages)/page.tsx`)
- [ ] 7. Home curation verification — confirm homepage renders max 4 products (already `per_page: '4'`), adjust only if regression (`app/[locale]/(pages)/page.tsx`)
- [ ] 8. Shop: make post-hero content light — intro + catalog wrapper becomes `.section-light` (`app/[locale]/(pages)/shop/page.tsx`)
- [ ] 9. ShopCatalog: restyle for light background — sidebar, inputs, cards, chips; keep logic/sticky/results count as-is (`components/ShopCatalog.tsx`)
- [ ] 10. Product page: make main content light — gallery + purchase + tabs on parchment; fix any `prose-invert` conflicts (`app/[locale]/(pages)/shop/[slug]/page.tsx`)
- [ ] 11. ProductTabs: add light variant styles — remove `prose-invert` for light sections and ensure readable typography (`components/ProductTabs.tsx`)
- [ ] 12. Product gallery: single-image behavior — hide thumbnails + prev/next + dots when `images.length <= 1` (`components/ProductImageGallery.tsx`)
- [ ] 13. Cart drawer: light visuals — parchment drawer surface + ink text; keep overlay dark (`components/CartDrawer.tsx`)
- [ ] 14. Cart drawer: ensure image visibility — add deterministic fallback (never blank) when `item.image` missing (`components/CartDrawer.tsx`)
- [ ] 15. Header: new cart icon SVG — replace current icon; verify badge contrast on dark header (`components/Header.tsx`)

### Phase C: Split-Mode Across Main Pages (Wave 2: parallel)

Dependencies: Step 1–3.
Goal: hero/nav can stay dark, but content bodies should default to light where appropriate.

- [ ] 16. Blog listing: convert listing/grid section to light — cards/tags adjusted for ink text (`app/[locale]/(pages)/blog/page.tsx`)
- [ ] 17. Blog detail: convert article body + related posts to light — adjust tag pills and borders (`app/[locale]/(pages)/blog/[slug]/page.tsx`)
- [ ] 18. About: start split-mode conversion (part 1) — convert Intro section to light (`app/[locale]/(pages)/about/page.tsx`)
- [ ] 19. About: continue split-mode conversion (part 2) — convert map/images section to light (`app/[locale]/(pages)/about/page.tsx`)
- [ ] 20. Subscriptions: convert tiers + FAQ sections to light; keep hero dark (`app/[locale]/(pages)/subscriptions/page.tsx`)
- [ ] 21. Locations: convert locations grid section to light; update card styling for ink text (`app/[locale]/(pages)/verkooppunten/page.tsx`, `components/LocationsGrid.tsx`)

### Phase D: Forms & Account (Wave 3: parallel, but mind shared i18n files)

Dependencies: Step 1–3 for split-mode styling; Account edit has its own sequential dependency.

- [ ] 22. Contact: convert form section to light and update form inputs for ink text (`app/[locale]/(pages)/contact/page.tsx`, `components/ContactForm.tsx`)
- [ ] 23. FAQ: convert explorer section to light and update component styling (`app/[locale]/(pages)/faq/page.tsx`, `components/FaqExplorer.tsx`)
- [ ] 24. Login: convert page + LoginForm to light styling (inputs currently assume dark) (`app/[locale]/(pages)/login/page.tsx`, `components/LoginForm.tsx`)
- [ ] 25. Checkout: convert page + CheckoutForm to light styling (inputs currently assume dark) (`app/[locale]/(pages)/checkout/page.tsx`, `components/CheckoutForm.tsx`)

- [ ] 26. Checkout return: convert return content section to light (`app/[locale]/(pages)/checkout/return/page.tsx`)

Account address editing (sequential, same agent recommended)

- [ ] 27. Add Woo customer update helper — implement `updateCustomer(customerId, patch)` in `lib/woocommerce-customers.ts`
- [ ] 28. Add address update route — `PUT app/api/account/address/route.ts` updates billing/shipping for current user
- [ ] 29. Account i18n: add address edit strings — edit/save/cancel + field labels + success/error in all locales (`messages/nl.json`, `messages/en.json`, `messages/fr.json`, `messages/es.json`)
- [ ] 30. AccountProfile: editable address UI — add edit/save/cancel flows and call the new API (`components/AccountProfile.tsx`)
- [ ] 31. Account page: convert profile section wrapper to light (`app/[locale]/(pages)/account/page.tsx`)

### Phase E: Static Media + SEO Defaults (Dedicated, avoid conflicts with Home/About/Blog work)

Dependencies: none, but best done after the relevant pages are stable to reduce merge conflicts.

- [ ] 32. Add non-product assets to `/public/images` — move/copy from `scrape/` and/or download; ensure filenames are stable (file additions only)
- [ ] 33. Swap page image sources to local `/images/...` — home hero, about images, subscriptions hero/card, blog hero images (`app/[locale]/(pages)/page.tsx`, `app/[locale]/(pages)/about/page.tsx`, `app/[locale]/(pages)/subscriptions/page.tsx`, `app/[locale]/(pages)/blog/[slug]/page.tsx`)
- [ ] 34. Update SEO + schema images to local — change default OG image and structured-data logo/business image to `/logo.png` or `/images/...` (`lib/seo.ts`, `lib/structured-data.ts`)

### Phase F: Locations Map Embed (Small, independent)

Dependencies: none.

- [ ] 35. Locations: add Google Maps embed panel — show a map for the selected location (not 10 iframes) (`components/LocationsGrid.tsx`)
- [ ] 36. Locations i18n: add map-related labels — e.g. "Bekijk op kaart" / "Directions" in all locales (`messages/nl.json`, `messages/en.json`, `messages/fr.json`, `messages/es.json`)

### Phase G: Cookie Consent + Legal Pages (Small, independent)

Dependencies: none.

- [ ] 37. CookieConsent: add reject option — persist state as `accepted`/`rejected` (`components/CookieConsent.tsx` + i18n)
- [ ] 38. Privacy + Terms: switch to light-body layout — `.section-light` with ink text and readable spacing (`app/[locale]/(pages)/privacy/page.tsx`, `app/[locale]/(pages)/terms/page.tsx`)

### Phase H: Contrast & Final Polish (LAST; solo)

Dependencies: All split-mode conversion steps.

- [ ] 39. Contrast audit — ensure ink text on parchment meets >= 4.5:1; fix lingering `text-cream/*` in light sections
- [ ] 40. Packaging cue roll-out (part 1) — apply `.pill-roastery` to Home trust badges + featured category pills (`app/[locale]/(pages)/page.tsx`)
- [ ] 41. Packaging cue roll-out (part 2) — apply `.pill-roastery` to Blog tags (`app/[locale]/(pages)/blog/page.tsx`, `app/[locale]/(pages)/blog/[slug]/page.tsx`)
- [ ] 42. Packaging cue roll-out (part 3) — apply `.pill-roastery` to Shop + Product category chips where appropriate (`components/ShopCatalog.tsx`, `app/[locale]/(pages)/shop/[slug]/page.tsx`)
- [ ] 43. Mobile pass (375px) — verify split-mode pages and cart drawer; patch layout issues only

---

## Dependency Graph

```
Phase A (1-3) ──┬──→ Phase B (4-15): Core commerce split-mode
                ├──→ Phase C (16-21): Main pages split-mode
                └──→ Phase D (22-26): Forms split-mode

Account edit: 27 → 28 → 29 → 30 → 31 (sequential; independent of split-mode tokens but benefits from light tokens)
Static media/SEO: 32 → 33 → 34 (sequential; best after pages stabilize)
Locations maps: 35 → 36 (small, independent)
Cookie/legal: 37 → 38 (small, independent)
Final polish: 39 → 40 → 41 → 42 → 43 (after split-mode conversion)
```

## Current

- Working on: Step 1
- Iteration: 0
- Last action: Applied Plan v2 (waves + split-mode across all main pages)
- Last result: `ralph/progress.md` updated with Plan v2

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
