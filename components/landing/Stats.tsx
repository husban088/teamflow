"use client";

import { motion, type Variants } from "framer-motion";

const STATS = [
  { value: "12k+", label: "Boards created" },
  { value: "180ms", label: "Avg. sync latency" },
  { value: "99.95%", label: "Uptime last 12 months" },
  { value: "4.9/5", label: "Average team rating" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Stats() {
  return (
    <section className="border-t border-line py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="card-luxury rounded-2xl px-5 py-6 text-center sm:text-left"
            >
              <p className="font-display text-[1.9rem] font-semibold tracking-tight text-text sm:text-[2.1rem]">
                {s.value}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
