"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createBoard } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/utils";

export function NewBoardModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give your board a name first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // owner_id is filled server-side from auth.uid() — no client id needed.
      const board = await createBoard(name.trim(), description);
      setName("");
      setDescription("");
      onClose();
      toast.success("Board created", `"${board.name}" is ready to go.`);
      router.push(`/dashboard/board/${board.id}`);
      router.refresh();
    } catch (err) {
      const message = getErrorMessage(err);
      const code = (err as { code?: string })?.code;
      const details = (err as { details?: string })?.details;
      const hint = (err as { hint?: string })?.hint;
      console.error("createBoard failed:", { message, code, details, hint, raw: err });
      setError(code ? `${message} (code: ${code})` : message);
      toast.error("Couldn't create board", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} width={440}>
      <div className="p-6 sm:p-7">
        <h2 className="font-display text-[19px] font-semibold">Create a board</h2>
        <p className="mt-1 text-[13.5px] text-muted">
          You&apos;ll get To do, In progress and Done columns to start.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-[13px] text-coral">
              {error}
            </p>
          )}
          <Field label="Board name">
            <Input
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Website Redesign"
            />
          </Field>
          <Field label="Description (optional)">
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this board for?"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create board
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
