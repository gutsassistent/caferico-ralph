# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

---

## Plan

### Feature 1: Shop filters aansluiten
1. [x] Wire selectedTypes, selectedFormats, selectedForms into filteredProducts useMemo in ShopCatalog.tsx — DONE (iteration 1)
2. [x] Verify Product type has type/weight/form fields; add or map from WooCommerce attributes if missing — DONE (iteration 2)

### Feature 2: Contact form → Resend
3. [x] Create `app/api/contact/route.ts` with Resend email sending + server-side validation — DONE (iteration 3)
4. [ ] Wire ContactForm.tsx to POST to `/api/contact` with success/error feedback — NOT STARTED

### Feature 3: Newsletter form → Resend
5. [ ] Create `app/api/newsletter/route.ts` using Resend Contacts/Audiences API — NOT STARTED
6. [ ] Wire NewsletterForm.tsx to POST to `/api/newsletter` with success/error/duplicate feedback — NOT STARTED

## Current
- Working on: Step 4
- Iteration: 3
- Last action: Created app/api/contact/route.ts with Resend email sending, server-side validation (required fields + email format), and in-memory rate limiting (3 req/IP/hour). Installed resend package. Lazy-initialized Resend client to avoid build-time errors without API key.
- Last result: Success — typecheck and build pass.

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
