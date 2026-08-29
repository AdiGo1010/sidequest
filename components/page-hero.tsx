export function PageHero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-navy px-5 py-12 text-white sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle ? (
          <p className="mt-3 text-sm text-white/70 sm:text-base">{subtitle}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
