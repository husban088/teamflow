"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { createClient } from "@/lib/supabase/client";
import type { Board, Column, Task, BoardMember } from "@/lib/types";
import { updateTask } from "@/lib/api";
import { BoardHeader } from "@/components/board/BoardHeader";
import { ColumnLane } from "@/components/board/ColumnLane";
import { TaskCard } from "@/components/board/TaskCard";
import { TaskModal } from "@/components/board/TaskModal";
import { InviteMemberModal } from "@/components/board/InviteMemberModal";

export function KanbanBoard({
  board,
  initialColumns,
  initialTasks,
  initialMembers,
  currentUserId,
}: {
  board: Board;
  initialColumns: Column[];
  initialTasks: Task[];
  initialMembers: BoardMember[];
  currentUserId: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [members, setMembers] = useState<BoardMember[]>(initialMembers);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<{ id: string; name: string }[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // ---- Realtime data sync -------------------------------------------------
  useEffect(() => {
    const channel = supabase
      .channel(`board-data-${board.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `board_id=eq.${board.id}` },
        async (payload) => {
          if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== (payload.old as Task).id));
            return;
          }
          const row = payload.new as Task;
          const { data: full } = await supabase
            .from("tasks")
            .select("*, assignee:profiles!tasks_assignee_id_fkey(*)")
            .eq("id", row.id)
            .maybeSingle();
          const nextTask = full ?? row;
          setTasks((prev) => {
            const exists = prev.some((t) => t.id === nextTask.id);
            return exists
              ? prev.map((t) => (t.id === nextTask.id ? nextTask : t))
              : [...prev, nextTask];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "columns", filter: `board_id=eq.${board.id}` },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setColumns((prev) => prev.filter((c) => c.id !== (payload.old as Column).id));
            return;
          }
          const row = payload.new as Column;
          setColumns((prev) => {
            const exists = prev.some((c) => c.id === row.id);
            return exists ? prev.map((c) => (c.id === row.id ? row : c)) : [...prev, row];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "board_members",
          filter: `board_id=eq.${board.id}`,
        },
        async () => {
          const { data } = await supabase
            .from("board_members")
            .select("*, profile:profiles(*)")
            .eq("board_id", board.id);
          if (data) setMembers(data as BoardMember[]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [board.id, supabase]);

  // ---- Presence: who's viewing this board right now -----------------------
  useEffect(() => {
    let name = "Teammate";
    const member = members.find((m) => m.user_id === currentUserId);
    if (member?.profile?.full_name) name = member.profile.full_name;

    const channel = supabase.channel(`presence-board-${board.id}`, {
      config: { presence: { key: currentUserId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<{ name: string }>();
        const users = Object.entries(state).map(([id, entries]) => ({
          id,
          name: entries[0]?.name ?? "Teammate",
        }));
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ name });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board.id, currentUserId, supabase]);

  // ---- Optimistic card creation -------------------------------------------
  // ColumnLane used to only add a new card once the realtime "tasks" event
  // echoed back — that's an extra Supabase round trip on top of the insert
  // itself, which is what made new cards feel slow to appear. Now the card
  // the user typed is shown immediately with a temporary id, then swapped
  // for the real row (or dropped) once the request settles.
  const handleOptimisticTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const handleTaskSettled = useCallback((tempId: string, saved: Task | null) => {
    setTasks((prev) => {
      const withoutTemp = prev.filter((t) => t.id !== tempId);
      if (!saved) return withoutTemp;
      const alreadyPresent = withoutTemp.some((t) => t.id === saved.id);
      return alreadyPresent ? withoutTemp : [...withoutTemp, saved];
    });
  }, []);

  const tasksByColumn = useCallback(
    (columnId: string) =>
      tasks
        .filter((t) => t.column_id === columnId)
        .sort((a, b) => a.position - b.position),
    [tasks]
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeTaskItem = tasks.find((t) => t.id === active.id);
    if (!activeTaskItem) return;

    const overId = String(over.id);
    const overIsColumn = columns.some((c) => c.id === overId);
    const destColumnId = overIsColumn
      ? overId
      : tasks.find((t) => t.id === overId)?.column_id ?? activeTaskItem.column_id;

    const destTasks = tasksByColumn(destColumnId).filter((t) => t.id !== activeTaskItem.id);
    let destIndex = destTasks.length;
    if (!overIsColumn) {
      const overIndex = destTasks.findIndex((t) => t.id === overId);
      if (overIndex !== -1) destIndex = overIndex;
    }
    destTasks.splice(destIndex, 0, { ...activeTaskItem, column_id: destColumnId });

    // Optimistic local update
    setTasks((prev) => {
      const withoutActive = prev.filter((t) => t.id !== activeTaskItem.id);
      const reindexedDest = destTasks.map((t, i) => ({ ...t, position: i }));
      const others = withoutActive.filter((t) => t.column_id !== destColumnId);
      return [...others, ...reindexedDest];
    });

    // Persist: moved task + resequence destination column
    try {
      await Promise.all(
        destTasks.map((t, i) =>
          updateTask(t.id, { column_id: destColumnId, position: i })
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;

  return (
    <div className="flex h-full min-w-0 flex-col">
      <BoardHeader
        board={board}
        members={members}
        onlineUsers={onlineUsers}
        onInvite={() => setInviteOpen(true)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 gap-4 overflow-x-auto p-4 sm:p-6">
          {columns
            .sort((a, b) => a.position - b.position)
            .map((column) => (
              <ColumnLane
                key={column.id}
                column={column}
                tasks={tasksByColumn(column.id)}
                boardId={board.id}
                onOpenTask={setOpenTaskId}
                onOptimisticTask={handleOptimisticTask}
                onTaskSettled={handleTaskSettled}
              />
            ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} overlay /> : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        task={openTask}
        members={members}
        currentUserId={currentUserId}
        onClose={() => setOpenTaskId(null)}
      />

      <InviteMemberModal
        open={inviteOpen}
        boardId={board.id}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
}
