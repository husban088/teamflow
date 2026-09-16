"use client";

import { motion, type Variants } from "framer-motion";
import { Rocket, Palette, Code2, Megaphone, Users2, Briefcase } from "lucide-react";

const CASES = [
  {
    icon: Rocket,
    label: "Early-stage startups",
    desc: "Move fast without losing track of who owns what this week.",
  },
  {
    icon: Code2,
    label: "Engineering teams",
    desc: "Sprint work, bugs and reviews on one board everyone actually opens.",
  },
  {
    icon: Palette,
    label: "Design studios",
    desc: "Client feedback and revisions attached right to the card, not buried in email.",
  },
  {
    icon: Megaphone,
    label: "Marketing teams",
    desc: "Campaigns, deadlines and assets stay visible from brief to launch.",
  },
  {
    icon: Briefcase,
    label: "Agencies",
    desc: "Separate boards per client, one dashboard for you to see it all.",
  },
  {
    icon: Users2,
    label: "Remote-first teams",
    desc: "Async by default — a glance at the board replaces half your stand-up.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function UseCases() {
  return (
    <section className="relative border-t border-line py-20 sm:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[860px] -translate-x-1/2 opacity-40 blur-[110px]"
        style={{ background: "radial-gradient(closest-side, var(--violet), transparent)" }}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-violet">
            Built for every kind of team
          </p>
          <h2 className="text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.4rem]">
            Whoever your team is, TeamFlow fits the way you work
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="card-luxury group rounded-2xl p-6"
            >
              <div className="icon-pop mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-line-solid bg-panel-raised text-violet transition-colors duration-300 group-hover:border-violet/40 group-hover:bg-violet/10">
                <Icon size={18} />
              </div>
              <h3 className="text-[15.5px] font-semibold text-text">{label}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
