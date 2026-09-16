"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} width={400}>
      <div className="p-6 sm:p-7">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-coral/10 text-coral">
          <AlertTriangle size={20} />
        </div>
        <h2 className="font-display text-[18px] font-semibold">{title}</h2>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
