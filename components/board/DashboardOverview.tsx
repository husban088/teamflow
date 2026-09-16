"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  ListTodo,
  Loader2,
  CheckCircle2,
  AtSign,
  Plus,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { NewBoardModal } from "@/components/board/NewBoardModal";
import { ActivityChart } from "@/components/board/ActivityChart";
import { cn } from "@/lib/utils";

export type BoardSummary = {
  id: string;
  name: string;
  description: string | null;
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  members: { id: string; name: string }[];
};

export type MentionSummary = {
  id: string;
  name: string;
  count: number;
};

export function DashboardOverview({
  userName,
  boards,
  totals,
  activity,
  mentions,
}: {
  userName: string;
  boards: BoardSummary[];
  totals: { boards: number; tasks: number; todo: number; inProgress: number; done: number };
  activity: { label: string; count: number }[];
  mentions: MentionSummary[];
}) {
  const [showNewBoard, setShowNewBoard] = useState(false);
  const firstName = userName.split(" ")[0].split("@")[0];
  const totalMentions = mentions.reduce((sum, m) => sum + m.count, 0);
  const donePct = totals.tasks > 0 ? Math.round((totals.done / totals.tasks) * 100) : 0;

  const stats = [
    {
      label: "Boards",
      value: totals.boards,
      icon: LayoutGrid,
      tint: "text-violet",
      bg: "bg-violet/10",
      note: `${totals.tasks} total task${totals.tasks === 1 ? "" : "s"}`,
    },
    {
      label: "To do",
      value: totals.todo,
      icon: ListTodo,
      tint: "text-muted",
      bg: "bg-panel-raised",
      note: "Not started yet",
    },
    {
      label: "In progress",
      value: totals.inProgress,
      icon: Loader2,
      tint: "text-amber",
      bg: "bg-amber/10",
      note: "Being worked on",
    },
    {
      label: "Done",
      value: totals.done,
      icon: CheckCircle2,
      tint: "text-teal",
      bg: "bg-teal/10",
      note: `${donePct}% completion rate`,
    },
  ];

  return (
    <div className="grain flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="animate-fade-up flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] font-medium text-muted-dim">Welcome back</p>
            <h1 className="mt-1 font-display text-[30px] font-semibold leading-tight sm:text-[34px]">
              {firstName}&apos;s Dashboard
            </h1>
            <p className="mt-1.5 max-w-md text-[14px] text-muted">
              Here&apos;s how every board you&apos;re on is moving this week.
            </p>
          </div>
          <button
            onClick={() => setShowNewBoard(true)}
            className="press flex h-11 shrink-0 items-center gap-2 self-start rounded-xl bg-violet-gradient px-4 text-[13.5px] font-medium text-white shadow-[0_0_0_1px_rgba(139,92,246,0.35),0_8px_24px_-8px_rgba(139,92,246,0.55)] transition-all hover:-translate-y-0.5 hover:brightness-110 sm:self-auto"
          >
            <Plus size={16} />
            New board
          </button>
        </div>

        {/* Stat cards */}
        <div className="mt-7 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ animationDelay: `${i * 60}ms` }}
              className="card-luxury animate-fade-up rounded-2xl p-4 sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", s.bg, s.tint)}>
                  <s.icon size={17} />
                </span>
              </div>
              <p
                key={s.value}
                className="animate-number-pop mt-3.5 font-display text-[26px] font-semibold sm:text-[28px]"
              >
                {s.value.toLocaleString()}
              </p>
              <p className="mt-0.5 text-[13px] text-muted">{s.label}</p>
              <p className="mt-2 text-[11.5px] text-muted-dim">{s.note}</p>
            </div>
          ))}
        </div>

        {/* Activity + Mentions */}
        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:gap-4 lg:grid-cols-[1fr_360px]">
          <div
            style={{ animationDelay: "240ms" }}
            className="card-luxury animate-fade-up rounded-2xl p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-[18px] font-semibold">Activity</h2>
                <p className="text-[12.5px] text-muted-dim">Tasks created across your boards, last 7 days</p>
              </div>
              <span className="rounded-full border border-line-solid bg-panel-raised px-3 py-1 text-[12px] font-medium text-muted">
                {activity.reduce((a, b) => a + b.count, 0)} this week
              </span>
            </div>
            <div className="mt-6">
              <ActivityChart data={activity} />
            </div>
          </div>

          <div
            style={{ animationDelay: "300ms" }}
            className="card-luxury animate-fade-up rounded-2xl p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[18px] font-semibold">Mentions</h2>
              <AtSign size={16} className="text-muted-dim" />
            </div>
            <p className="text-[12.5px] text-muted-dim">Who&apos;s getting tagged in task comments</p>

            <div className="mt-5 space-y-1">
              {mentions.length === 0 && (
                <p className="rounded-xl border border-dashed border-line-solid px-3 py-6 text-center text-[13px] text-muted-dim">
                  No @mentions in comments yet
                </p>
              )}
              {mentions.map((m) => {
                const pct = totalMentions > 0 ? Math.round((m.count / totalMentions) * 100) : 0;
                return (
                  <div
                    key={m.id}
                    className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-panel-raised"
                  >
                    <Avatar name={m.name} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium text-text">{m.name}</p>
                      <p className="text-[11.5px] text-muted-dim">
                        {m.count} mention{m.count === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="text-[13px] font-semibold text-violet">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Boards grid */}
        <div className="mt-8">
          <div
            style={{ animationDelay: "360ms" }}
            className="animate-fade-up flex items-center justify-between"
          >
            <div>
              <h2 className="font-display text-[19px] font-semibold">Your boards</h2>
              <p className="text-[12.5px] text-muted-dim">
                {boards.length} board{boards.length === 1 ? "" : "s"} · {totals.tasks} task
                {totals.tasks === 1 ? "" : "s"} total
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {boards.map((b, i) => {
              const pct = b.total > 0 ? Math.round((b.done / b.total) * 100) : 0;
              return (
                <Link
                  key={b.id}
                  href={`/dashboard/board/${b.id}`}
                  style={{ animationDelay: `${420 + i * 50}ms` }}
                  className="card-luxury glow-ring animate-fade-up group flex flex-col rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-[16px] font-semibold text-text">{b.name}</h3>
                      <p className="mt-1 line-clamp-2 text-[12.5px] text-muted-dim">
                        {b.description || "No description yet"}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="mt-0.5 shrink-0 text-muted-dim opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-violet group-hover:opacity-100"
                    />
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[11.5px] text-muted-dim">
                      <span>Progress</span>
                      <span className="font-medium text-text">{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-panel-raised">
                      <div
                        className="h-full rounded-full bg-violet-gradient transition-[width] duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11.5px] text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#8b8398" }} />
                      {b.todo} to do
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet" />
                      {b.inProgress} in progress
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                      {b.done} done
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
                    <div className="flex -space-x-2">
                      {b.members.slice(0, 4).map((m) => (
                        <Avatar key={m.id} name={m.name} size={24} ring />
                      ))}
                      {b.members.length > 4 && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-panel-raised text-[10px] font-medium text-muted ring-2 ring-ink">
                          +{b.members.length - 4}
                        </span>
                      )}
                      {b.members.length === 0 && (
                        <span className="flex items-center gap-1 text-[11.5px] text-muted-dim">
                          <Users size={12} /> No members
                        </span>
                      )}
                    </div>
                    <span className="text-[11.5px] font-medium text-muted-dim">
                      {b.total} task{b.total === 1 ? "" : "s"}
                    </span>
                  </div>
                </Link>
              );
            })}

            <button
              onClick={() => setShowNewBoard(true)}
              style={{ animationDelay: `${420 + boards.length * 50}ms` }}
              className="press animate-fade-up flex min-h-[220px] flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-line-solid text-muted transition-all hover:-translate-y-0.5 hover:border-violet/50 hover:bg-panel-raised hover:text-text hover:shadow-[0_18px_34px_-18px_rgba(76,29,149,0.35)]"
            >
              <span className="icon-pop flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-line-solid text-violet">
                <Plus size={18} />
              </span>
              <span className="text-[13.5px] font-medium">Create a new board</span>
            </button>
          </div>
        </div>
      </div>

      <NewBoardModal open={showNewBoard} onClose={() => setShowNewBoard(false)} />
    </div>
  );
}
