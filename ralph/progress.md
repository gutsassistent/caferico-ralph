# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

---

## Plan
1. [x] Map WooCommerce attributes to filter categories (type/format/form) in `types/product.ts` or a helper, then make filters actually filter results in `components/ShopCatalog.tsx`. Depends on: none. Test: apply filters → product count changes as expected. — DONE (iteration 1)
2. [x] Contact form → Resend: Create API route `app/api/contact/route.ts`, wire ContactForm to POST to it, add server-side validation and rate limiting. Test: form submits, email sent via Resend, success/error feedback shown. — DONE (iteration 2)
3. [x] Newsletter form → Resend: Create API route `app/api/newsletter/route.ts`, wire newsletter form to POST, use Resend Contacts/Audiences API, handle duplicates. Test: form submits, contact saved, duplicate handled gracefully. — DONE (iteration 3)

## Current
- Working on: All steps complete
- Iteration: 3
- Last action: Created /api/newsletter route using Resend Contacts API (audienceId from env). Updated NewsletterForm to POST to /api/newsletter with error handling and rate limiting (5/IP/hr). Added errorRateLimit translations (NL/EN/FR/ES). Duplicates handled gracefully by Resend (returns existing contact).
- Last result: Typecheck and build pass.

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
