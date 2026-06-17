# 2026-06-17 — Polish Pass: Design + Features

## Summary

Two rounds of review and improvement applied to bring the app to a
professional product standard.

---

## Round 1 — Design review (frontend-design:frontend-design skill)

**What was wrong:**
- Generic Tailwind `emerald-500` green throughout — indistinguishable from
  thousands of tutorial projects
- Default system font / Inter; no type hierarchy
- CalorieSummary was a flat gradient card with no visual drama
- Tab switcher was pill-button style — common, forgettable
- FoodCard layout was busy; "P31 · C0 · F4" text was too small and cramped
- No spatial differentiation between the Add panel and the Log panel

**What was fixed:**
- Color system replaced wholesale: warm parchment background `#F7F5F2`,
  deep ink charcoal `#1C1510`, ember orange `#C05621` as the sole accent
- `Playfair Display` (variable, italic) loaded for the calorie hero number —
  gives the app an editorial, premium-magazine feel
- `DM Sans` for all UI text — geometric, clean, not the generic Inter
- CalorieSummary became a dark `#1C1510` banner with a warm radial orange
  glow; calorie number rendered 7xl italic serif
- Tab switcher changed to underline-indicator style (one thin ember line)
- FoodCard: tighter layout, inline `P·C·F` chips, warm border color system
- DailyLog entries: divider-row list, calorie right-aligned, hover-reveal × button
- Tailwind config extended with `warm` and `ember` color palettes + `font-display`

**Design skill verdict after Round 1:** Layout and palette are now intentional
and cohesive. Still missing functional completeness (goal, categories, macro viz).

---

## Round 2 — Feature pass

**What was added:**

### Meal categories
- `MealCategory` type: `breakfast | lunch | dinner | snack`
- `defaultCategory()` returns the right meal based on time of day:
  5–10 → breakfast, 10–15 → lunch, 15–21 → dinner, else snack
- 4-pill meal selector above the add tabs; selected category applied to all
  three add methods (catalog, text, photo)
- `LogEntry` stores `category`; back-compat shim defaults old entries to "snack"
- DailyLog groups entries by meal with per-group kcal subtotals; groups render
  in canonical order (Breakfast → Lunch → Dinner → Snack); empty groups hidden

### Daily calorie goal
- Default 2000 kcal; stored in `localStorage` as `calorie-tracker.goal`
- Inline editable in the CalorieSummary banner (click the goal value to edit)
- Animated progress bar: green (< 75% of goal), amber (75–100%), red (> 100%)
- "X kcal remaining" / "X kcal over goal" status text

### Macro stacked bar
- Horizontal bar showing protein / carbs / fat split by caloric contribution
  (protein × 4, carbs × 4, fat × 9 kcal/g)
- Three colors: orange for protein, cream for carbs, warm gray for fat
- Smooth `transition-all duration-500` as values change

### Polish
- Footer: "Data stored locally · AI estimates are approximate"
- Mobile layout verified (single-column stacks correctly under `lg:`)
- `PLAN.md` created with What We Built / What We Improved / Future Roadmap
- `CLAUDE.md` updated

---

## Verification

- `npm run build` → compiled, linted, type-checked. Page bundle: 6.63 kB
- Dev server running; all three add methods log to the correct meal group
- Goal progress bar color transitions verified (green → amber → red)
- Macro bar proportions correct for a high-protein vs high-carb meal
- Meal categories persist across page refresh
- Old localStorage entries without `category` load without error (default snack)
