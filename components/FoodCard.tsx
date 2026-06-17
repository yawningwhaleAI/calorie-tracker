"use client";

import { useState } from "react";
import type { Food } from "@/lib/types";

export function FoodCard({
  food,
  onAdd,
}: {
  food: Food;
  onAdd: (food: Food) => void;
}) {
  const [qty, setQty] = useState("1");
  const multiplier = Math.max(0.1, parseFloat(qty) || 1);

  const scaled: Food = {
    ...food,
    calories: Math.round(food.calories * multiplier),
    protein: Math.round(food.protein * multiplier),
    carbs: Math.round(food.carbs * multiplier),
    fat: Math.round(food.fat * multiplier),
    servingSize:
      multiplier === 1
        ? food.servingSize
        : `${multiplier}× ${food.servingSize}`,
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-warm-200 bg-white px-4 py-3 transition-all hover:border-warm-300 hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{food.name}</p>
        <p className="mt-0.5 text-[11px] text-warm-400">{food.servingSize}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-xs font-semibold text-ink tabular-nums">
            {scaled.calories}
          </span>
          <span className="text-[10px] text-warm-400">cal</span>
          <span className="text-[10px] text-warm-300">·</span>
          <span className="text-[10px] text-warm-500">
            P<span className="font-medium text-ink ml-0.5">{scaled.protein}</span>
          </span>
          <span className="text-[10px] text-warm-500">
            C<span className="font-medium text-ink ml-0.5">{scaled.carbs}</span>
          </span>
          <span className="text-[10px] text-warm-500">
            F<span className="font-medium text-ink ml-0.5">{scaled.fat}</span>
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* Quantity input */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-warm-400">×</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            aria-label={`Quantity for ${food.name}`}
            className="w-12 rounded-lg border border-warm-200 bg-canvas px-2 py-1.5 text-center text-xs text-ink outline-none transition focus:border-ember focus:ring-1 focus:ring-ember/20"
          />
        </div>
        <button
          type="button"
          onClick={() => onAdd(scaled)}
          aria-label={`Add ${food.name} to log`}
          className="rounded-lg bg-ember px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-ember-600 active:scale-95"
        >
          Add
        </button>
      </div>
    </div>
  );
}
