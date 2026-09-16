import Link from "next/link";
import { Waypoints, Home, LayoutGrid } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div
        className="animate-ambient-pulse pointer-events-none absolute top-0 left-1/2 h-[520px] w-[820px] -translate-x-1/2 blur-[120px]"
        style={{ background: "radial-gradient(closest-side, var(--violet), transparent)" }}
      />

      <Link href="/" className="group relative mb-8 flex items-center gap-2 font-display text-[17px] font-semibold">
        <span className="icon-pop flex h-9 w-9 items-center justify-center rounded-xl bg-violet-gradient text-white">
          <Waypoints size={18} />
        </span>
        TeamFlow
      </Link>

      <p className="relative font-display text-[15px] font-medium tracking-[0.3em] text-violet">
        404
      </p>
      <h1 className="relative mt-3 max-w-md text-[1.8rem] font-semibold leading-tight tracking-tight sm:text-[2.2rem]">
        This board doesn&apos;t exist
      </h1>
      <p className="relative mt-3 max-w-[42ch] text-[15px] leading-relaxed text-muted">
        The page you&apos;re looking for was moved, deleted, or never existed.
        Let&apos;s get you back on track.
      </p>

      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="violet-glow inline-flex h-11 items-center gap-2 rounded-xl bg-violet-gradient px-5 text-[14.5px] font-medium text-white transition-all hover:brightness-110 hover:-translate-y-0.5"
        >
          <Home size={16} />
          Go home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-line-solid px-5 text-[14.5px] font-medium text-text transition-all hover:-translate-y-0.5 hover:border-violet/40 hover:bg-panel-raised"
        >
          <LayoutGrid size={16} />
          Go to my boards
        </Link>
      </div>
    </div>
  );
}
