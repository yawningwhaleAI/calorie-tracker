import { GoogleGenAI, Type } from "@google/genai";

export const MODEL = "gemini-2.5-flash-lite";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

// Reused by both routes for consistent structured output.
export const NUTRITION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Short food or meal name" },
    servingSize: { type: Type.STRING, description: 'e.g. "1 serving", "approx. 350g"' },
    calories: { type: Type.NUMBER, description: "Total calories (kcal)" },
    protein: { type: Type.NUMBER, description: "Protein in grams" },
    carbs: { type: Type.NUMBER, description: "Carbohydrates in grams" },
    fat: { type: Type.NUMBER, description: "Fat in grams" },
  },
  required: ["name", "servingSize", "calories", "protein", "carbs", "fat"],
};

// Schema for image route: returns each distinct food item separately.
export const NUTRITION_ITEMS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      description: "Each distinct food or dish visible in the image",
      items: NUTRITION_SCHEMA,
    },
  },
  required: ["items"],
};

export const SYSTEM_INSTRUCTION =
  "You are a nutrition expert. Analyse the food described or shown and return a " +
  "single combined nutrition estimate for the full portion described or visible. " +
  "Use realistic average values. Round to whole numbers.";

export const SYSTEM_INSTRUCTION_IMAGE =
  "You are a nutrition expert. Identify each distinct food item or dish visible in " +
  "the image and return a separate nutrition estimate for each one. Use realistic " +
  "average values for the portion sizes visible. Round all numbers to whole numbers.";

export function buildNutritionPrompt(query: string): string {
  return `Estimate the nutrition for: ${query}`;
}

export const NUTRITION_IMAGE_PROMPT =
  "List each distinct food item visible in this image as a separate entry with its " +
  "individual nutrition estimate.";
