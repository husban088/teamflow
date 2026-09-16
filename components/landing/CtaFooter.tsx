import Link from "next/link";
import { Waypoints, ArrowRight } from "lucide-react";

export function CtaBand() {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
        <h2 className="mx-auto max-w-md text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.4rem]">
          Give your next project a board it won&apos;t outgrow
        </h2>
        <div className="mt-8 flex justify-center">
          <Link
            href="/signup"
            className="violet-glow group inline-flex h-12 items-center gap-2 rounded-xl bg-violet-gradient px-6 text-[15px] font-medium text-white shadow-[0_8px_24px_-8px_rgba(139,92,246,0.5)] transition-all hover:brightness-110 hover:-translate-y-0.5"
          >
            Create your first board
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-display text-[15px] font-semibold">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-gradient text-white">
                <Waypoints size={13} />
              </span>
              TeamFlow
            </div>
            <p className="mt-3 max-w-[32ch] text-[13.5px] leading-relaxed text-muted-dim">
              Real-time Kanban boards for small teams who&apos;d rather ship than manage a tool.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-dim">Product</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/features" className="text-[13.5px] text-muted transition-colors hover:text-text">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[13.5px] text-muted transition-colors hover:text-text">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-[13.5px] text-muted transition-colors hover:text-text">
                  Get started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-dim">Company</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/contact" className="text-[13.5px] text-muted transition-colors hover:text-text">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[13.5px] text-muted transition-colors hover:text-text">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="text-[13px] text-muted-dim">
            © {new Date().getFullYear()} TeamFlow. Built for teams who ship.
          </p>
        </div>
      </div>
    </footer>
  );
}
