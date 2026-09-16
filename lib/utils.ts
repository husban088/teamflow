export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Supabase/Postgrest throws plain objects, not real `Error` instances, so
 * `err instanceof Error` is false for them and their real message (RLS
 * violation, not-null violation, FK violation, etc.) got swallowed and
 * replaced with a generic fallback everywhere this pattern was used.
 * This pulls the real message out of anything Supabase/Postgres can throw.
 */
export function getErrorMessage(err: unknown, fallback = "Something went wrong") {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const e = err as { message?: string; error_description?: string; details?: string };
    if (e.message) return e.message;
    if (e.error_description) return e.error_description;
    if (e.details) return e.details;
  }
  return fallback;
}

export function initials(name: string | null | undefined, fallback = "?") {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDeadline(iso: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const label = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  if (diffDays < 0) return { label, tone: "overdue" as const };
  if (diffDays === 0) return { label: "Today", tone: "soon" as const };
  if (diffDays === 1) return { label: "Tomorrow", tone: "soon" as const };
  if (diffDays <= 3) return { label, tone: "soon" as const };
  return { label, tone: "normal" as const };
}

export const PRIORITY_META = {
  low: { label: "Low", color: "var(--teal)" },
  medium: { label: "Medium", color: "var(--amber)" },
  high: { label: "High", color: "var(--coral)" },
} as const;
