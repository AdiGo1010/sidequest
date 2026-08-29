import { NextResponse } from "next/server";
import { calendarClient } from "@/lib/google-session";
import { freeWindows } from "@/lib/calendar-suggest";

export async function GET() {
  const calendar = await calendarClient();
  if (!calendar) {
    return NextResponse.json({ connected: false, events: [], windows: [] });
  }
  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 7 * 86400000).toISOString();
  const { data } = await calendar.events.list({
    calendarId: "primary",
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 40,
  });
  const events = (data.items ?? []).map((e) => ({
    id: e.id,
    title: e.summary ?? "(busy)",
    start: e.start?.dateTime ?? e.start?.date,
    end: e.end?.dateTime ?? e.end?.date,
  }));
  const busy = events
    .filter((e) => e.start && e.end)
    .map((e) => ({ start: new Date(e.start!), end: new Date(e.end!) }));
  const windows = freeWindows(busy).map((w) => ({
    start: w.start.toISOString(),
    end: w.end.toISOString(),
  }));
  return NextResponse.json({ connected: true, events, windows });
}
