import { NextRequest, NextResponse } from "next/server";
import {
  ai,
  MODEL,
  NUTRITION_SCHEMA,
  SYSTEM_INSTRUCTION,
  buildNutritionPrompt,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  let query: string;
  try {
    const body = await req.json();
    query = typeof body?.query === "string" ? body.query.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json(
      { error: 'Missing required field "query".' },
      { status: 400 },
    );
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: buildNutritionPrompt(query),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: NUTRITION_SCHEMA,
      },
    });

    const json = JSON.parse(response.text ?? "{}");
    return NextResponse.json(json);
  } catch (err) {
    console.error("[/api/nutrition/text]", err);
    return NextResponse.json(
      { error: "Failed to fetch nutrition data from Gemini." },
      { status: 500 },
    );
  }
}
