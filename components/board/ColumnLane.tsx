"use client";

import { useState, FormEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, X } from "lucide-react";
import type { Column, Task } from "@/lib/types";
import { createTask } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { TaskCard } from "@/components/board/TaskCard";
import { useToast } from "@/components/ui/Toast";

export function ColumnLane({
  column,
  tasks,
  boardId,
  onOpenTask,
  onOptimisticTask,
  onTaskSettled,
}: {
  column: Column;
  tasks: Task[];
  boardId: string;
  onOpenTask: (taskId: string) => void;
  onOptimisticTask: (task: Task) => void;
  onTaskSettled: (tempId: string, saved: Task | null) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    // Show the card right away instead of waiting on the round trip —
    // it's swapped for the real row (or removed) once the request settles.
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    onOptimisticTask({
      id: tempId,
      board_id: boardId,
      column_id: column.id,
      title: trimmed,
      description: null,
      deadline: null,
      assignee_id: null,
      priority: "medium",
      position: tasks.length,
      created_by: "",
      created_at: new Date().toISOString(),
    });
    setTitle("");
    setAdding(false);

    createTask({ boardId, columnId: column.id, title: trimmed, position: tasks.length })
      .then((saved) => onTaskSettled(tempId, saved))
      .catch((err) => {
        onTaskSettled(tempId, null);
        toast.error("Couldn't add card", getErrorMessage(err));
      });
  }

  return (
    <div className="flex w-[280px] shrink-0 flex-col sm:w-[300px]">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="h-2 w-2 rounded-full" style={{ background: column.color }} />
        <h2 className="text-[13.5px] font-medium text-text">{column.name}</h2>
        <span className="rounded-full bg-panel-raised px-1.5 py-0.5 text-[11px] text-muted-dim">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2.5 overflow-y-auto rounded-xl p-1.5 transition-colors duration-200 ${
          isOver ? "bg-violet/10 ring-1 ring-inset ring-violet/30" : ""
        }`}
        style={{ minHeight: 120 }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onOpenTask(task.id)} />
          ))}
        </SortableContext>

        {adding ? (
          <form
            onSubmit={handleAdd}
            className="rounded-lg border border-violet/40 bg-panel-raised p-2.5"
          >
            <textarea
              autoFocus
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAdd(e);
                }
              }}
              placeholder="Task title..."
              className="w-full resize-none bg-transparent text-[13px] text-text outline-none placeholder:text-muted-dim"
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-lg bg-violet px-2.5 py-1 text-[12px] font-medium text-white hover:bg-violet-dim disabled:opacity-50"
              >
                Add card
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setTitle("");
                }}
                className="rounded-lg p-1 text-muted hover:text-text"
              >
                <X size={15} />
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="press flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-[13px] text-muted-dim transition-all duration-200 hover:bg-panel-raised hover:text-text hover:translate-x-0.5"
          >
            <Plus size={14} />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}
