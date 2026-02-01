# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

---

## Plan
1. [x] Add `app/api/contact/route.ts` to send contact submissions via Resend (new `CONTACT_EMAIL_TO` env var + validation). Depends on: none. Test: POST with sample payload → 200 and email received in test inbox. — DONE (iteration 1)
2. [ ] Wire `components/ContactForm.tsx` to POST to `/api/contact`, showing success/error states. Depends on: 1. Test: submit form UI → success message. — NOT STARTED

## Current
- Working on: Step 1 complete
- Iteration: 1
- Last action: Created app/api/contact/route.ts with Resend integration, validation, rate limiting
- Last result: typecheck + build pass

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
