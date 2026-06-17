"use client";

import { useState } from "react";
import type { LogEntry } from "@/lib/types";

export function LogEntryRow({
  entry,
  onRemove,
}: {
  entry: LogEntry;
  onRemove: (id: string) => void;
}) {
  const { food } = entry;
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="flex items-center gap-3 px-4 py-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{food.name}</p>
        <p className="mt-0.5 text-[11px] text-warm-400">
          {food.servingSize}
          <span className="mx-1 text-warm-200">·</span>
          <span className="text-warm-500">
            P{food.protein}g · C{food.carbs}g · F{food.fat}g
          </span>
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold tabular-nums text-ink">
          {food.calories}
          <span className="text-[10px] font-normal text-warm-400 ml-0.5">cal</span>
        </span>
        <button
          type="button"
          onClick={() => onRemove(entry.id)}
          aria-label={`Remove ${food.name}`}
          className={`rounded p-1 text-warm-300 transition-all hover:bg-warm-100 hover:text-ember ${
            hovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </li>
  );
}
