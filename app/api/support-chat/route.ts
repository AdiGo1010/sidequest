import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { SUPPORT_KB } from "@/lib/support/knowledgeBase";

type ChatTurn = { role: "user" | "assistant"; content: string };
type OpenTask = {
  id: string;
  title: string;
  category: string;
  budget: number;
  location: string;
};

const MODELS = ["gemini-3.6-flash", "gemini-3-flash-preview"];

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      { reply: "Chat is not configured yet. Add GEMINI_API_KEY on the server." },
      { status: 503 },
    );
  }

  const body = (await req.json()) as {
    messages?: ChatTurn[];
    tasks?: OpenTask[];
    profile?: { skills?: string[]; licences?: string[]; location?: string };
  };

  const messages = (body.messages ?? []).slice(-16);
  if (!messages.length) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const last = messages[messages.length - 1];
  if (!last?.content?.trim() || last.content.length > 2000) {
    return NextResponse.json({ error: "Message too empty or too long" }, { status: 400 });
  }

  const listings =
    body.tasks
      ?.slice(0, 12)
      .map(
        (t) =>
          `- ${t.title} (${t.category}, $${t.budget}, ${t.location}) → /tasks/${t.id}`,
      )
      .join("\n") ?? "(no open tasks in this session)";

  const profile = body.profile
    ? `Student profile: skills ${body.profile.skills?.join(", ") || "none"}; licences ${body.profile.licences?.join(", ") || "none"}; city ${body.profile.location ?? "unknown"}.`
    : "No logged-in student profile.";

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const ai = new GoogleGenAI({ apiKey: key });
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: `You are the SideQuest in-app assistant. Be brief, warm, and practical. Australian English. Use markdown sparingly.

${SUPPORT_KB}

${profile}

Open tasks right now:
${listings}
`,
        },
      });
      const reply = response.text?.trim();
      if (reply) return NextResponse.json({ reply });
    } catch (err) {
      lastError = err;
    }
  }

  console.error("Gemini support-chat error:", lastError);
  return NextResponse.json(
    { reply: "I couldn't reach Gemini just then. Try again in a moment." },
    { status: 500 },
  );
}
