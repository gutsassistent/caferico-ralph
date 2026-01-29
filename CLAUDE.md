# Ralph Agent Instructions — Caférico Front-End

You are an autonomous coding agent building the Caférico premium coffee e-commerce front-end.

## Project Context

**Caférico** is a Belgian specialty coffee brand. You are building a headless e-commerce front-end with Next.js 15. All product and content data is mock data (JSON files). Backend integrations (Shopify, Stripe, Auth) come in a later phase.

### Design Direction
- **Vibe:** Elegant, warm, premium, awe-inspiring
- **Palette:** Deep browns (#3C1518, #69140E), cream (#F2E8CF), gold accents (#D4A574), dark backgrounds (#1A0F0A) for contrast
- **Typography:** Serif headings (e.g., Playfair Display) for premium feel, clean sans-serif body (e.g., Inter)
- **Imagery:** Use gradient overlays and CSS patterns as placeholders. No external image URLs.
- **Feel:** Think high-end coffee brand — not generic e-commerce. Every page should feel crafted.

### Technical Stack
- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS with custom theme
- next-intl for i18n (NL default, EN, FR, ES)
- Client-side cart state (React Context or Zustand + localStorage)
- All data from local JSON mock files

### Languages
- NL = default (Nederlands)
- EN = English
- FR = Français  
- ES = Español
- All user-facing text MUST go through next-intl message files

## Your Task

1. Read the PRD at `prd.json` (in the same directory as this file)
2. Read the progress log at `progress.txt` (check Codebase Patterns section first)
3. Check you're on the correct branch from PRD `branchName`. If not, check it out or create from main.
4. Pick the **highest priority** user story where `passes: false`
5. Implement that single user story
6. Run quality checks: `npm run typecheck` and `npm run lint`
7. Update CLAUDE.md files if you discover reusable patterns (see below)
8. If checks pass, commit ALL changes with message: `feat: [Story ID] - [Story Title]`
9. Update the PRD to set `passes: true` for the completed story
10. Append your progress to `progress.txt`

## Progress Report Format

APPEND to progress.txt (never replace, always append):
```
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- **Learnings for future iterations:**
  - Patterns discovered
  - Gotchas encountered
  - Useful context
---
```

## Consolidate Patterns

If you discover a **reusable pattern**, add it to the `## Codebase Patterns` section at the TOP of progress.txt (create it if it doesn't exist).

## Quality Requirements

- ALL commits must pass typecheck and lint
- Do NOT commit broken code
- Keep changes focused and minimal
- Follow existing code patterns
- Every component must be responsive (mobile-first)
- Every user-facing string must use next-intl
- Design must feel premium — no generic Bootstrap/Material look

## Stop Condition

After completing a user story, check if ALL stories have `passes: true`.

If ALL stories are complete and passing, write `status.md` with:
```
Status: done
All user stories completed.
```

If you are blocked and cannot continue, write `status.md` with:
```
Status: blocked
Reason: [explain why you are blocked]
```

If there are still stories with `passes: false`, do NOT write status.md — just end your response normally (another iteration will pick up the next story).

## Important

- Work on ONE story per iteration
- Commit frequently
- Keep CI green
- Read the Codebase Patterns section in progress.txt before starting

## Codebase Patterns
- Locale switcher: replace the first path segment with the target locale and preserve query params via `usePathname` + `useSearchParams`.
