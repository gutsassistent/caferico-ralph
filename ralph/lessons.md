# Lessons

<!-- Migrated from progress.txt (Ralph v1) — key learnings from previous phases -->

- DO NOT use CSS modules or inline styles — Tailwind only, project convention
- DO NOT hardcode text — everything through next-intl, even button labels
- DO NOT add dependencies without explicit need — keep bundle small
- DO use real images from CONTEXT.md section 5 — not placeholders
- DO run `npm run typecheck` AND `npm run build` — TypeScript errors aren't always caught by build alone
- DO check mobile (375px) first — mobile-first is a hard rule
- DO NOT break cart, routing, i18n, or navigation when adding features
- Container component was removed — use manual `max-w-7xl` instead
- Language switcher is custom dropdown, not native `<select>`
- Cart uses localStorage via CartProvider/CartDrawer — don't introduce server-side cart state
- DO NOT instantiate Resend at module level — it throws without RESEND_API_KEY at build time. Use a lazy getter function instead (discovered iteration 3)
