# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

---

## Plan
1. Update `ralph/spec.md` to set “What’s Next” to P0 launch blockers, with explicit Acceptance Criteria and Out of Scope (subscriptions moved to P2). Depends on: none. Test: n/a (doc-only).
2. Add a persistent webhook idempotency table in `lib/schema.ts` (e.g. `mollie_payments` with UNIQUE `paymentId`). Depends on: none. Test: `npm run typecheck`.
3. Add a tiny idempotency helper (get/insert by paymentId) and wire `app/api/webhook/mollie/route.ts` to use it (remove the in‑memory Set). Depends on: 2. Test: hit webhook twice with same id → second call is a no‑op but still 200.
4. Add `MOLLIE_WEBHOOK_TOKEN` to `.env.example` + `lib/env.ts` validation. Depends on: none. Test: `npm run typecheck`.
5. Append `?token=...` to Mollie `webhookUrl` in `app/api/checkout/route.ts` and verify the token in `app/api/webhook/mollie/route.ts`. Depends on: 4. Test: webhook returns 200 with correct token, 401/200‑ignored with missing token (pick one behavior and assert it).
6. Add CSRF Origin check to `POST /api/checkout` (reject when Origin host ≠ `NEXT_PUBLIC_BASE_URL`). Depends on: none. Test: curl without Origin → 403, browser request → 200.
7. Add rate limiting on `/api/checkout` (simple in‑memory token bucket per IP using `X-Forwarded-For` when present; document restart limitation). Depends on: none. Test: 6 rapid calls → last is 429.
8. Add `app/api/contact/route.ts` to send contact submissions via Resend (new `CONTACT_EMAIL_TO` env var + validation). Depends on: none. Test: POST with sample payload → 200 and email received in test inbox.
9. Wire `components/ContactForm.tsx` to POST to `/api/contact`, showing success/error states. Depends on: 8. Test: submit form UI → success message.
10. Add newsletter persistence: create a `newsletter_subscribers` table in `lib/schema.ts` with UNIQUE email and timestamps. Depends on: none. Test: `npm run typecheck`.
11. Add `app/api/newsletter/route.ts` to upsert subscriber email and send a confirmation to `NEWSLETTER_EMAIL_TO` via Resend. Depends on: 10. Test: POST with email → 200; second POST → 200 with “already subscribed”.
12. Wire `components/NewsletterForm.tsx` to POST to `/api/newsletter`, showing success/error states. Depends on: 11. Test: submit form UI → success message.
13. Map WooCommerce attributes to filter categories (type/format/form) in `types/product.ts` or a helper, then make filters actually filter results in `components/ShopCatalog.tsx`. Depends on: none. Test: apply filters → product count changes as expected.
14. Create `app/[locale]/(pages)/privacy/page.tsx` and `app/[locale]/(pages)/terms/page.tsx` with minimal copy + i18n keys in all locales (placeholders allowed until final text). Depends on: none. Test: routes render in all locales.
15. Add a minimal `CookieConsent` component with localStorage state and link to `/privacy`, wired into `app/[locale]/layout.tsx`. Depends on: 14. Test: banner shows once, dismiss persists on reload.
16. Replace placeholder copy on Privacy/Cookie + Terms pages with final legal text from Jonathan. Depends on: 14, content from Jonathan. Test: text matches approved copy.
17. Coolify env/config (part 1): set `NEXT_PUBLIC_BASE_URL`, `MOLLIE_WEBHOOK_TOKEN`, `CONTACT_EMAIL_TO`, `NEWSLETTER_EMAIL_TO`. Depends on: 4, 8, 11. Test: Mollie webhook calls succeed in production; contact/newsletter emails send.
18. Coolify env/config (part 2): configure Google OAuth redirect URI + run `drizzle push` as post‑deploy. Depends on: 10. Test: auth redirect works; DB migration succeeds.
19. UI polish for launch (contrast + product photo backgrounds), once legal/security blockers are done. Depends on: 1–18. Test: visual QA at 375px/768px/1024px.
20. Production smoke test: checkout (incl. webhook), auth login, contact, newsletter, shop filters, cookie banner, and legal pages on live URL. Depends on: 17–19. Test: all flows pass on production.

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
