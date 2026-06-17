import { NextRequest, NextResponse } from "next/server";
import {
  ai,
  MODEL,
  NUTRITION_ITEMS_SCHEMA,
  SYSTEM_INSTRUCTION_IMAGE,
  NUTRITION_IMAGE_PROMPT,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Request must be multipart/form-data." },
      { status: 400 },
    );
  }

  const file = formData.get("image");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { error: 'Missing required field "image".' },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: `Unsupported file type "${file.type}". Must be an image.` },
      { status: 400 },
    );
  }

  try {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          parts: [
            { text: NUTRITION_IMAGE_PROMPT },
            { inlineData: { mimeType: file.type, data: base64 } },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_IMAGE,
        responseMimeType: "application/json",
        responseSchema: NUTRITION_ITEMS_SCHEMA,
      },
    });

    const json = JSON.parse(response.text ?? "{}");
    return NextResponse.json(json);
  } catch (err) {
    console.error("[/api/nutrition/image]", err);
    return NextResponse.json(
      { error: "Failed to analyse image with Gemini." },
      { status: 500 },
    );
  }
}
