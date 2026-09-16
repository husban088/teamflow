"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

interface ToastContextValue {
  show: (variant: ToastVariant, title: string, description?: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 4500;

const VARIANT_META: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; accent: string; iconClass: string }
> = {
  success: { icon: CheckCircle2, accent: "border-teal/30", iconClass: "text-teal" },
  error: { icon: AlertCircle, accent: "border-coral/30", iconClass: "text-coral" },
  info: { icon: Info, accent: "border-violet/30", iconClass: "text-violet" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, variant, title, description }]);
      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  const value: ToastContextValue = {
    show,
    success: (title, description) => show("success", title, description),
    error: (title, description) => show("error", title, description),
    info: (title, description) => show("info", title, description),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2.5 sm:right-6 sm:bottom-6">
            <AnimatePresence>
              {toasts.map((t) => {
                const meta = VARIANT_META[t.variant];
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "glass pointer-events-auto flex items-start gap-2.5 rounded-xl border bg-panel px-4 py-3.5 shadow-2xl",
                      meta.accent
                    )}
                  >
                    <Icon size={18} className={cn("mt-0.5 shrink-0", meta.iconClass)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-medium text-text">{t.title}</p>
                      {t.description && (
                        <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
                          {t.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => dismiss(t.id)}
                      aria-label="Dismiss notification"
                      className="shrink-0 rounded-md p-1 text-muted-dim transition-colors hover:bg-panel-raised hover:text-text"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
