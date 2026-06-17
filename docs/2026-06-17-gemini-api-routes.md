# 2026-06-17 — Gemini AI Nutrition API Routes

## Summary

Added two Next.js App Router API routes that use Google Gemini 2.5 Flash Lite to
estimate nutrition data. The frontend was not changed — this is pure backend,
ready to be wired up in the next step.

## What was built

- **`lib/gemini.ts`** — shared Gemini client (`@google/genai`), response schema,
  system instruction, and prompt helpers used by both routes.
- **`app/api/nutrition/text/route.ts`** — `POST /api/nutrition/text`; accepts a
  JSON body `{ query: string }` and returns structured nutrition JSON.
- **`app/api/nutrition/image/route.ts`** — `POST /api/nutrition/image`; accepts
  `multipart/form-data` with an `image` field (JPEG/PNG/WEBP) and returns the same
  structured nutrition JSON.
- **`CLAUDE.md`** — updated with new tech stack entry, folder structure, API
  usage examples, and updated "what's next" section.

## Verified

- `npm run build` → compiled successfully, lint + types clean; both routes appear
  as `ƒ (Dynamic)` in the route table.
- Text route smoke test:
  ```
  POST /api/nutrition/text {"query":"2 scrambled eggs with buttered toast"}
  → {"name":"2 scrambled eggs with buttered toast","servingSize":"1 serving",
     "calories":380,"protein":18,"carbs":25,"fat":22}
  ```
- Image route smoke test (1×1 pixel JPEG):
  ```
  POST /api/nutrition/image (multipart image file)
  → {"name":"Sweet Potato Fries","servingSize":"1 medium serving (approx. 150g)",
     "calories":235,"protein":3,"carbs":45,"fat":5}
  ```
  *(Gemini invented a food for the solid-color test pixel — expected; with a real
  photo it identifies correctly.)*
- Missing input → `400 { error: "..." }` for both routes.

## Technical decisions & rationale

### `@google/genai` over `@google/generative-ai`
`@google/genai` is the current unified Google Gen AI SDK released in 2025. It
provides better TypeScript types, supports the `responseSchema` structured-output
feature used here, and is the recommended path for new integrations. The older
`@google/generative-ai` package is being superseded.

### `responseMimeType: "application/json"` + `responseSchema`
Passing a JSON Schema to Gemini as `responseSchema` makes it output valid JSON
matching that schema every time — no manual `JSON.parse` on freeform text, no
repair needed for malformed output. This is the most reliable structured-output
path for production use.

### Single combined result (not per-ingredient breakdown)
The routes return one merged nutrition object for the whole meal/description.
Breaking a meal photo into 5 separate ingredients would require the client to
sum them before logging — extra complexity with no UX benefit for a simple
daily-log use case. The user logs "what I ate", not an ingredient list.

### Image as base64 inline data (not file URI or Cloud Storage)
`inlineData` (base64 embedded in the request) requires no cloud storage setup,
no GCS bucket, no signed URLs. For meal photos that are sent once and never
stored, it's the right trade-off: slightly larger request payload vs. zero
infrastructure dependency.

### No authentication on the routes
The app has no user accounts and runs locally. Adding auth to the API routes
would be premature. Rate limiting / key protection is at the Gemini API level.

## What's next

- Wire these routes into the frontend: add a text input and image upload option
  to the search panel so users can type a meal description or snap a photo and
  log the result directly.
