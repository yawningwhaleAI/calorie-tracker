# 2026-06-17 — AI Frontend Integration + Dynamic Quantities

## Summary

Wired the two Gemini API routes into the frontend. The "Add Food" section now has
three tabs — Quick Add (existing catalog), Describe It (AI text), and Photo (AI
image). Also added a quantity multiplier to every food card so macros scale before
logging. All entries persist in `localStorage` as before.

## What was built / changed

- **`app/page.tsx`** — added a `mode` state and a 3-tab pill switcher; routes to
  `FoodSearch`, `AiTextSearch`, or `AiImageSearch` depending on active tab. Updated
  subtitle copy.
- **`components/FoodCard.tsx`** — added a `qty` number input (default `1`) and a
  `multiplier`. All macro values are scaled by the multiplier before the `Food`
  snapshot is passed to `onAdd`. The `servingSize` label reflects the multiplier
  when ≠ 1 (e.g. "1.5× 100g cooked").
- **`components/AiTextSearch.tsx`** (new) — textarea + "Look up" button; fetches
  `POST /api/nutrition/text`; shows a spinner while loading; renders one `FoodCard`
  to confirm; clears after add; inline error message on failure.
- **`components/AiImageSearch.tsx`** (new) — file picker (hidden `<input>`,
  styled label); `URL.createObjectURL` image preview; "Analyse photo" button;
  fetches `POST /api/nutrition/image`; renders one `FoodCard` per identified item
  with individual Add buttons and an "Add all" shortcut; Clear resets the whole
  panel; inline error message on failure.
- **`lib/gemini.ts`** — added `NUTRITION_ITEMS_SCHEMA` (array-of-objects schema)
  and `SYSTEM_INSTRUCTION_IMAGE` for the multi-item image path.
- **`app/api/nutrition/image/route.ts`** — switched from `NUTRITION_SCHEMA` +
  single result to `NUTRITION_ITEMS_SCHEMA` + `{ items: NutritionResult[] }`.
- **`CLAUDE.md`** — updated "What it does", folder structure, removed completed
  "what's coming next" items.

## Verified

- `npm run build` → compiled successfully, lint + types clean; page bundle grew from
  2.9 kB to 4.66 kB (new components).
- Dev server running at localhost:3000; page loads with 3-tab switcher.

## Technical decisions & rationale

### Tab switcher in `page.tsx` over a single combined component
Each input mode (catalog, text, image) is self-contained with its own state
(query string, file, loading, result, error). Keeping them as separate components
avoids a single large component with branching state. The page owns only the tab
mode state; each tab component owns its own transient UI state.

### Dynamic quantity as a multiplier (not a gram input)
Not all catalog foods use gram-based servings (e.g. "1 large egg", "2 tbsp peanut
butter"). A multiplier (default 1.0) works universally — ×1.5 means 1.5 servings of
anything, whether that's 150g of chicken or 1.5 eggs. The user can type any decimal
(0.5, 1.2, 2, etc.) to get any quantity.

### Image route updated to return an array
The original image route returned a single combined result. The new `NUTRITION_ITEMS_SCHEMA`
makes Gemini list each distinct food item separately. This enables the per-item
confirm flow — the user can see "grilled chicken, 350 cal" and "side salad, 45 cal"
as separate cards and choose what to log.

### `URL.createObjectURL` for image preview
No server upload needed — the browser can render a local File object directly.
`URL.revokeObjectURL` is called on clear to avoid memory leaks.

### Client-side `id` generation for AI results
API routes return nutrition data without an `id`. Both AI components assign a
`crypto.randomUUID()` id when converting the API response to a `Food` object for
display. This keeps the API routes stateless and `FoodCard`/`useFoodLog` unchanged.

### Bug fixed: ASCII double quotes in JSX attribute
The initial `AiTextSearch.tsx` had ASCII `"` (U+0022) inside a JSX attribute value
(`placeholder="..."`), causing SWC to terminate the attribute early and error.
Fixed by wrapping the value in a JSX expression: `placeholder={"..."..."}`.
