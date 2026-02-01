# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

---

## Plan

### Feature 1: Shop filters aansluiten
1. [x] Wire selectedTypes, selectedFormats, selectedForms into filteredProducts useMemo in ShopCatalog.tsx — DONE (iteration 1)
2. [ ] Verify Product type has type/weight/form fields; add or map from WooCommerce attributes if missing — NOT STARTED

### Feature 2: Contact form → Resend
3. [ ] Create `app/api/contact/route.ts` with Resend email sending + server-side validation — NOT STARTED
4. [ ] Wire ContactForm.tsx to POST to `/api/contact` with success/error feedback — NOT STARTED

### Feature 3: Newsletter form → Resend
5. [ ] Create `app/api/newsletter/route.ts` using Resend Contacts/Audiences API — NOT STARTED
6. [ ] Wire NewsletterForm.tsx to POST to `/api/newsletter` with success/error/duplicate feedback — NOT STARTED

## Current
- Working on: Step 2
- Iteration: 1
- Last action: Wired selectedTypes/selectedFormats/selectedForms into filteredProducts useMemo, matching against product.attributes
- Last result: Success — filters now apply AND-logic using WooCommerce attribute lookups (type/soort, weight/gewicht, form/vorm/maalgraad)

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
