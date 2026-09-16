"use client";

import { useEffect, useState, FormEvent, useMemo } from "react";
import { CldUploadButton } from "next-cloudinary";
import {
  Trash2,
  Paperclip,
  Send,
  FileText,
  CalendarClock,
  User,
  Flag,
} from "lucide-react";
import type { Task, BoardMember, Comment, Attachment, Priority } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Textarea } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn, getErrorMessage, PRIORITY_META } from "@/lib/utils";
import { updateTask, deleteTask, addComment, addAttachment } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";

export function TaskModal({
  task,
  members,
  onClose,
}: {
  task: Task | null;
  members: BoardMember[];
  currentUserId: string;
  onClose: () => void;
}) {
  return (
    <Modal open={!!task} onClose={onClose} width={640}>
      {task && (
        <TaskModalContent key={task.id} task={task} members={members} onClose={onClose} />
      )}
    </Modal>
  );
}

function TaskModalContent({
  task,
  members,
  onClose,
}: {
  task: Task;
  members: BoardMember[];
  onClose: () => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const toast = useToast();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const [{ data: c }, { data: a }] = await Promise.all([
        supabase
          .from("comments")
          .select("*, profile:profiles(*)")
          .eq("task_id", task.id)
          .order("created_at"),
        supabase
          .from("attachments")
          .select("*")
          .eq("task_id", task.id)
          .order("created_at"),
      ]);
      if (!active) return;
      setComments((c as Comment[]) ?? []);
      setAttachments((a as Attachment[]) ?? []);
    }
    load();

    const channel = supabase
      .channel(`task-${task.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `task_id=eq.${task.id}` },
        async (payload) => {
          const { data } = await supabase
            .from("comments")
            .select("*, profile:profiles(*)")
            .eq("id", (payload.new as Comment).id)
            .single();
          if (!data) return;
          // The comment we just posted ourselves is already appended
          // optimistically in handleAddComment — skip it here so it doesn't
          // show up twice when this realtime echo arrives.
          setComments((prev) =>
            prev.some((c) => c.id === data.id) ? prev : [...prev, data as Comment]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "attachments", filter: `task_id=eq.${task.id}` },
        (payload) => {
          setAttachments((prev) => [...prev, payload.new as Attachment]);
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [task.id, supabase]);

  async function handleTitleBlur() {
    if (title.trim() && title !== task.title) {
      await updateTask(task.id, { title: title.trim() });
    }
  }

  async function handleDescriptionBlur() {
    if (description !== (task.description ?? "")) {
      await updateTask(task.id, { description: description || null });
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted", `"${task.title}" has been removed.`);
      setConfirmDeleteOpen(false);
      onClose();
    } catch (err) {
      toast.error("Couldn't delete task", getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  async function handleAddComment(e: FormEvent) {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;
    setSending(true);
    try {
      // Show it the moment it saves instead of waiting on the realtime
      // subscription to echo it back — that round trip was why a comment
      // only appeared after closing and reopening the task.
      const saved = await addComment(task.id, content);
      setNewComment("");
      setComments((prev) =>
        prev.some((c) => c.id === saved.id) ? prev : [...prev, saved as Comment]
      );
    } catch (err) {
      toast.error("Couldn't add comment", getErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
      <div className="p-6 sm:p-7">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="w-full bg-transparent pr-8 font-display text-[20px] font-semibold text-text outline-none"
        />

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <MetaField icon={<CalendarClock size={13} />} label="Deadline">
            <input
              type="date"
              value={task.deadline ? task.deadline.slice(0, 10) : ""}
              onChange={(e) =>
                updateTask(task.id, {
                  deadline: e.target.value ? new Date(e.target.value).toISOString() : null,
                })
              }
              className="w-full bg-transparent text-[13px] text-text outline-none [color-scheme:light]"
            />
          </MetaField>


          <MetaField icon={<User size={13} />} label="Assignee">
            <select
              value={task.assignee_id ?? ""}
              onChange={(e) => updateTask(task.id, { assignee_id: e.target.value || null })}
              className="w-full cursor-pointer bg-transparent text-[13px] text-text outline-none"
            >
              <option value="" className="bg-panel">
                Unassigned
              </option>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id} className="bg-panel">
                  {m.profile?.full_name || m.profile?.email}
                </option>
              ))}
            </select>
          </MetaField>

          <MetaField icon={<Flag size={13} />} label="Priority">
            <select
              value={task.priority}
              onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}
              className="w-full cursor-pointer bg-transparent text-[13px] text-text outline-none"
            >
              {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
                <option key={p} value={p} className="bg-panel">
                  {PRIORITY_META[p].label}
                </option>
              ))}
            </select>
          </MetaField>
        </div>

        <div className="mt-6">
          <p className="mb-1.5 text-[12px] font-medium text-muted">Description</p>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Add more detail about this task..."
          />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-muted">
              <Paperclip size={13} /> Attachments
            </p>
            <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{ maxFiles: 1 }}
              onSuccess={async (result) => {
                const info = result?.info;
                if (info && typeof info === "object" && "secure_url" in info) {
                  await addAttachment({
                    taskId: task.id,
                    url: info.secure_url as string,
                    filename: (info.original_filename as string) || "file",
                    resourceType: (info.resource_type as string) || "raw",
                  });
                }
              }}
              className="text-[12px] font-medium text-violet hover:underline"
            >
              Upload file
            </CldUploadButton>
          </div>
          {attachments.length === 0 ? (
            <p className="text-[13px] text-muted-dim">No files yet.</p>
          ) : (
            <div className="space-y-1.5">
              {attachments.map((a) => (
                <a
                  key={a.id}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-line-solid bg-panel-raised px-3 py-2 text-[13px] text-text transition-colors hover:border-muted-dim"
                >
                  <FileText size={14} className="shrink-0 text-muted" />
                  <span className="min-w-0 truncate">{a.filename}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="mb-2 text-[12px] font-medium text-muted">
            Comments ({comments.length})
          </p>
          <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <Avatar name={c.profile?.full_name || c.profile?.email} size={26} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-medium text-text">
                      {c.profile?.full_name || c.profile?.email}
                    </span>
                    <span className="text-[11px] text-muted-dim">
                      {new Date(c.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted">{c.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="mt-4 flex items-end gap-2">
            <Textarea
              rows={1}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment(e);
                }
              }}
              placeholder="Write a comment..."
              className="min-h-11 py-2.5"
            />
            <Button type="submit" size="md" loading={sending} className="shrink-0 px-3">
              <Send size={15} />
            </Button>
          </form>
        </div>

        <div className="mt-7 flex justify-end border-t border-line pt-4">
          <Button variant="danger" size="sm" onClick={() => setConfirmDeleteOpen(true)}>
            <Trash2 size={13} />
            Delete task
          </Button>
        </div>

        <ConfirmModal
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Delete this task?"
          confirmLabel="Delete task"
          description={`This permanently deletes "${task.title}" along with its comments and attachments. This can't be undone.`}
        />
      </div>
  );
}

function MetaField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line-solid bg-panel-raised px-3 py-2">
      <p className={cn("mb-1 flex items-center gap-1.5 text-[10.5px] text-muted-dim")}>
        {icon}
        {label}
      </p>
      {children}
    </div>
  );
}
