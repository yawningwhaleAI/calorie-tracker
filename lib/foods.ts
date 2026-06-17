import type { Food } from "./types";

// A small static catalog of common foods with realistic per-serving macros.
// Numbers are approximate, rounded to whole grams/calories for readability.
export const FOODS: Food[] = [
  { id: "chicken-breast", name: "Chicken Breast", servingSize: "100g cooked", calories: 165, protein: 31, carbs: 0, fat: 4 },
  { id: "white-rice", name: "White Rice", servingSize: "1 cup cooked", calories: 205, protein: 4, carbs: 45, fat: 0 },
  { id: "brown-rice", name: "Brown Rice", servingSize: "1 cup cooked", calories: 218, protein: 5, carbs: 46, fat: 2 },
  { id: "egg", name: "Egg", servingSize: "1 large", calories: 72, protein: 6, carbs: 0, fat: 5 },
  { id: "banana", name: "Banana", servingSize: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0 },
  { id: "apple", name: "Apple", servingSize: "1 medium", calories: 95, protein: 0, carbs: 25, fat: 0 },
  { id: "oats", name: "Oats", servingSize: "1/2 cup dry", calories: 150, protein: 5, carbs: 27, fat: 3 },
  { id: "whole-milk", name: "Whole Milk", servingSize: "1 cup", calories: 149, protein: 8, carbs: 12, fat: 8 },
  { id: "greek-yogurt", name: "Greek Yogurt", servingSize: "170g plain", calories: 100, protein: 17, carbs: 6, fat: 1 },
  { id: "almonds", name: "Almonds", servingSize: "28g (~23 nuts)", calories: 164, protein: 6, carbs: 6, fat: 14 },
  { id: "peanut-butter", name: "Peanut Butter", servingSize: "2 tbsp", calories: 188, protein: 8, carbs: 6, fat: 16 },
  { id: "broccoli", name: "Broccoli", servingSize: "1 cup chopped", calories: 31, protein: 3, carbs: 6, fat: 0 },
  { id: "salmon", name: "Salmon", servingSize: "100g cooked", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: "ground-beef", name: "Ground Beef (85%)", servingSize: "100g cooked", calories: 250, protein: 26, carbs: 0, fat: 15 },
  { id: "whole-wheat-bread", name: "Whole Wheat Bread", servingSize: "1 slice", calories: 81, protein: 4, carbs: 14, fat: 1 },
  { id: "sweet-potato", name: "Sweet Potato", servingSize: "1 medium baked", calories: 112, protein: 2, carbs: 26, fat: 0 },
  { id: "avocado", name: "Avocado", servingSize: "1/2 medium", calories: 120, protein: 1, carbs: 6, fat: 11 },
  { id: "cheddar-cheese", name: "Cheddar Cheese", servingSize: "28g", calories: 113, protein: 7, carbs: 0, fat: 9 },
  { id: "pasta", name: "Pasta", servingSize: "1 cup cooked", calories: 220, protein: 8, carbs: 43, fat: 1 },
  { id: "black-beans", name: "Black Beans", servingSize: "1/2 cup", calories: 114, protein: 8, carbs: 20, fat: 0 },
  { id: "tofu", name: "Tofu", servingSize: "100g firm", calories: 144, protein: 17, carbs: 3, fat: 9 },
  { id: "orange", name: "Orange", servingSize: "1 medium", calories: 62, protein: 1, carbs: 15, fat: 0 },
  { id: "spinach", name: "Spinach", servingSize: "1 cup raw", calories: 7, protein: 1, carbs: 1, fat: 0 },
  { id: "olive-oil", name: "Olive Oil", servingSize: "1 tbsp", calories: 119, protein: 0, carbs: 0, fat: 14 },
  { id: "tuna", name: "Tuna (canned)", servingSize: "100g in water", calories: 116, protein: 26, carbs: 0, fat: 1 },
  { id: "cottage-cheese", name: "Cottage Cheese", servingSize: "1/2 cup", calories: 110, protein: 12, carbs: 5, fat: 5 },
];
