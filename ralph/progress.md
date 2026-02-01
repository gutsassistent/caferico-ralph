# Progress

## Completed Phases
- [x] Redesign (42/42 stories) — DONE
- [x] Mollie checkout integratie — DONE
- [x] Code quality audit — DONE

---

## Plan
<<<<<<< HEAD
1. [x] Add a persistent webhook idempotency table in `lib/schema.ts` (e.g. `mollie_payments` with UNIQUE `paymentId`). Depends on: none. Test: `npm run typecheck`. — DONE (iteration 1)
2. [x] Add a tiny idempotency helper (get/insert by paymentId) and wire `app/api/webhook/mollie/route.ts` to use it (remove the in‑memory Set). Depends on: 1. Test: hit webhook twice with same id → second call is a no‑op but still 200. — DONE (iteration 2)
3. [x] Add `MOLLIE_WEBHOOK_TOKEN` to `.env.example` + `lib/env.ts` validation. Depends on: none. Test: `npm run typecheck`. — DONE (iteration 3)
4. [x] Append `?token=...` to Mollie `webhookUrl` in `app/api/checkout/route.ts` and verify the token in `app/api/webhook/mollie/route.ts`. Depends on: 3. Test: webhook returns 200 with correct token, 401/200‑ignored with missing token (pick one behavior and assert it). — DONE (iteration 4)
5. [x] Add CSRF Origin check to `POST /api/checkout` (reject when Origin host ≠ `NEXT_PUBLIC_BASE_URL`). Depends on: none. Test: curl without Origin → 403, browser request → 200. — DONE (iteration 5)
6. [x] Add rate limiting on `/api/checkout` (simple in‑memory token bucket per IP using `X-Forwarded-For` when present; document restart limitation). Depends on: none. Test: 6 rapid calls → last is 429. — DONE (iteration 6)

## Current
- Working on: All steps complete
- Iteration: 6
- Last action: Added in-memory token-bucket rate limiter (lib/rate-limit.ts) and wired it into POST /api/checkout — 5 req/IP/60s, returns 429 when exceeded
- Last result: typecheck + build pass
=======
1. [x] Create `app/[locale]/(pages)/privacy/page.tsx` and `app/[locale]/(pages)/terms/page.tsx` with minimal copy + i18n keys in all locales (placeholders allowed until final text). Depends on: none. Test: routes render in all locales. — DONE (iteration 1)
2. [x] Add a minimal `CookieConsent` component with localStorage state and link to `/privacy`, wired into `app/[locale]/layout.tsx`. Depends on: 1. Test: banner shows once, dismiss persists on reload. — DONE (iteration 2)

## Current
- Working on: Step 2 completed
- Iteration: 2
- Last action: Created CookieConsent component with localStorage dismiss, privacy link, i18n keys in all 4 locales, wired into layout
- Last result: typecheck passes, build passes
>>>>>>> origin/emdash/work-agent-e-t5n

## Architecture Decisions
- Database: WooCommerce (headless, one.com)
- Checkout: Mollie hosted checkout with redirect
- Cart: Client-side localStorage via CartProvider
- Styling: Tailwind CSS with custom design tokens
- i18n: next-intl (NL default, EN, FR, ES)
