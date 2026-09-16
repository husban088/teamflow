"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { KanbanPreview } from "./KanbanPreview";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="animate-ambient-pulse pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--violet), transparent)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_1fr] lg:pb-28">
        <div>
          <motion.p
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-solid bg-panel px-3 py-1 text-[13px] text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Real-time boards for small teams
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-lg text-[2.15rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.9rem] lg:text-[3.2rem]"
          >
            Plan the work.
            <br />
            <span className="text-gradient">Watch it move.</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-muted"
          >
            TeamFlow is a Kanban workspace where every card, comment and file
            updates the moment a teammate touches it — no refresh, no
            guessing who&apos;s doing what.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/signup"
              className="violet-glow group inline-flex h-12 items-center gap-2 rounded-xl bg-violet-gradient px-6 text-[15px] font-medium text-white shadow-[0_8px_24px_-8px_rgba(139,92,246,0.5)] transition-all hover:brightness-110 hover:-translate-y-0.5"
            >
              Start for free
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex h-12 items-center rounded-xl border border-line-solid px-6 text-[15px] font-medium text-text transition-all hover:-translate-y-0.5 hover:border-violet/40 hover:bg-panel-raised"
            >
              See how it works
            </Link>
          </motion.div>

          <motion.p
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-6 text-[13px] text-muted-dim"
          >
            No credit card. Set up your first board in under two minutes.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <KanbanPreview />
        </motion.div>
      </div>
    </section>
  );
}
