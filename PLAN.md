# Calorie Tracker — Project Plan

## What We Built

A single-page, no-backend calorie and macro tracker that runs entirely in the
browser. Built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

**Core features:**
- 26-food static catalog with per-serving macros
- AI text lookup — describe a meal in plain English, Gemini returns nutrition data
- AI image scan — upload a meal photo, Gemini identifies each food separately
- Daily food log grouped by meal (Breakfast / Lunch / Dinner / Snack)
- Quantity multiplier on every food card — macros scale before logging
- Daily calorie goal with animated progress bar (green → amber → red)
- Macro stacked bar (protein / carbs / fat by caloric contribution)
- Persistent storage via `localStorage` — survives page refreshes

**API routes:**
- `POST /api/nutrition/text` — accepts `{ query: string }`, returns nutrition JSON
- `POST /api/nutrition/image` — accepts `multipart/form-data` image, returns
  `{ items: NutritionResult[] }` (one per identified food)

## What We Improved

**Round 1 — Aesthetic overhaul (`frontend-design:frontend-design` skill)**
- Replaced generic Tailwind emerald green with a warm editorial palette
  (canvas `#F7F5F2`, ember orange `#C05621`, ink charcoal `#1C1510`)
- Loaded `Playfair Display` (italic bold serif for the calorie number) and
  `DM Sans` (UI body text) via `next/font/google`
- CalorieSummary redesigned as a dark editorial banner with radial glow
- Tab switcher changed from pill buttons to underline-indicator style
- FoodCard tightened with inline macro chips; DailyLog entries as clean divider rows

**Round 2 — Feature + polish pass**
- Added `MealCategory` type (`breakfast | lunch | dinner | snack`) with smart
  time-of-day defaults
- Added editable daily calorie goal stored in `localStorage` (default 2000 kcal)
- Goal progress bar with color transitions (green / amber / red)
- Macro stacked bar showing protein / carbs / fat by caloric contribution
- Daily log now grouped by meal category with per-group calorie subtotals
- Meal category selector (4 pills) above the add-food panel
- Footer with "data stored locally" + "AI estimates are approximate" note
- TypeScript strict fixes throughout; back-compat for old `localStorage` entries

## Future Roadmap

### Deploy
- **Vercel** — `vercel deploy` from the project root; set `GEMINI_API_KEY` as an
  environment variable in the Vercel dashboard

### Short-term features
- **Food history charts** — weekly calorie line chart, macro area chart using
  Recharts or Chart.js; requires storing log by date key
- **Barcode scanning** — integrate Open Food Facts API or similar; use the device
  camera via `getUserMedia` + a barcode-detection library
- **User preferences** — calorie goal, macro targets (protein/carbs/fat g), saved
  in localStorage or a simple user profile

### Medium-term features
- **Per-day history** — log grouped by date, browseable history view
- **Meal templates** — save a set of foods as a "meal" and log it in one tap
- **Export** — download log as CSV for use in spreadsheets

### Long-term / productionize
- **Auth + cloud sync** — Clerk or NextAuth.js + Supabase for cross-device sync
- **PWA** — add a service worker + manifest so it installs on mobile home screen
- **Nutrition completeness score** — track micronutrients (vitamins, minerals)
  using a richer API (Nutritionix, USDA FoodData Central)
