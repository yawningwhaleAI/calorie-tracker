"use client";

import { useState } from "react";
import { CalorieSummary } from "@/components/CalorieSummary";
import { DailyLog } from "@/components/DailyLog";
import { FoodSearch } from "@/components/FoodSearch";
import { AiTextSearch } from "@/components/AiTextSearch";
import { AiImageSearch } from "@/components/AiImageSearch";
import { useFoodLog } from "@/hooks/useFoodLog";
import { MEAL_CATEGORIES, defaultCategory } from "@/lib/types";
import type { Food, MealCategory } from "@/lib/types";

type Mode = "catalog" | "ai-text" | "ai-image";

const ADD_TABS: { id: Mode; label: string; sub: string }[] = [
  { id: "catalog",  label: "Quick Add",    sub: "Browse catalog"  },
  { id: "ai-text",  label: "Describe It",  sub: "AI text lookup"  },
  { id: "ai-image", label: "Photo",        sub: "AI image scan"   },
];

export default function Home() {
  const { entries, totals, goal, addEntry, removeEntry, clearLog, setGoal } =
    useFoodLog();

  const [mode, setMode]         = useState<Mode>("catalog");
  const [category, setCategory] = useState<MealCategory>(defaultCategory);

  function handleAdd(food: Food) {
    addEntry(food, category);
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
  });

  return (
    <div className="min-h-screen bg-canvas">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">

        {/* ── Header ── */}
        <header className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-warm-200 pb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-warm-400 mb-1">
              Daily Tracker
            </p>
            <h1 className="font-display text-3xl italic font-bold leading-none text-ink sm:text-4xl">
              Nutrition Log
            </h1>
          </div>
          <p className="text-xs text-warm-400">{today}</p>
        </header>

        {/* ── Calorie summary ── */}
        <CalorieSummary
          totals={totals}
          goal={goal}
          entryCount={entries.length}
          onGoalChange={setGoal}
        />

        {/* ── Main grid ── */}
        <div className="mt-10 grid gap-10 lg:grid-cols-2">

          {/* Add food panel */}
          <section>

            {/* Meal category selector */}
            <div className="mb-5">
              <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-warm-400">
                Meal
              </p>
              <div className="flex gap-2 flex-wrap">
                {MEAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                      category === cat.id
                        ? "border-ember bg-ember/10 text-ember"
                        : "border-warm-200 bg-white text-warm-500 hover:border-warm-300 hover:text-ink"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Add method tabs */}
            <div className="mb-5 flex gap-5 border-b border-warm-200">
              {ADD_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMode(tab.id)}
                  className={`relative pb-3 text-left transition-colors ${
                    mode === tab.id
                      ? "text-ink"
                      : "text-warm-400 hover:text-warm-600"
                  }`}
                >
                  <span className="block text-sm font-medium">{tab.label}</span>
                  <span className="block text-[11px] text-warm-400 mt-0.5">{tab.sub}</span>
                  {mode === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-ember" />
                  )}
                </button>
              ))}
            </div>

            {mode === "catalog"  && <FoodSearch   onAdd={handleAdd} />}
            {mode === "ai-text"  && <AiTextSearch  onAdd={handleAdd} />}
            {mode === "ai-image" && <AiImageSearch onAdd={handleAdd} />}
          </section>

          {/* Daily log */}
          <section>
            <div className="mb-5 flex items-end justify-between border-b border-warm-200 pb-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-warm-400 mb-0.5">
                  Today
                </p>
                <h2 className="text-sm font-medium text-ink">Food Log</h2>
              </div>
              {entries.length > 0 && (
                <button
                  type="button"
                  onClick={clearLog}
                  className="mb-0.5 text-[11px] text-warm-400 transition hover:text-ember"
                >
                  Clear all
                </button>
              )}
            </div>
            <DailyLog
              entries={entries}
              onRemove={removeEntry}
              onClear={clearLog}
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-warm-100 pt-6 text-center">
          <p className="text-[11px] text-warm-300">
            Data stored locally on this device · AI estimates are approximate
          </p>
        </footer>
      </main>
    </div>
  );
}
