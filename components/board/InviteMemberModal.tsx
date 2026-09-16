"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Field, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { inviteMember } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/utils";

export function InviteMemberModal({
  open,
  boardId,
  onClose,
}: {
  open: boolean;
  boardId: string;
  onClose: () => void;
}) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter an email address.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await inviteMember(boardId, email);
      setSuccess(true);
      toast.success("Invite sent", `${email.trim()} was added to the board.`);
      setEmail("");
    } catch (err) {
      const message = getErrorMessage(err, "Couldn't add that teammate");
      setError(message);
      toast.error("Couldn't add teammate", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setError(null);
        setSuccess(false);
      }}
      width={420}
    >
      <div className="p-6 sm:p-7">
        <h2 className="font-display text-[19px] font-semibold">Invite a teammate</h2>
        <p className="mt-1 text-[13.5px] text-muted">
          They need a TeamFlow account already — ask them to sign up first if they&apos;re new.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-[13px] text-coral">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 rounded-lg border border-teal/30 bg-teal/10 px-3 py-2 text-[13px] text-teal">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
              Added to the board.
            </div>
          )}
          <Field label="Email address">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Done
            </Button>
            <Button type="submit" loading={loading}>
              Send invite
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
