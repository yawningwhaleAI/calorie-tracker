# Calorie Tracker

A production-quality, single-page nutrition tracker. Search a food catalog, describe
a meal in plain English, or upload a photo — Gemini AI handles the nutrition lookup.
Entries are grouped by meal, totals update live, and everything persists locally.
No login, no backend, no database server required.

## How to run

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint check
```

Requires `GEMINI_API_KEY` in `.env`.

## What it does

- **Quick Add** — filter a 26-food catalog; quantity multiplier scales macros before logging
- **Describe It** — type a meal description; Gemini returns calories + macros to confirm
- **Photo** — upload a meal photo; Gemini identifies each food separately with individual Add buttons
- **Meal categories** — Breakfast / Lunch / Dinner / Snack (auto-selected by time of day); log is grouped and subtotaled by category
- **Daily calorie goal** — editable inline (default 2000 kcal); animated progress bar turns amber at 75%, red when over
- **Macro bar** — stacked protein / carbs / fat bar by caloric contribution
- **Persistence** — `localStorage`; log and goal survive refreshes

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 + custom `warm`/`ember` palette |
| Fonts | Playfair Display (display), DM Sans (UI) via `next/font/google` |
| AI | Google Gemini 2.5 Flash Lite (`@google/genai`) |
| Persistence | `localStorage` |

## Folder structure

```
app/
  layout.tsx              # Root layout, font loading
  page.tsx                # Main page — owns log + goal state, category selector
  globals.css             # Tailwind directives, font variables
  api/nutrition/
    text/route.ts         # POST /api/nutrition/text
    image/route.ts        # POST /api/nutrition/image
components/
  CalorieSummary.tsx      # Dark hero banner, goal progress, macro bar
  FoodSearch.tsx          # Quick Add tab
  FoodCard.tsx            # Food card with quantity multiplier
  AiTextSearch.tsx        # Describe It tab
  AiImageSearch.tsx       # Photo tab
  DailyLog.tsx            # Meal-grouped log
  LogEntryRow.tsx         # Single log entry row
hooks/
  useFoodLog.ts           # Log + goal state, localStorage sync
lib/
  types.ts                # Food, LogEntry, MealCategory, Totals, helpers
  foods.ts                # 26-food static catalog
  gemini.ts               # Gemini client, schemas, prompts
docs/                     # Dated decision logs
PLAN.md                   # What we built, improved, and where it's going
```

## API routes

```bash
# Text lookup
curl -X POST http://localhost:3000/api/nutrition/text \
  -H "Content-Type: application/json" \
  -d '{"query":"grilled chicken with rice"}'

# Image lookup
curl -X POST http://localhost:3000/api/nutrition/image \
  -F "image=@meal.jpg"
```

Both return: `{ name, servingSize, calories, protein, carbs, fat }`
Image route returns: `{ items: [...] }`

## Next steps

- **Deploy to Vercel** — `vercel deploy`; add `GEMINI_API_KEY` in project settings
- **Food history charts** — weekly calorie line chart + macro area chart (Recharts)
- **Barcode scanning** — Open Food Facts API + device camera via `getUserMedia`
- **User preferences** — custom macro targets, saved meal templates
- **Per-day history** — browseable log grouped by date
- **PWA** — service worker + manifest for home-screen install on mobile
- **Cloud sync** — Clerk auth + Supabase for cross-device persistence
