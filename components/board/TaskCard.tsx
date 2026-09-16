"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarClock } from "lucide-react";
import type { Task } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { PRIORITY_META, formatDeadline, cn } from "@/lib/utils";

export function TaskCard({
  task,
  onClick,
  overlay,
}: {
  task: Task;
  onClick?: () => void;
  overlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: overlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const deadline = formatDeadline(task.deadline);
  const priority = PRIORITY_META[task.priority];

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
      onClick={onClick}
      className={cn(
        "glow-ring group cursor-pointer rounded-lg border border-line-solid bg-panel p-3",
        overlay && "rotate-2 shadow-2xl"
      )}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full transition-transform duration-200 group-hover:scale-150"
          style={{ background: priority.color }}
        />
        <span className="text-[10.5px] text-muted-dim">{priority.label} priority</span>
      </div>

      <p className="text-[13.5px] leading-snug text-text">{task.title}</p>

      {(deadline || task.assignee_id) && (
        <div className="mt-3 flex items-center justify-between">
          {deadline ? (
            <span
              className={cn(
                "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px]",
                deadline.tone === "overdue" && "bg-coral/15 text-coral",
                deadline.tone === "soon" && "bg-amber/15 text-amber",
                deadline.tone === "normal" && "bg-panel-raised text-muted"
              )}
            >
              <CalendarClock size={11} />
              {deadline.label}
            </span>
          ) : (
            <span />
          )}
          {task.assignee && <Avatar name={task.assignee.full_name || task.assignee.email} size={22} />}
        </div>
      )}
    </div>
  );
}
