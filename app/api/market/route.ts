import { NextRequest, NextResponse } from "next/server";
import { emptyMarket, mergeMarket, type MarketSlice } from "@/lib/market";

const GIST_ID =
  process.env.MARKET_GIST_ID?.trim() || "2cf8119bc84941220661e4544e1018c4";
const FILE = "sidequest-market.json";

function token() {
  return process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim() || "";
}

function gistHeaders() {
  const t = token();
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "sidequest-market",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  };
}

async function readMarket(): Promise<MarketSlice> {
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: gistHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`gist read ${res.status}`);
  }
  const gist = (await res.json()) as {
    files?: Record<string, { content?: string }>;
  };
  const raw = gist.files?.[FILE]?.content;
  if (!raw) return emptyMarket();
  try {
    const parsed = JSON.parse(raw) as Partial<MarketSlice>;
    return {
      profiles: parsed.profiles ?? [],
      tasks: parsed.tasks ?? [],
      applications: parsed.applications ?? [],
      messages: parsed.messages ?? [],
      reviews: parsed.reviews ?? [],
    };
  } catch {
    return emptyMarket();
  }
}

async function writeMarket(data: MarketSlice) {
  const t = token();
  if (!t) throw new Error("GITHUB_TOKEN missing");
  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    headers: {
      ...gistHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: {
        [FILE]: { content: JSON.stringify(data) },
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`gist write ${res.status}`);
  }
}

export async function GET() {
  try {
    const data = await readMarket();
    return NextResponse.json(data);
  } catch (err) {
    console.error("market GET", err);
    return NextResponse.json(emptyMarket(), { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const incoming = (await req.json()) as Partial<MarketSlice>;
    const remote = await readMarket();
    const merged = mergeMarket(remote, {
      profiles: incoming.profiles ?? [],
      tasks: incoming.tasks ?? [],
      applications: incoming.applications ?? [],
      messages: incoming.messages ?? [],
      reviews: incoming.reviews ?? [],
    });
    await writeMarket(merged);
    return NextResponse.json(merged);
  } catch (err) {
    console.error("market POST", err);
    return NextResponse.json(
      { error: "Could not save to the shared database" },
      { status: 500 },
    );
  }
}
