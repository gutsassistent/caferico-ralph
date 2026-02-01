# Task: Analyze 5 PRs and determine optimal merge strategy

## Context
We have 5 PRs for the caferico-ralph project, all targeting main. They were built in parallel by separate agents in git worktrees. The problem: some agents exceeded their scope and built overlapping features.

## The PRs
- **PR #5** (Track A): Webhook/checkout security — idempotency, CSRF, rate limiting, webhook token
- **PR #6** (Track D): Was supposed to be ONLY shop filters, but also built contact form + newsletter
- **PR #7** (Track B): Contact form API + frontend wiring
- **PR #8** (Track E): Privacy/terms pages + cookie consent banner
- **PR #9** (Track C): Was supposed to be ONLY newsletter, but also built shop filters + contact form + newsletter

## Known overlaps
- `app/api/contact/route.ts` — exists in PR #6, #7, #9 (three different implementations!)
- `components/ContactForm.tsx` — modified in PR #6, #7, #9
- `components/NewsletterForm.tsx` — modified in PR #6, #9
- `app/api/newsletter/route.ts` — exists in PR #6, #9
- `components/ShopCatalog.tsx` — modified in PR #6, #9
- `messages/*.json` — modified in PR #6, #7, #8, #9
- `package.json` / `package-lock.json` — modified in PR #5, #6, #7, #9
- `lib/schema.ts` — only PR #5 (no overlap here, good)

## Two proposed merge strategies

### Option 1: Merge #5, #7, #8 first, then cherry-pick from #6
- Merge #5 (security, clean, no overlap)
- Merge #7 (contact form only)
- Merge #8 (legal pages + cookies)
- From #6: cherry-pick only shop filter + newsletter commits, skip contact form commit
- Drop #9 entirely

### Option 2: Merge #5, #6, #8, drop #7 and #9
- Merge #5 (security)
- Merge #6 (shop filters + contact + newsletter — most features in one PR)
- Merge #8 (legal + cookies)
- Drop #7 and #9 entirely

## Your job
1. Read ALL 5 diff files thoroughly
2. Compare the overlapping implementations (contact form in #6 vs #7 vs #9, newsletter in #6 vs #9, shop filters in #6 vs #9)
3. Rate each implementation on: code quality, error handling, validation, i18n completeness, acceptance criteria adherence
4. Determine which merge strategy minimizes conflicts AND results in the best code
5. If neither option 1 nor 2 is optimal, propose option 3
6. Write your recommendation with specific justification

## Diff files
The diff files are in this directory:
- pr5-track-a.diff
- pr6-track-d.diff
- pr7-track-b.diff
- pr8-track-e.diff
- pr9-track-c.diff

## Acceptance criteria (for reference)

### Shop filters:
- Type/format/form filters actually filter products
- Filters combine with AND logic
- Result count updates live
- Reset button works

### Contact form:
- POST to /api/contact
- Email arrives at Caferico via Resend
- Reply-to = visitor email
- Server-side validation
- Rate limiting: max 3 per IP per hour

### Newsletter:
- POST to /api/newsletter
- Stored via Resend Contacts API (or DB table)
- Duplicate detection (no error, "already subscribed" message)
- Success/error feedback in UI
