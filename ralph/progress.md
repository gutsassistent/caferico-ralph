# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

---

## Plan
1. [x] Map WooCommerce attributes to filter categories (type/format/form) in `types/product.ts` or a helper, then make filters actually filter results in `components/ShopCatalog.tsx`. Depends on: none. Test: apply filters → product count changes as expected. — DONE (iteration 1)
2. [x] Contact form → Resend: Create API route `app/api/contact/route.ts`, wire ContactForm to POST to it, add server-side validation and rate limiting. Test: form submits, email sent via Resend, success/error feedback shown. — DONE (iteration 2)
3. [ ] Newsletter form → Resend: Create API route `app/api/newsletter/route.ts`, wire newsletter form to POST, use Resend Contacts/Audiences API, handle duplicates. Test: form submits, contact saved, duplicate handled gracefully. — NOT STARTED

## Current
- Working on: Step 2 complete
- Iteration: 2
- Last action: Created /api/contact route with Resend, server-side validation, rate limiting (3/IP/hr). Updated ContactForm to POST with error handling. Added errorGeneric + errorRateLimit translations (NL/EN/FR/ES).
- Last result: Typecheck and build pass.

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
