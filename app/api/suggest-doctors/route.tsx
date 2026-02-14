import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content: `User Notes/Symptoms: ${notes}. 
          Please suggest list of doctors. Return JSON only.`,
        },
      ],
    });

    const rawResponse = completion.choices[0].message?.content || "";

    const cleaned = rawResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      status: true,
      data: parsed,
    });

  } catch (error: any) {
    console.error("LLM Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: error?.message || "LLM failed",
      },
      { status: 500 }
    );
  }
}

