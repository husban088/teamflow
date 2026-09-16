"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { GitBranch, Radio, ListChecks, ArrowRight } from "lucide-react";

const PREVIEW_FEATURES = [
  {
    icon: GitBranch,
    title: "Drag cards between stages",
    desc: "Move work from To do to Done with a single gesture. Order and column changes save instantly.",
  },
  {
    icon: Radio,
    title: "Truly live boards",
    desc: "When a teammate edits a card, you see it change in front of you — no refresh button required.",
  },
  {
    icon: ListChecks,
    title: "Detail where it's needed",
    desc: "Every card holds a description, a deadline and an assignee, so nothing lives only in someone's head.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Features() {
  return (
    <section className="relative border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg"
          >
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-violet">
              Why teams switch
            </p>
            <h2 className="text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.4rem]">
              Everything a small team needs to stay in sync
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              Nothing you have to configure for a week before it&apos;s useful.
            </p>
          </motion.div>
          <Link
            href="/features"
            className="group inline-flex shrink-0 items-center gap-1.5 text-[14.5px] font-medium text-violet"
          >
            Explore all features
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {PREVIEW_FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="card-luxury group rounded-2xl p-7"
            >
              <div className="icon-pop mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-line-solid bg-violet-gradient text-white shadow-[0_10px_24px_-12px_rgba(124,58,237,0.6)]">
                <Icon size={19} />
              </div>
              <h3 className="text-[16.5px] font-semibold text-text">{title}</h3>
              <p className="mt-2.5 max-w-[38ch] text-[14.5px] leading-relaxed text-muted">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
