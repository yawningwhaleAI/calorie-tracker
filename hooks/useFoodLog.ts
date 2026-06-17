"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Food, LogEntry, MealCategory, Totals } from "@/lib/types";

const LOG_KEY  = "calorie-tracker.log";
const GOAL_KEY = "calorie-tracker.goal";
const DEFAULT_GOAL = 2000;

function loadEntries(): LogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Back-compat: entries without category get "snack"
    return parsed.map((e: Omit<LogEntry, "category"> & { category?: MealCategory }) => ({
      category: "snack" as MealCategory,
      ...e,
    }));
  } catch {
    return [];
  }
}

function loadGoal(): number {
  if (typeof window === "undefined") return DEFAULT_GOAL;
  try {
    const raw = window.localStorage.getItem(GOAL_KEY);
    const n = raw ? parseInt(raw, 10) : NaN;
    return isNaN(n) || n <= 0 ? DEFAULT_GOAL : n;
  } catch {
    return DEFAULT_GOAL;
  }
}

export function useFoodLog() {
  const [entries, setEntries]   = useState<LogEntry[]>([]);
  const [goal, setGoalState]    = useState<number>(DEFAULT_GOAL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setGoalState(loadGoal());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(LOG_KEY, JSON.stringify(entries)); } catch {}
  }, [entries, hydrated]);

  const addEntry = useCallback((food: Food, category: MealCategory) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setEntries((prev) => [{ id, food, category, loggedAt: Date.now() }, ...prev]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearLog = useCallback(() => setEntries([]), []);

  const setGoal = useCallback((kcal: number) => {
    setGoalState(kcal);
    try { window.localStorage.setItem(GOAL_KEY, String(kcal)); } catch {}
  }, []);

  const totals = useMemo<Totals>(
    () =>
      entries.reduce<Totals>(
        (acc, { food }) => ({
          calories: acc.calories + food.calories,
          protein:  acc.protein  + food.protein,
          carbs:    acc.carbs    + food.carbs,
          fat:      acc.fat      + food.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [entries],
  );

  return { entries, totals, goal, addEntry, removeEntry, clearLog, setGoal, hydrated };
}
