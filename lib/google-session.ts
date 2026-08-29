import { cookies } from "next/headers";
import { google } from "googleapis";
import { appUrl, googleOAuthClient } from "@/lib/google";

const COOKIE = "sq_google";

export type GoogleTokens = {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
};

export async function readGoogleTokens(): Promise<GoogleTokens | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GoogleTokens;
  } catch {
    return null;
  }
}

export async function writeGoogleTokens(tokens: GoogleTokens) {
  const jar = await cookies();
  jar.set(COOKIE, JSON.stringify(tokens), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function calendarClient() {
  const tokens = await readGoogleTokens();
  if (!tokens?.access_token && !tokens?.refresh_token) return null;
  const oauth = googleOAuthClient(`${appUrl()}/api/google/callback`);
  oauth.setCredentials(tokens);
  return google.calendar({ version: "v3", auth: oauth });
}
