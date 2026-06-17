import type { LogEntry, MealCategory } from "@/lib/types";
import { MEAL_CATEGORIES } from "@/lib/types";
import { LogEntryRow } from "./LogEntryRow";

function MealGroup({
  category,
  entries,
  onRemove,
}: {
  category: { id: MealCategory; label: string; emoji: string };
  entries: LogEntry[];
  onRemove: (id: string) => void;
}) {
  const subtotal = entries.reduce((sum, e) => sum + e.food.calories, 0);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm" aria-hidden="true">{category.emoji}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-warm-500">
            {category.label}
          </span>
        </div>
        <span className="text-[11px] tabular-nums text-warm-400">
          {Math.round(subtotal)} kcal
        </span>
      </div>
      <ul className="mb-4 rounded-xl border border-warm-100 bg-white divide-y divide-warm-100">
        {entries.map((entry) => (
          <LogEntryRow key={entry.id} entry={entry} onRemove={onRemove} />
        ))}
      </ul>
    </div>
  );
}

export function DailyLog({
  entries,
  onRemove,
  onClear,
}: {
  entries: LogEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-warm-200 p-10 text-center">
        <p className="text-sm text-warm-400">Nothing logged yet.</p>
        <p className="mt-1 text-[11px] text-warm-300">
          Add a food using any of the tabs above.
        </p>
      </div>
    );
  }

  // Group by meal category, preserving the canonical order
  const grouped = MEAL_CATEGORIES.map((cat) => ({
    category: cat,
    entries: entries.filter((e) => e.category === cat.id),
  })).filter((g) => g.entries.length > 0);

  return (
    <div>
      {grouped.map(({ category, entries: groupEntries }) => (
        <MealGroup
          key={category.id}
          category={category}
          entries={groupEntries}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
