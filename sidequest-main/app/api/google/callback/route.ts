import { NextResponse } from "next/server";
import { appUrl, googleOAuthClient } from "@/lib/google";
import { writeGoogleTokens } from "@/lib/google-session";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/calendar?error=missing_code", appUrl()));
  }
  const oauth = googleOAuthClient(`${appUrl()}/api/google/callback`);
  const { tokens } = await oauth.getToken(code);
  await writeGoogleTokens({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date,
  });
  return NextResponse.redirect(new URL("/calendar?connected=1", appUrl()));
}
