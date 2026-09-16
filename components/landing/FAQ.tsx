"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Do I need a credit card to try TeamFlow?",
    a: "No. Create an account, spin up your first board, and invite your team — nothing is charged to get started.",
  },
  {
    q: "How real-time is \"real-time\"?",
    a: "Card moves, comments, and new tasks stream to every open board over a live connection — typically visible to teammates well under a second after you make the change.",
  },
  {
    q: "Can I invite people outside my company?",
    a: "Yes. Invite anyone by email and they get exactly the boards you add them to, nothing more.",
  },
  {
    q: "What happens to attachments and comments if I delete a board?",
    a: "Deleting a board removes its columns, tasks, comments and files permanently — we show a confirmation first since it can't be undone.",
  },
  {
    q: "Is there a limit on boards or teammates?",
    a: "Create as many boards as your work needs and invite your whole team — TeamFlow doesn't cap either.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="max-w-lg">
          <h2 className="text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.4rem]">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Can&apos;t find what you&apos;re after? Reach out on the contact page.
          </p>
        </div>

        <div className="mt-10 divide-y divide-line border-t border-b border-line">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-[15px] font-medium text-text">{item.q}</span>
                  <Plus
                    size={18}
                    className={cn(
                      "shrink-0 text-violet transition-transform duration-300",
                      isOpen && "rotate-45"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <p className="min-h-0 max-w-[60ch] text-[14.5px] leading-relaxed text-muted">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
