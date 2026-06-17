"use client";

import { useMemo, useState } from "react";
import { FOODS } from "@/lib/foods";
import type { Food } from "@/lib/types";
import { FoodCard } from "./FoodCard";

export function FoodSearch({ onAdd }: { onAdd: (food: Food) => void }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FOODS;
    return FOODS.filter((f) => f.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search foods…"
          className="w-full rounded-xl border border-warm-200 bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder-warm-400 outline-none transition focus:border-warm-400 focus:ring-2 focus:ring-warm-200"
        />
      </div>

      {results.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-warm-200 p-8 text-center">
          <p className="text-sm text-warm-400">No foods match &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="mt-3 flex max-h-[30rem] flex-col gap-1.5 overflow-y-auto pr-0.5">
          {results.map((food) => (
            <FoodCard key={food.id} food={food} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  );
}
