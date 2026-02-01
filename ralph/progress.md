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

## Senior Review v2 — 2026-02-01

The plan was rewritten to address the priority issue. Now targets P0 launch blockers. Much better. Review below.

### ✅ Priority is correct now

Plan covers all P0 items from the audit: webhook idempotency, rate limiting, webhook secret, CSRF, contact form, newsletter form, shop filters, cookie consent, legal pages. Good.

### ⚠️ Step 2: fix-api-metadata is already merged

PR #2 (`ralph/fix-api-metadata`) was merged to main on 2026-01-30. The branch still exists as a remote but the changes are in main. This step is a no-op — remove it to avoid confusion.

**Fix:** Delete step 2, renumber.

### ⚠️ Step 8: In-memory rate limiting won't survive restarts

"Simple in-memory token bucket per IP" has the same problem as the in-memory idempotency Set we're fixing in step 3-4. On Coolify redeploy, all rate limit state is lost. For a checkout endpoint this is acceptable short-term (attack window is small per restart), but document this as a known limitation.

Also: no mention of what happens behind Coolify's Traefik reverse proxy — all requests may appear to come from the same IP. Need to check for `X-Forwarded-For` header.

**Fix:** Add note about X-Forwarded-For extraction. Add TODO comment for persistent rate limiting (Redis) post-launch.

### ⚠️ Steps 9 + 11: Resend domain verification

Contact form uses `from: 'Caferico <noreply@caferico.be>'`. Resend requires domain verification for custom from addresses. Is caferico.be verified in Resend? If not, emails will fail silently or use Resend's default domain.

The magic link auth likely already has this configured — but verify before assuming.

**Fix:** Add prerequisite check: "Confirm caferico.be domain is verified in Resend, or use the same from address as magic links."

### ⚠️ Step 11: Newsletter via Resend is underspecified

"Send newsletter signups via Resend" — but Resend is a transactional email service, not a subscriber list manager. The plan says `NEWSLETTER_EMAIL_TO` env var, which suggests it just emails someone "hey, X signed up". That works but:
- No subscriber list is maintained
- No way to send actual newsletters later
- No duplicate detection ("already subscribed" from acceptance criteria can't work without a list)

The acceptance criteria we defined earlier require duplicate detection. That needs either Resend Audiences API or a DB table.

**Fix:** Clarify: either (a) use Resend Audiences/Contacts API to maintain a list + handle duplicates, or (b) store subscribers in a Drizzle table and use Resend only for sending. Option (b) is simpler and more flexible.

### ⚠️ Step 13: Shop filters depend on product data shape

Filters (type/format/form) need corresponding fields on the Product type. Current WooCommerce products may not have structured attributes for "type" (mild/intens/espresso/decaf), "format" (250g/500g), or "form" (beans/ground). If these are WooCommerce attributes, they come as untyped key-value pairs.

**Fix:** Add a sub-step: "Map WooCommerce product attributes to filter categories and add typed accessors to Product type."

### ⚠️ Step 14: Cookie consent is legally incomplete without step 15-16

A cookie banner that says "we use cookies" without linking to a privacy policy is legally meaningless under Belgian/EU law. Steps 14 and 15 are marked independent, but the banner MUST link to the privacy page.

**Fix:** Make step 14 depend on step 15 (at least the route must exist, even with placeholder text).

### ⚠️ Step 17: Too many env changes in one step

Step 17 bundles 5 different env/config changes + a Drizzle push + Google OAuth config. If any one of these breaks, debugging which change caused it is painful.

**Fix:** Split into at least two steps: (a) env vars in Coolify (NEXT_PUBLIC_BASE_URL, MOLLIE_WEBHOOK_TOKEN, CONTACT_EMAIL_TO, NEWSLETTER_EMAIL_TO), (b) Google OAuth redirect URI + Drizzle push.

### ⚠️ Missing: No smoke test step after deployment

After step 17 configures production, and step 18 does UI polish, there's no explicit verification step. "Test: visual QA" on step 18 is not enough — need to verify checkout flow, webhook delivery, contact form sending, and auth flow work in production.

**Fix:** Add step 19: "Production smoke test — verify checkout, webhook, contact, newsletter, auth, and filters on live URL."

### ✅ What's good

- Correct priority (P0 before P2)
- Clear dependency chains with minimal coupling
- Most steps are atomic (one concern per step)
- Testing criteria per step
- Logical ordering: infra/security → functionality → content → polish
- Steps 3-6 (webhook hardening) are well-sequenced

### Summary

Solid P0 plan. Main issues: one dead step (fix-api-metadata already merged), newsletter needs clarification on storage, cookie banner needs privacy page dependency, and the deployment step should be split. Add a production smoke test as the final step. After these fixes, this is ready to execute.

---

## Plan
1. Update `ralph/spec.md` to set “What’s Next” to P0 launch blockers, with explicit Acceptance Criteria and Out of Scope (subscriptions moved to P2). Depends on: none. Test: n/a (doc-only).
2. Apply the `ralph/fix-api-metadata` change set (sanitize HTML/XSS hardening) into mainline. Depends on: none. Test: `npm run typecheck`.
3. Add a persistent webhook idempotency table in `lib/schema.ts` (e.g. `mollie_payments` with UNIQUE `paymentId`). Depends on: none. Test: `npm run typecheck`.
4. Add a tiny idempotency helper (get/insert by paymentId) and wire `app/api/webhook/mollie/route.ts` to use it (remove the in‑memory Set). Depends on: 3. Test: hit webhook twice with same id → second call is a no‑op but still 200.
5. Add `MOLLIE_WEBHOOK_TOKEN` to `.env.example` + `lib/env.ts` validation. Depends on: none. Test: `npm run typecheck`.
6. Append `?token=...` to Mollie `webhookUrl` in `app/api/checkout/route.ts` and verify the token in `app/api/webhook/mollie/route.ts`. Depends on: 5. Test: webhook returns 200 with correct token, 401/200‑ignored with missing token (pick one behavior and assert it).
7. Add CSRF Origin check to `POST /api/checkout` (reject when Origin host ≠ `NEXT_PUBLIC_BASE_URL`). Depends on: none. Test: curl without Origin → 403, browser request → 200.
8. Add rate limiting on `/api/checkout` (simple in‑memory token bucket per IP). Depends on: none. Test: 6 rapid calls → last is 429.
9. Add `app/api/contact/route.ts` to send contact submissions via Resend (new `CONTACT_EMAIL_TO` env var + validation). Depends on: none. Test: POST with sample payload → 200 and email received in test inbox.
10. Wire `components/ContactForm.tsx` to POST to `/api/contact`, showing success/error states. Depends on: 9. Test: submit form UI → success message.
11. Add `app/api/newsletter/route.ts` to send newsletter signups via Resend (new `NEWSLETTER_EMAIL_TO` env var + validation). Depends on: none. Test: POST with email → 200 and email received.
12. Wire `components/NewsletterForm.tsx` to POST to `/api/newsletter`, showing success/error states. Depends on: 11. Test: submit form UI → success message.
13. Make shop filters actually filter results in `components/ShopCatalog.tsx` (map type/format/form filters to product data). Depends on: none. Test: apply filters → product count changes as expected.
14. Add a minimal `CookieConsent` component with localStorage state and wire it into `app/[locale]/layout.tsx`. Depends on: none. Test: banner shows once, dismiss persists on reload.
15. Create `app/[locale]/(pages)/privacy/page.tsx` and `app/[locale]/(pages)/terms/page.tsx` with minimal copy + i18n keys in all locales (placeholders allowed until final text). Depends on: none. Test: routes render in all locales.
16. Replace placeholder copy on Privacy/Cookie + Terms pages with final legal text from Jonathan. Depends on: 15, content from Jonathan. Test: text matches approved copy.
17. Env/config tasks in Coolify: set `NEXT_PUBLIC_BASE_URL`, add `MOLLIE_WEBHOOK_TOKEN`, add `CONTACT_EMAIL_TO` + `NEWSLETTER_EMAIL_TO`, configure Google OAuth redirect URI, and run `drizzle push` as post‑deploy. Depends on: 5, 9, 11. Test: Mollie webhook calls succeed in production; auth redirect works.
18. UI polish for launch (contrast + product photo backgrounds), once legal/security blockers are done. Depends on: 1–17. Test: visual QA at 375px/768px/1024px.

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
