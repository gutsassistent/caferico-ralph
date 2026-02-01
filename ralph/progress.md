# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

---

## Plan
1. [x] Map WooCommerce attributes to filter categories (type/format/form) in `types/product.ts` or a helper, then make filters actually filter results in `components/ShopCatalog.tsx`. Depends on: none. Test: apply filters → product count changes as expected. — DONE (iteration 1)
2. [ ] Contact form → Resend: Create API route `app/api/contact/route.ts`, wire ContactForm to POST to it, add server-side validation and rate limiting. Test: form submits, email sent via Resend, success/error feedback shown. — NOT STARTED
3. [ ] Newsletter form → Resend: Create API route `app/api/newsletter/route.ts`, wire newsletter form to POST, use Resend Contacts/Audiences API, handle duplicates. Test: form submits, contact saved, duplicate handled gracefully. — NOT STARTED

## Current
- Working on: Step 2 — Contact form → Resend
- Iteration: 2
- Last action: Updated plan with steps 2 and 3
- Last result: Plan updated

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
