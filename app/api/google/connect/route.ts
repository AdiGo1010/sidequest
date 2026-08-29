import { NextResponse } from "next/server";
import { appUrl, GOOGLE_SCOPES, googleOAuthClient } from "@/lib/google";
import { isGoogleConfigured } from "@/lib/supabase/env";

export async function GET() {
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(new URL("/calendar?mode=demo", appUrl()));
  }
  const oauth = googleOAuthClient(`${appUrl()}/api/google/callback`);
  const url = oauth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GOOGLE_SCOPES,
  });
  return NextResponse.redirect(url);
}
