export function Photo({ name }: { name: string }) {
  return (
    <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#c9f0d4]/90 via-[#f7f3ea] to-[#f6cbb8]/80">
      <span className="px-4 text-center text-sm font-medium text-ink/70">{name}</span>
    </div>
  );
}
