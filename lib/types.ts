export interface Food {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

export interface LogEntry {
  id: string;
  food: Food;
  category: MealCategory;
  loggedAt: number;
}

export interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const MEAL_CATEGORIES: { id: MealCategory; label: string; emoji: string }[] = [
  { id: "breakfast", label: "Breakfast", emoji: "☀️" },
  { id: "lunch",     label: "Lunch",     emoji: "🌤" },
  { id: "dinner",    label: "Dinner",    emoji: "🌙" },
  { id: "snack",     label: "Snack",     emoji: "🍎" },
];

export function defaultCategory(): MealCategory {
  const h = new Date().getHours();
  if (h >= 5  && h < 10) return "breakfast";
  if (h >= 10 && h < 15) return "lunch";
  if (h >= 15 && h < 21) return "dinner";
  return "snack";
}
