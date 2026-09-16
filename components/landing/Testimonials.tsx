"use client";

import { Star } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const QUOTES = [
  {
    quote:
      "We dropped our stand-up from twenty minutes to five. Everyone just glances at the board before we talk.",
    name: "Amina R.",
    role: "Product lead, 6-person team",
  },
  {
    quote:
      "The live cursor updates alone sold my co-founder. We stopped asking \"did you see my message\" entirely.",
    name: "Daniyal K.",
    role: "Founder, early-stage startup",
  },
  {
    quote:
      "Simple enough that our designers actually use it, detailed enough that engineering doesn't complain.",
    name: "Priya S.",
    role: "Ops manager, agency",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-lg">
          <h2 className="text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.4rem]">
            Teams that switched, stayed
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            A handful of the teams running their week on TeamFlow.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {QUOTES.map((t, i) => (
            <motion.figure
              key={t.name}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="card-luxury flex flex-col justify-between rounded-2xl p-6"
            >
              <div>
                <div className="mb-4 flex gap-0.5 text-amber">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="text-[14.5px] leading-relaxed text-text">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-6 border-t border-line pt-4">
                <p className="text-[13.5px] font-medium text-text">{t.name}</p>
                <p className="text-[12.5px] text-muted-dim">{t.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
