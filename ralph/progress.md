# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

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
