import Link from "next/link";
import type { ReactNode } from "react";

function safePath(href: string) {
  const trimmed = href.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("://")) {
    return null;
  }
  return trimmed.split("#")[0] ?? trimmed;
}

function linkLabel(text: string, href: string) {
  if (text === href || text.startsWith("/tasks/")) return "Open task";
  return text;
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1]) {
      nodes.push(
        <strong key={key++} className="font-semibold">
          {match[1]}
        </strong>,
      );
    } else {
      const href = safePath(match[3] ?? "");
      const label = linkLabel(match[2] ?? "", match[3] ?? "");
      if (href) {
        nodes.push(
          <Link key={key++} href={href} className="font-medium underline underline-offset-2">
            {label}
          </Link>,
        );
      } else {
        nodes.push(label);
      }
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Turn Gemini markdown (and escaped ** / [path](path) links) into formatted chat. */
export function ChatMarkdown({ text }: { text: string }) {
  const cleaned = text
    .replace(/\\([*_`\[\]])/g, "$1")
    .replace(/\[(\/tasks\/[a-z0-9-]+)\]\(\1\)/gi, "[Open task]($1)");

  const lines = cleaned.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  function flushList() {
    if (!list.length) return;
    blocks.push(
      <ul key={key++} className="my-1.5 list-disc space-y-1 pl-4 text-left">
        {list.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  }

  for (const line of lines) {
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
      continue;
    }
    flushList();
    if (!line.trim()) {
      blocks.push(<div key={key++} className="h-2" />);
      continue;
    }
    blocks.push(
      <p key={key++} className="text-left">
        {renderInline(line)}
      </p>,
    );
  }
  flushList();

  return <div className="space-y-0.5">{blocks}</div>;
}
