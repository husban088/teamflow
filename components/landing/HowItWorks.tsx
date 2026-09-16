import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: "1",
    title: "Create a board",
    desc: "Name it after the project. Todo, In Progress and Done are set up for you automatically.",
  },
  {
    step: "2",
    title: "Invite your team",
    desc: "Add teammates by email. Everyone who joins sees the same board update in real time.",
  },
  {
    step: "3",
    title: "Move work forward",
    desc: "Drag cards across the board, drop in files, leave comments — the board never goes stale.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="max-w-lg text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.4rem]">
            From empty board to shipped work
          </h2>
          <Link
            href="/how-it-works"
            className="group inline-flex shrink-0 items-center gap-1.5 text-[14.5px] font-medium text-violet"
          >
            See the full walkthrough
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((s) => (
            <div key={s.step} className="group relative">
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-display text-3xl font-semibold text-violet transition-transform duration-300 group-hover:-translate-y-1">
                  {s.step}
                </span>
                <div className="h-px flex-1 bg-line-solid transition-colors duration-300 group-hover:bg-violet/40" />
              </div>
              <h3 className="text-[17px] font-medium text-text">{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
