"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-violet-gradient text-white shadow-[0_0_0_1px_rgba(139,92,246,0.35),0_8px_24px_-8px_rgba(139,92,246,0.55)] hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.5),0_12px_32px_-8px_rgba(139,92,246,0.7)] active:scale-[0.98] active:translate-y-0",
  ghost: "text-muted hover:text-text hover:bg-panel-raised active:scale-[0.98]",
  outline:
    "border border-line-solid text-text hover:border-violet/40 hover:bg-panel-raised hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
  danger: "bg-coral/10 text-coral border border-coral/30 hover:bg-coral/20 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
