import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { SUPPORT_KB } from "@/lib/support/knowledgeBase";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { messages } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  if (!messages?.length) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: `You are the SideQuest support assistant. SideQuest is a
student gig marketplace for Australian uni students. Answer ONLY using the
knowledge base below. Be brief and friendly. If the answer isn't in the
knowledge base, say you're not sure and suggest they email support, rather
than guessing.

${SUPPORT_KB}`,
      },
    });

    return NextResponse.json({
      reply: response.text ?? "Sorry, something went wrong.",
    });
  } catch (err) {
    console.error("Gemini support-chat error:", err);
    return NextResponse.json(
      { reply: "Sorry, something went wrong. Please try again." },
      { status: 500 }
    );
  }
}