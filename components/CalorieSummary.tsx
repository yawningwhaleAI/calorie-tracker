"use client";

import { useState } from "react";
import type { Totals } from "@/lib/types";

function MacroBar({ totals }: { totals: Totals }) {
  // Caloric contribution: protein=4 kcal/g, carbs=4 kcal/g, fat=9 kcal/g
  const pCal = totals.protein * 4;
  const cCal = totals.carbs   * 4;
  const fCal = totals.fat     * 9;
  const total = pCal + cCal + fCal || 1;
  const pPct = (pCal / total) * 100;
  const cPct = (cCal / total) * 100;
  const fPct = (fCal / total) * 100;

  return (
    <div>
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-warm-800">
        <div style={{ width: `${pPct}%` }} className="bg-[#F59155] transition-all duration-500" />
        <div style={{ width: `${cPct}%` }} className="bg-[#F7F5F2] transition-all duration-500" />
        <div style={{ width: `${fPct}%` }} className="bg-[#8C7B6B] transition-all duration-500" />
      </div>
      <div className="mt-2 flex gap-4">
        {[
          { label: "Protein", value: totals.protein, color: "text-[#F59155]" },
          { label: "Carbs",   value: totals.carbs,   color: "text-[#F7F5F2]" },
          { label: "Fat",     value: totals.fat,      color: "text-[#A89A8C]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold tabular-nums ${color}`}>
              {Math.round(value)}g
            </span>
            <span className="text-[10px] uppercase tracking-[0.12em] text-warm-600">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoalProgress({
  calories,
  goal,
  onGoalChange,
}: {
  calories: number;
  goal: number;
  onGoalChange: (g: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState("");
  const pct     = Math.min((calories / goal) * 100, 100);
  const over    = calories > goal;
  const remaining = goal - Math.round(calories);

  const barColor =
    pct < 75  ? "bg-emerald-500" :
    pct < 100 ? "bg-amber-400" :
                "bg-rose-500";

  function commit() {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n > 0) onGoalChange(n);
    setEditing(false);
  }

  return (
    <div>
      {/* Goal row */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.15em] text-warm-600">
          Daily goal
        </span>
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              type="number"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              className="w-20 rounded-md border border-warm-700 bg-warm-900 px-2 py-0.5 text-right text-xs text-[#F7F5F2] outline-none focus:border-ember"
              placeholder={String(goal)}
            />
            <span className="text-[10px] text-warm-600">kcal</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setDraft(String(goal)); setEditing(true); }}
            className="text-[10px] text-warm-500 transition hover:text-[#F7F5F2]"
          >
            {goal.toLocaleString()} kcal ✎
          </button>
        )}
      </div>

      {/* Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-warm-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Status */}
      <p className="mt-1.5 text-[11px] text-warm-500">
        {over
          ? <span className="text-rose-400">{Math.abs(remaining)} kcal over goal</span>
          : `${remaining.toLocaleString()} kcal remaining`
        }
      </p>
    </div>
  );
}

export function CalorieSummary({
  totals,
  goal,
  entryCount,
  onGoalChange,
}: {
  totals: Totals;
  goal: number;
  entryCount: number;
  onGoalChange: (g: number) => void;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl px-6 py-6 sm:px-8 sm:py-8"
      style={{ background: "#1C1510" }}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 15% 50%, #C05621 0%, transparent 65%)",
        }}
      />

      <div className="relative grid gap-6 sm:grid-cols-2">
        {/* Left: calorie hero */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-warm-500 mb-2">
            Calories today
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-6xl italic font-bold leading-none tabular-nums text-[#F7F5F2] sm:text-7xl">
              {Math.round(totals.calories).toLocaleString()}
            </span>
            <span className="text-sm text-warm-600 mb-0.5">kcal</span>
          </div>
          <p className="mt-2 text-[11px] text-warm-600">
            {entryCount} {entryCount === 1 ? "entry" : "entries"} logged
          </p>
        </div>

        {/* Right: goal + macros */}
        <div className="flex flex-col justify-between gap-5">
          <GoalProgress
            calories={totals.calories}
            goal={goal}
            onGoalChange={onGoalChange}
          />
          <div className="h-px bg-warm-800 sm:hidden" />
          <MacroBar totals={totals} />
        </div>
      </div>
    </div>
  );
}
