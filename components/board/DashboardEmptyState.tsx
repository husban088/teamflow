"use client";

import { useState } from "react";
import { Waypoints, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NewBoardModal } from "@/components/board/NewBoardModal";

export function DashboardEmptyState() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="animate-fade-up text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-line-solid bg-panel text-violet">
          <Waypoints size={24} />
        </div>
        <h1 className="font-display text-[22px] font-semibold">Start your first board</h1>
        <p className="mx-auto mt-2 max-w-sm text-[14.5px] text-muted">
          A board holds every task for a project — create one and invite your
          team when you&apos;re ready.
        </p>
        <Button onClick={() => setOpen(true)} className="mx-auto mt-6">
          <Plus size={16} />
          Create a board
        </Button>
      </div>
      <NewBoardModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
