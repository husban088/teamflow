"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReloadButton({
  className,
  label = "Reload",
}: {
  className?: string;
  label?: string;
}) {
  const [spinning, setSpinning] = useState(false);

  function handleClick() {
    setSpinning(true);
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={spinning}
      title="Reload page"
      aria-label="Reload page"
      className={cn(
        "press inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-line-solid px-3 text-[13px] font-medium text-muted transition-all hover:border-violet/40 hover:bg-panel-raised hover:text-text disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
    >
      <RotateCw size={14} className={cn(spinning && "animate-spin")} />
      {label}
    </button>
  );
}
