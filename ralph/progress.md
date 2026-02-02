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

## Phase B Results

- [x] 4. Home: convert Featured Products section to light — DONE
- [x] 5. Home: convert Our Story section to light — DONE
- [x] 6. Home: convert Values section to light — DONE
- [x] 7. Home curation verification — DONE
- [x] 8. Shop: make post-hero content light — DONE
- [x] 9. ShopCatalog: restyle for light background — DONE
- [x] 10. Product page: make main content light — DONE
- [x] 11. ProductTabs: add light variant styles — DONE
- [x] 12. Product gallery: single-image behavior — DONE
- [x] 13. Cart drawer: light visuals — DONE
- [x] 14. Cart drawer: ensure image visibility — DONE
- [x] 15. Header: new cart icon SVG — DONE

---

## Current

- Working on: Phase B complete, ready for Phase C
- Last result: All 4 Phase B agents finished, typecheck + build pass

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
