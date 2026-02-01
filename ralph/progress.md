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
4. [x] Wire ContactForm.tsx to POST to `/api/contact` with success/error feedback — DONE (iteration 4)

### Feature 3: Newsletter form → Resend
5. [ ] Create `app/api/newsletter/route.ts` using Resend Contacts/Audiences API — NOT STARTED
6. [ ] Wire NewsletterForm.tsx to POST to `/api/newsletter` with success/error/duplicate feedback — NOT STARTED

## Current
- Working on: Step 5
- Iteration: 4
- Last action: Wired ContactForm.tsx to POST to /api/contact with real fetch. Added error translation keys (errorRateLimit, errorGeneric) to all 4 language files. Removed mock setTimeout.
- Last result: Success — typecheck and build pass.

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
