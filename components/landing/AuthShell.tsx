import Link from "next/link";
import { Waypoints } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grain flex min-h-dvh items-center justify-center overflow-x-hidden px-5 py-12">
      <div
        className="pointer-events-none fixed -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(closest-side, var(--violet), transparent)" }}
      />
      <div className="relative w-full max-w-[400px] animate-fade-up">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-display text-[17px] font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-gradient text-white">
            <Waypoints size={16} />
          </span>
          TeamFlow
        </Link>

        <div className="rounded-2xl border border-line-solid bg-panel p-7 shadow-2xl sm:p-8">
          <h1 className="font-display text-[22px] font-semibold">{title}</h1>
          <p className="mt-1.5 text-[14px] text-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>

        <p className="mt-6 text-center text-[14px] text-muted">{footer}</p>
      </div>
    </div>
  );
}
