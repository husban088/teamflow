import { LayoutGrid, UserPlus, MoveRight, MessagesSquare, CheckCheck } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { PageHero } from "@/components/landing/PageHero";
import { FAQ } from "@/components/landing/FAQ";
import { CtaBand, Footer } from "@/components/landing/CtaFooter";

const STEPS = [
  {
    icon: LayoutGrid,
    step: "01",
    title: "Create a board",
    desc: "Name it after the project you're running. To do, In progress and Done are set up automatically, and you can add or rename columns any time.",
  },
  {
    icon: UserPlus,
    step: "02",
    title: "Invite your team",
    desc: "Add teammates by email — no seats to buy, no plan to upgrade first. Everyone who joins sees the same board update in real time.",
  },
  {
    icon: MoveRight,
    step: "03",
    title: "Move work forward",
    desc: "Drag cards across the board as work progresses. Set a deadline, an assignee and a priority flag so status is visible without asking.",
  },
  {
    icon: MessagesSquare,
    step: "04",
    title: "Keep context on the card",
    desc: "Drop a comment, attach a file, or reply to a teammate — right where the work lives, instead of scattered across chat threads.",
  },
  {
    icon: CheckCheck,
    step: "05",
    title: "Ship, and see it happen",
    desc: "Watch cards land in Done in real time. No status meeting required to know where the project actually stands.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="grain min-h-dvh overflow-x-hidden">
      <Nav />
      <main>
        <PageHero
          eyebrow="How it works"
          title={
            <>
              From empty board
              <br className="hidden sm:block" /> to shipped work
            </>
          }
          description="Five steps, no onboarding call required. Most teams have their first board moving inside two minutes of signing up."
        />

        <section className="border-t border-line py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <div className="relative space-y-10 sm:space-y-14">
              <div
                className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-line-solid sm:block"
                aria-hidden
              />
              {STEPS.map(({ icon: Icon, step, title, desc }) => (
                <div key={step} className="group relative flex gap-5 sm:gap-8">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line-solid bg-panel text-violet transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-violet/40 group-hover:bg-violet/10 group-hover:shadow-[0_8px_20px_-10px_rgba(139,92,246,0.5)]">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0 pt-1">
                    <span className="font-display text-[13px] font-semibold tracking-wide text-muted-dim">
                      STEP {step}
                    </span>
                    <h3 className="mt-1 text-[19px] font-medium text-text">{title}</h3>
                    <p className="mt-2 max-w-[56ch] text-[14.5px] leading-relaxed text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQ />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
