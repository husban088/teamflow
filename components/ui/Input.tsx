"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      "w-full h-11 rounded-xl bg-panel-raised border border-line-solid px-3.5 text-[15px] text-text placeholder:text-muted-dim outline-none transition-colors focus:border-violet",
      invalid && "border-coral/60 focus:border-coral",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full h-11 rounded-xl bg-panel-raised border border-line-solid pl-3.5 pr-11 text-[15px] text-text placeholder:text-muted-dim outline-none transition-colors focus:border-violet",
          invalid && "border-coral/60 focus:border-coral",
          className
        )}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-dim transition-colors hover:bg-panel hover:text-muted"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl bg-panel-raised border border-line-solid px-3.5 py-3 text-[15px] text-text placeholder:text-muted-dim outline-none transition-colors focus:border-violet resize-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string | null;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-muted">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-coral">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-muted-dim">{hint}</span>
      )}
    </label>
  );
}
