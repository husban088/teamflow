export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="animate-ambient-pulse pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 blur-[120px]"
        style={{ background: "radial-gradient(closest-side, var(--violet), transparent)" }}
      />
      <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-16 text-center sm:px-8 sm:pt-24">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-solid bg-panel px-3 py-1 text-[13px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-teal" />
          {eyebrow}
        </span>
        <h1 className="text-[2.3rem] font-semibold leading-[1.1] tracking-tight sm:text-[3rem]">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-muted sm:text-[17px]">
          {description}
        </p>
      </div>
    </section>
  );
}
