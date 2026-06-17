"use client";

import { useRef, useState } from "react";
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

export function AiImageSearch({ onAdd }: { onAdd: (food: Food) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Food[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    setFile(f);
    setResults([]);
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function handleClear() {
    setFile(null);
    setResults([]);
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleAnalyse() {
    if (!file) return;
    setIsLoading(true);
    setResults([]);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/nutrition/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      const items: Food[] = (data.items ?? []).map(
        (item: Omit<Food, "id">) => ({ id: crypto.randomUUID(), ...item }),
      );
      setResults(items);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddOne(food: Food) {
    onAdd(food);
    setResults((prev) => prev.filter((f) => f.id !== food.id));
  }

  function handleAddAll() {
    results.forEach((f) => onAdd(f));
    setResults([]);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone / file picker */}
      {!file ? (
        <label
          htmlFor="meal-photo-input"
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-warm-200 bg-white py-10 px-6 text-center transition hover:border-warm-300 hover:bg-warm-50"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-warm-300" aria-hidden="true">
            <rect x="2" y="5" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="9.5" cy="11.5" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 18l6-5 5 5 4-3 9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="text-sm font-medium text-ink">Upload a meal photo</p>
            <p className="mt-0.5 text-[11px] text-warm-400">JPEG, PNG, or WEBP</p>
          </div>
        </label>
      ) : (
        /* Preview */
        <div className="relative overflow-hidden rounded-xl border border-warm-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl!}
            alt="Meal preview"
            className="max-h-52 w-full object-contain bg-warm-50"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm transition hover:bg-white"
            aria-label="Remove photo"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="#1C1510" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="meal-photo-input"
      />

      {/* Analyse button */}
      {file && !isLoading && results.length === 0 && (
        <button
          type="button"
          onClick={handleAnalyse}
          className="flex items-center justify-center gap-2 rounded-xl bg-ember py-2.5 text-sm font-semibold text-white transition hover:bg-ember-600 active:scale-95"
        >
          Analyse photo
        </button>
      )}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-ember py-2.5 text-sm font-semibold text-white">
          <Spinner />
          Scanning your meal…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-warm-200 bg-warm-50 px-4 py-3">
          <p className="text-sm text-warm-600">{error}</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.15em] text-warm-400">
              {results.length} item{results.length > 1 ? "s" : ""} found
            </p>
            {results.length > 1 && (
              <button
                type="button"
                onClick={handleAddAll}
                className="rounded-lg bg-ember/10 px-3 py-1 text-xs font-semibold text-ember transition hover:bg-ember/20"
              >
                Add all
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {results.map((food) => (
              <FoodCard key={food.id} food={food} onAdd={handleAddOne} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
