import Link from "next/link";
import {
  GitBranch,
  Radio,
  ListChecks,
  MessagesSquare,
  Paperclip,
  Users,
  CalendarClock,
  Flag,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { PageHero } from "@/components/landing/PageHero";
import { CtaBand, Footer } from "@/components/landing/CtaFooter";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Drag cards between stages",
    desc: "Move work from To do to Done with a single gesture. Order and column changes save instantly, for you and everyone watching the board.",
  },
  {
    icon: Radio,
    title: "Truly live boards",
    desc: "When a teammate edits a card, you see it change in front of you — no refresh button required, no stale state to reconcile.",
  },
  {
    icon: ListChecks,
    title: "Detail where it's needed",
    desc: "Every card holds a description, a deadline and an assignee, so nothing important lives only in someone's head or a side chat.",
  },
  {
    icon: MessagesSquare,
    title: "Discussion stays with the task",
    desc: "Comment threads sit right under the card they're about, so context never gets lost scrolling back through chat history.",
  },
  {
    icon: Paperclip,
    title: "Attach the file that matters",
    desc: "Drop a mockup, spec or screenshot straight onto a card for anyone on the board to open — no separate drive link to hunt down.",
  },
  {
    icon: Users,
    title: "Built for whole teams",
    desc: "Invite teammates by email, assign work across the board, and always know who owns what and by when.",
  },
  {
    icon: CalendarClock,
    title: "Deadlines that stay visible",
    desc: "Due dates show right on the card face, so nothing slips through because it was buried three clicks deep.",
  },
  {
    icon: Flag,
    title: "Priority at a glance",
    desc: "Flag urgent work so it stands out on a busy board, without needing a separate triage meeting to explain why.",
  },
  {
    icon: Bell,
    title: "Presence, not guesswork",
    desc: "See who else is looking at a board right now, so you know when it's safe to jump in and start moving cards.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="grain min-h-dvh overflow-x-hidden">
      <Nav />
      <main>
        <PageHero
          eyebrow="Features"
          title={
            <>
              Everything a small team needs,
              <br className="hidden sm:block" /> nothing it doesn&apos;t
            </>
          }
          description="TeamFlow keeps the parts of project work that actually slow teams down — status, ownership, context — in one board that updates itself."
        />

        <section className="border-t border-line py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="hover-lift group -m-3 rounded-2xl border border-transparent p-3 transition-colors hover:border-line-solid hover:bg-panel"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-line-solid bg-panel text-violet transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-violet/40 group-hover:bg-violet/10 group-hover:shadow-[0_8px_20px_-10px_rgba(139,92,246,0.5)]">
                    <Icon size={19} />
                  </div>
                  <h3 className="text-[16px] font-medium text-text">{title}</h3>
                  <p className="mt-2 max-w-[40ch] text-[14.5px] leading-relaxed text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="card-luxury flex flex-col items-start justify-between gap-8 rounded-3xl p-8 sm:flex-row sm:items-center sm:p-12">
              <div className="max-w-md">
                <h2 className="text-[1.7rem] font-semibold leading-tight tracking-tight sm:text-[2rem]">
                  See it move on a real board
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  The fastest way to understand a live board is to open one. Your first board is ready in under two minutes.
                </p>
              </div>
              <Link
                href="/signup"
                className="violet-glow group inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-violet-gradient px-6 text-[15px] font-medium text-white transition-all hover:brightness-110 hover:-translate-y-0.5"
              >
                Start for free
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
