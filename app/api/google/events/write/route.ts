import { NextResponse } from "next/server";
import { calendarClient } from "@/lib/google-session";

export async function POST(request: Request) {
  const calendar = await calendarClient();
  if (!calendar) {
    return NextResponse.json({ ok: false, reason: "not_connected" }, { status: 401 });
  }
  const body = (await request.json()) as {
    title: string;
    start: string;
    end: string;
    location?: string;
  };
  const { data } = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: body.title,
      location: body.location,
      description: "Confirmed on SideQuest",
      start: { dateTime: body.start },
      end: { dateTime: body.end },
    },
  });
  return NextResponse.json({ ok: true, id: data.id });
}
