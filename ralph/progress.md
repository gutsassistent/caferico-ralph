# Progress

## Completed Phases

- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE
- [x] Webhook/checkout security (Track A) — DONE
- [x] Privacy/terms pages + cookie consent (Track E) — DONE

---

## Plan — UI/UX Polish (Split-Mode)

This plan is structured for "waves" of 2–4 parallel agents while keeping merge conflicts low.
Rule of thumb: each step targets a small, testable change (<= ~50 LOC or isolated file additions) and ends with `npm run typecheck` + `npm run build`.

### Phase A: Foundation (MUST be first; solo)

Dependencies: none. All split-mode steps depend on these tokens/utilities.

- [x] 1. Add light-body tokens to Tailwind — add `parchment: '#F7F0E7'`, `ink: '#2C1810'`, `inkMuted: '#5A3E33'` to `tailwind.config.ts` (single-file change) — DONE (iteration 1)
- [x] 2. Add matching CSS vars + update `color-scheme` — add `--color-parchment`/`--color-ink`/`--color-ink-muted` and set `:root { color-scheme: light dark; }` in `app/globals.css` — DONE (iteration 2)
- [ ] 3. Add global split-mode + packaging utilities — in `app/globals.css` add `@layer components` utilities: `.section-light`, `.section-dark`, `.pill-roastery` (packaging cue base)

---

## Current

- Working on: Step 3
- Iteration: 2
- Last action: Added --color-parchment/--color-ink/--color-ink-muted CSS vars and updated color-scheme to "light dark" in globals.css
- Last result: typecheck + build pass

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
