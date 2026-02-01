# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

## Senior Review — 2026-02-01

### ⛔ Wrong priority: This plan builds Subscriptions (P2) while P0 blockers are open

The AUDIT-2026-01-31.md defines subscriptions as P2 (post-launch). Meanwhile these P0 items block launch:
- Webhook idempotency (in-memory Set, lost on restart)
- Rate limiting on /api/checkout
- Webhook secret token
- CSRF check on checkout POST
- Contact form backend (console.log)
- Shop filters (pure UI, filter nothing)
- Newsletter form backend (console.log)

**Recommendation:** Either explicitly promote subscriptions to the current phase (and update the audit), or tackle P0 first. Building P2 while P0 is open means launch keeps sliding.

### ⚠️ Step 1 is overloaded

Step 1 asks the agent to "define the next phase in spec.md" AND make decisions about subscription scope (login required? guest? cancel/pause? WC order creation?). These are product decisions that need Jonathan's input, not agent decisions. The agent will either guess wrong or block.

**Fix:** Split into: (a) Jonathan decides scope, (b) agent writes spec.md.

### ⚠️ Steps 2-3 can't be verified meaningfully

Steps 2 (type definitions) and 3 (i18n keys) both say "Test: npm run typecheck". Typecheck confirms syntax, not correctness. The real risk is defining subscription catalog fields that don't match Mollie's API shape or WooCommerce product structure.

**Fix:** Step 2 should include a brief sanity check against Mollie Subscriptions API docs (interval format, amount shape, metadata limits).

### ⚠️ Step 4: schema migration without rollback plan

Adding Drizzle tables is fine, but there's no mention of how to handle migration on the live Coolify deployment. Currently `drizzle push` runs as post-deployment command. If the schema is wrong, there's no rollback.

**Fix:** Add explicit step: "test migration on a fresh DB before pushing to production schema."

### ⚠️ Steps 6-7: Mollie customer creation assumes auth is solid

`getOrCreateMollieCustomer` depends on having a reliable userId. But the audit notes Google OAuth redirect URI isn't configured yet, and auth on checkout/status is P1. If auth is flaky, subscription customer mapping breaks silently.

**Fix:** Add prerequisite: "Verify auth flow works end-to-end (magic link + Google OAuth) before building subscription customer mapping."

### ⚠️ Step 8 + 10-11: Two separate checkout forms

The existing checkout already has an address form (`CheckoutForm`). Now step 10-11 builds a second `SubscriptionCheckoutForm` with overlapping fields. This creates:
- Duplicate validation logic
- Duplicate address handling
- Divergent UX between one-time and subscription checkout

**Fix:** Extract shared address fields into a reusable component first, then compose both checkout flows from it.

### ⚠️ Step 15: Webhook without idempotency

The plan adds a NEW webhook endpoint (`/api/webhook/mollie-subscription`) while the EXISTING webhook (`/api/webhook/mollie`) still uses an in-memory Set for idempotency (P0 bug). Now there are two webhook endpoints, both without persistent idempotency.

**Fix:** Solve webhook idempotency ONCE (Drizzle table with UNIQUE on paymentId) before adding more webhook endpoints. Then both use the same mechanism.

### ⚠️ Step 16: WooCommerce order creation is underspecified

"Helper to map plan → WC product IDs and create orders" — but the WC product structure for subscriptions isn't defined. Are there WC products for each tier? Do they exist already? Who creates them? What about stock management?

**Fix:** Add prerequisite step: "Verify/create WC subscription products and document their IDs."

### ⚠️ Missing: No error handling strategy

17 steps, zero mention of what happens when Mollie API calls fail, when the DB is unreachable, when webhook delivery is delayed, or when a "first" payment expires before the subscription is created. Mollie's async nature means every step after 7 can fail silently.

**Fix:** Add a step between 7 and 8: "Define error states and their UI/recovery paths."

### ⚠️ Parallel execution risk

Steps 2 and 3 are marked as independent (both depend on 1 only), but they both modify the same conceptual domain (subscription data shape). If two agents run these in parallel, they may make conflicting assumptions about field names, tier structure, or i18n key naming.

**Fix:** Make 3 depend on 2 (i18n keys should mirror the type definitions).

### ✅ What's good

- Clear dependency chain per step
- Each step is testable (even if the test could be stronger)
- Separation of Mollie helpers from API routes is clean
- Account UI is correctly scoped as last step (read-only first)

### Summary

This is a solid subscription implementation plan that's in the **wrong slot on the roadmap**. The dependency chain is mostly correct but underestimates the prerequisite work (auth stability, webhook idempotency, shared form components). Recommend: either pivot this to a P0 plan, or park it and tackle launch blockers first.

---

## Plan
1. Define the next phase in `ralph/spec.md` (set “What’s Next”, Acceptance Criteria, Out of Scope). Include explicit decisions for subscription scope: require login or guest, which coffee/roast options are supported, whether recurring payments must create WooCommerce orders, and whether self‑service cancel/pause is in-scope. Depends on: none. Test: n/a (doc-only).
2. Add typed subscription catalog (`types/subscription.ts`, `data/subscriptions.ts`) containing plan IDs, tier labels, interval, price, and product slug(s) or IDs to fulfill. Keep it minimal but complete for Mollie + WooCommerce mapping. Depends on: 1. Test: `npm run typecheck`.
3. Add minimal i18n keys required for the subscription checkout/return flow (CTA, form labels, validation errors, status messages) across `messages/*.json`, keeping the set small enough for one iteration. Depends on: 1. Test: `npm run typecheck`.
4. Extend `lib/schema.ts` with tables to persist Mollie customer/subscription mappings (userId, mollieCustomerId, mollieSubscriptionId, planId, status, createdAt/updatedAt). Document any migration steps in `README.md` if needed. Depends on: 1. Test: `npm run typecheck`.
5. Add a small data-access helper (`lib/subscription-store.ts`) with functions to upsert Mollie customer IDs and subscription records for a user, plus a getter for active subscription by userId. Depends on: 4. Test: `npm run typecheck`.
6. Add Mollie helper `getOrCreateMollieCustomer` in `lib/mollie-subscriptions.ts` that checks the store first, then calls Mollie Customers API, and persists the mapping. Depends on: 5. Test: `npm run typecheck`.
7. Add Mollie helper `createSubscriptionFirstPayment` in `lib/mollie-subscriptions.ts` that builds a “first” payment using plan catalog data, includes metadata (planId, groupId, customer address, userId, wcCustomerId), and returns checkoutUrl. Depends on: 2, 6. Test: manual dev call with test key (expect checkout URL).
8. Create API route `POST /api/subscriptions/start` to validate input (plan/group, address fields), require auth session, call `createSubscriptionFirstPayment`, and return checkoutUrl. Depends on: 7. Test: curl or UI submit (expect 401 when logged out, 200 with checkoutUrl when logged in).
9. Add a new page `app/[locale]/(pages)/subscriptions/checkout/page.tsx` that reads plan/group from query params, loads plan details from the catalog, and renders a placeholder checkout form + summary. Depends on: 2, 8. Test: navigate to `/subscriptions/checkout?plan=starter&group=beans`.
10. Create `components/SubscriptionCheckoutForm.tsx` with name + email fields, minimal validation, and submit handler that calls `/api/subscriptions/start`. Keep it lightweight for the first iteration. Depends on: 8, 9. Test: submit valid/invalid email and verify client validation + API error display.
11. Extend `SubscriptionCheckoutForm` with address fields (street, postal code, city, country, phone), validation rules (reuse patterns from `CheckoutForm`), and prefill from `/api/account` when authenticated. Depends on: 10. Test: prefill when logged in; validation errors when fields are missing.
12. Update `components/SubscriptionTierCard.tsx` to link into the new checkout flow (deep link with plan/group), and if unauthenticated, route to `/login?callbackUrl=...` preserving plan selection. Depends on: 9. Test: click plan buttons logged in/out.
13. Add `GET /api/subscriptions/status` (modeled after checkout status) to fetch Mollie payment status by id and normalize to `paid | pending | failed | canceled | expired`. Depends on: 7. Test: `curl /api/subscriptions/status?id=tr_xxx` with invalid/valid IDs.
14. Add `app/[locale]/(pages)/subscriptions/return/page.tsx` and a small return component to show subscription setup status using the status API, with CTA back to account/subscriptions on success. Depends on: 13. Test: visit return page with a mock id and verify status UI.
15. Add webhook `POST /api/webhook/mollie-subscription` that verifies Mollie payment status, creates a Mollie subscription for paid “first” payments, and persists subscription IDs/status in the store. Depends on: 5, 7. Test: call webhook with a paid payment id in test mode and verify DB updates/logs.
16. Add WooCommerce order creation for subscription payments: helper to map plan → WC product IDs and create orders; update webhook to create an order for the first payment (and recurring payments when `payment.subscriptionId` is present). Depends on: 2, 15. Test: simulate paid payment webhook and verify WC order creation.
17. Add account UI + API to surface subscription status (and optionally cancel) in the account page. Keep scope minimal (read-only status if cancel is out-of-scope). Depends on: 15. Test: view account while having a subscription record.

## Current
- Working on: Awaiting next phase definition
- Iteration: 0
- Last action: Initialized Ralph v2
- Last result: Ready

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
