# 2026-06-17 — Initial build

## Summary

Built the calorie tracker from an empty folder (only `.env` + `.gitignore` existed)
to a fully working single-page app running at http://localhost:3000. Verified with a
production build (`next build` compiles, lints, and type-checks cleanly) and a live
dev server returning HTTP 200.

## What was built

- **Scaffold**: Next.js 14 (App Router) + TypeScript (strict) + Tailwind CSS 3.
  Config: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`,
  `tailwind.config.ts`, `next-env.d.ts`.
- **Domain logic** (`lib/`, `hooks/`):
  - `lib/types.ts` — `Food`, `LogEntry`, `Totals` interfaces.
  - `lib/foods.ts` — static catalog of 26 common foods with per-serving
    calories + macros + serving size.
  - `hooks/useFoodLog.ts` — owns log state; add/remove/clear; derives totals;
    hydrates from and persists to `localStorage`.
- **App shell** (`app/`): root layout + metadata, Tailwind globals, and a single
  client-component page composing the UI.
- **Components** (`components/`): `CalorieSummary`, `FoodSearch`, `FoodCard`,
  `DailyLog`, `LogEntryRow`.
- **Docs**: `CLAUDE.md` (project overview) and this decision log.

## Technical choices & rationale

### Persistence: `localStorage` (not IndexedDB / SQLite / a server DB)
The requirement was a "local database" that persists across refreshes for a
backendless, no-accounts single-page app. The data is a small flat array of log
entries. `localStorage` is durable across refreshes/restarts, requires zero
dependencies or async plumbing, and is trivially serializable as JSON. IndexedDB
would add async complexity with no benefit at this scale; a server DB would violate
the "no backend / no login" constraint.

### Single client-component page (not RSC + route handlers)
All state is local and interactive (search input, log mutations, `localStorage`).
There is no server-side data to fetch, so a `"use client"` page is the simplest
correct choice. Server Components / API routes would add ceremony with nothing to do.

### Hydration guard in `useFoodLog`
`localStorage` is unavailable during SSR. The hook starts with an empty array, then
loads real data in a mount `useEffect` and flips a `hydrated` flag. The persist
effect is gated on `hydrated` so the initial empty state never overwrites saved data
before the first read. Storage reads/writes are wrapped in try/catch to tolerate
private-mode / quota errors.

### Food snapshot stored in each `LogEntry`
Each entry embeds a copy of the `Food` rather than referencing it by id. The log
stays accurate even if the catalog's numbers change later, and rendering a log row
needs no catalog lookup.

### Static in-code food catalog
The 26 seed foods live in `lib/foods.ts` as plain data. No DB or API is needed to
serve a fixed reference list, and it keeps the app fully offline-capable.

### App Router over Pages Router
App Router is the current Next.js default and the recommended path for new projects.

## Notable events

- `npm install` initially pulled `next@14.2.5`, which npm flagged with a security
  vulnerability (advisory dated 2025-12-11). Upgraded to `next@^14.2.33`
  (resolved to `14.2.35`) before verifying. Remaining `npm audit` items are
  transitive/dev and not on the runtime critical path.

## Verification performed

- `npm run build` → compiled successfully, lint + type-check passed, 4 static pages.
- `npm run dev` → "Ready in 2.1s"; `curl localhost:3000` → HTTP 200, page title
  "Calorie Tracker" present in the HTML.

## Possible next steps

- Editable quantities / servings per entry.
- Daily calorie goal + progress indicator.
- Per-day history grouped by date instead of one rolling list.
- User-defined custom foods.
- Gemini-powered natural-language food entry (placeholder key already in `.env`).
