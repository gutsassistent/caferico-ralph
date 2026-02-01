# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

---

## Plan
1. [x] Map WooCommerce attributes to filter categories (type/format/form) in `types/product.ts` or a helper, then make filters actually filter results in `components/ShopCatalog.tsx`. Depends on: none. Test: apply filters → product count changes as expected. — DONE (iteration 1)

## Current
- Working on: Step 1 complete
- Iteration: 1
- Last action: Wired type/format/form filters to filteredProducts useMemo in ShopCatalog.tsx
- Last result: Typecheck and build pass. Filters now use product.attributes to match against selectedTypes (mild/intens/espresso/decaf), selectedFormats (250g/500g), and selectedForms (beans/ground) with AND logic. Added helper functions getProductAttr and matchesFilter that search WooCommerce attributes by multiple possible attribute names (NL/EN).

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
