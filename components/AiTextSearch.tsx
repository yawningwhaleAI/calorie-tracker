"use client";

import { useState } from "react";
import type { Food } from "@/lib/types";
import { FoodCard } from "./FoodCard";

function Spinner() {
  return (
    <span
      className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"
      aria-hidden="true"
    />
  );
}

export function AiTextSearch({ onAdd }: { onAdd: (food: Food) => void }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Food | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleLookup() {
    const q = query.trim();
    if (!q) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/nutrition/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResult({ id: crypto.randomUUID(), ...data });
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAdd(food: Food) {
    onAdd(food);
    setResult(null);
    setQuery("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleLookup();
            }
          }}
          disabled={isLoading}
          rows={3}
          placeholder={"e.g. grilled chicken breast with brown rice and steamed broccoli"}
          className="w-full resize-none rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm text-ink placeholder-warm-300 outline-none transition focus:border-warm-400 focus:ring-2 focus:ring-warm-100 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleLookup}
          disabled={isLoading || !query.trim()}
          className="flex items-center justify-center gap-2 self-end rounded-xl bg-ember px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-600 disabled:opacity-50 active:scale-95"
        >
          {isLoading && <Spinner />}
          {isLoading ? "Looking up…" : "Look up nutrition"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-warm-200 bg-warm-50 px-4 py-3">
          <p className="text-sm text-warm-600">{error}</p>
        </div>
      )}

      {result && (
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-warm-400">
            AI estimate — confirm to log
          </p>
          <FoodCard food={result} onAdd={handleAdd} />
        </div>
      )}
    </div>
  );
}
