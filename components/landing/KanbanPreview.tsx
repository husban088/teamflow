"use client";

import { motion } from "framer-motion";
import { Paperclip, MessageSquare } from "lucide-react";

const LANES = [
  { name: "To do", accent: "var(--muted)" },
  { name: "In progress", accent: "var(--violet)" },
  { name: "Done", accent: "var(--teal)" },
];

const CARD = { title: "Redesign onboarding flow", who: "AK", tag: "Design" };

const STATIC_CARDS = [
  { lane: 0, title: "Write Q3 launch brief", who: "MN", comments: 2 },
  { lane: 1, title: "Review pricing copy", who: "JL", files: 1 },
  { lane: 2, title: "Ship dark mode toggle", who: "RS", comments: 4 },
  { lane: 0, title: "Interview 3 candidates", who: "TQ" },
];

export function KanbanPreview() {
  return (
    <div className="relative">
      <div
        className="rounded-2xl border border-line-solid bg-panel p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:p-5"
        style={{ transform: "perspective(1400px) rotateY(-6deg) rotateX(2deg)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-coral/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-teal/70" />
          </div>
          <div className="flex -space-x-2">
            {["AK", "MN", "JL"].map((p) => (
              <div
                key={p}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-panel bg-violet/80 text-[10px] font-semibold text-white"
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {LANES.map((lane, laneIdx) => (
            <div key={lane.name} className="min-w-0">
              <div className="mb-2 flex items-center gap-1.5 px-0.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: lane.accent }}
                />
                <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-muted">
                  {lane.name}
                </span>
              </div>
              <div className="space-y-2">
                {STATIC_CARDS.filter((c) => c.lane === laneIdx).map((c) => (
                  <div
                    key={c.title}
                    className="rounded-lg border border-line-solid bg-panel-raised p-2.5"
                  >
                    <p className="text-[11px] leading-snug text-text">{c.title}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-violet/70 text-[8px] font-bold text-white">
                        {c.who}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-dim">
                        {c.comments && (
                          <span className="flex items-center gap-0.5 text-[10px]">
                            <MessageSquare size={10} /> {c.comments}
                          </span>
                        )}
                        {c.files && (
                          <span className="flex items-center gap-0.5 text-[10px]">
                            <Paperclip size={10} /> {c.files}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {laneIdx === 0 && (
                  <motion.div
                    className="rounded-lg border border-violet/40 bg-panel-raised p-2.5 shadow-[0_0_0_1px_rgba(139,92,246,0.18)]"
                    animate={{
                      x: [0, 0, 210, 210, 0],
                      opacity: [1, 1, 1, 1, 1],
                    }}
                    transition={{
                      duration: 6,
                      times: [0, 0.35, 0.5, 0.85, 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <p className="text-[11px] leading-snug text-text">{CARD.title}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-teal/70 text-[8px] font-bold text-white">
                        {CARD.who}
                      </div>
                      <span className="rounded-full bg-violet/15 px-1.5 py-0.5 text-[9px] text-violet">
                        {CARD.tag}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-line-solid bg-panel px-3.5 py-2.5 shadow-xl sm:block">
        <p className="text-[11px] text-muted">Live now</p>
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-text">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />3 teammates online
        </p>
      </div>
    </div>
  );
}
