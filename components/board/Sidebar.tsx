"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Waypoints, Plus, LogOut, LayoutGrid, Menu, X, Trash2, Home } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/Avatar";
import { cn, getErrorMessage } from "@/lib/utils";
import { NewBoardModal } from "@/components/board/NewBoardModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/Toast";
import { deleteBoard } from "@/lib/api";

export function Sidebar({
  boards,
  userName,
  userEmail,
  avatarUrl,
}: {
  boards: { id: string; name: string }[];
  userName: string;
  userEmail: string;
  avatarUrl?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const boardList = boards.filter((b) => !deletedIds.has(b.id));

  async function handleLogout() {
    await supabase.auth.signOut();
    // Full page load, not router.push() — signOut() clears the session
    // cookie asynchronously, and a soft navigation can render the next page
    // before that's finished (or leave the singleton Supabase client and
    // in-memory board state from this session still around). A hard reload
    // guarantees a clean, logged-out landing page, and that the next visit
    // to /login genuinely asks for credentials again.
    window.location.assign("/");
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBoard(deleteTarget.id);
      // deleteBoard() throwing means it's genuinely gone from the DB now
      // (see lib/api.ts) — safe to hide it immediately here rather than
      // waiting on a server round trip.
      setDeletedIds((prev) => new Set(prev).add(deleteTarget.id));
      toast.success("Board deleted", `"${deleteTarget.name}" and everything on it is gone.`);
      const wasActive = pathname?.includes(`/dashboard/board/${deleteTarget.id}`);
      setDeleteTarget(null);
      if (wasActive) {
        // Navigate off the now-deleted board's page first, then refresh so
        // the layout refetches the boards list once we're safely on a route
        // that still exists — refreshing while still "on" the deleted
        // board's page is what could surface the "this board doesn't exist"
        // screen instead of a clean redirect.
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      toast.error("Couldn't delete board", getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const content = (
    <>
      <div className="flex items-center justify-between px-1">
        <Link href="/dashboard" className="group flex items-center gap-2 font-display text-[15px] font-semibold">
          <span className="icon-pop flex h-7 w-7 items-center justify-center rounded-lg bg-violet-gradient text-white">
            <Waypoints size={15} />
          </span>
          TeamFlow
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            title="Back to homepage"
            className="rounded-lg p-1.5 text-muted-dim transition-colors hover:bg-panel-raised hover:text-violet"
          >
            <Home size={16} />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-muted hover:bg-panel-raised lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowNewBoard(true)}
        className="press mt-6 flex w-full items-center gap-2 rounded-xl border border-dashed border-line-solid px-3 py-2.5 text-[13.5px] font-medium text-muted transition-all hover:-translate-y-0.5 hover:border-violet/50 hover:bg-panel-raised hover:text-text hover:shadow-[0_10px_24px_-14px_rgba(76,29,149,0.4)]"
      >
        <Plus size={15} />
        New board
      </button>

      <div className="mt-6 flex-1 space-y-0.5 overflow-y-auto">
        <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-muted-dim">
          Your boards
        </p>
        {boardList.length === 0 && (
          <p className="px-2 text-[13px] text-muted-dim">No boards yet.</p>
        )}
        {boardList.map((b) => {
          const active = pathname === `/dashboard/board/${b.id}`;
          return (
            <div
              key={b.id}
              className={cn(
                "group/board flex items-center gap-0.5 rounded-lg pr-1 transition-all",
                active ? "bg-violet/10" : "hover:bg-panel-raised"
              )}
            >
              <Link
                href={`/dashboard/board/${b.id}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-all hover:translate-x-0.5",
                  active ? "text-text" : "text-muted hover:text-text"
                )}
              >
                <LayoutGrid size={15} className={cn("shrink-0", active ? "text-violet" : "text-muted-dim")} />
                <span className="min-w-0 flex-1 truncate">{b.name}</span>
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDeleteTarget({ id: b.id, name: b.name });
                }}
                aria-label={`Delete ${b.name}`}
                title="Delete board"
                className="shrink-0 rounded-md p-1.5 text-muted-dim opacity-0 transition-all hover:bg-coral/10 hover:text-coral group-hover/board:opacity-100 focus-visible:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-4">
        <Link
          href="/dashboard/profile"
          onClick={() => setMobileOpen(false)}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1 -m-1 transition-colors hover:bg-panel-raised"
          title="View profile"
        >
          <Avatar name={userName} src={avatarUrl} size={32} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-text">{userName}</p>
            <p className="truncate text-[11.5px] text-muted-dim">{userEmail}</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          title="Log out"
          className="rounded-lg p-1.5 text-muted-dim transition-colors hover:bg-panel-raised hover:text-coral"
        >
          <LogOut size={15} />
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-lg border border-line-solid bg-panel p-2 text-text shadow-sm lg:hidden"
      >
        <Menu size={18} />
      </button>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-panel/60 p-4 lg:flex">
        {content}
      </aside>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-72 flex-col border-r border-line-solid bg-panel p-4"
          >
            {content}
          </motion.aside>
        </motion.div>
      )}

      <NewBoardModal open={showNewBoard} onClose={() => setShowNewBoard(false)} />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete this board?"
        confirmLabel="Delete board"
        description={
          deleteTarget
            ? `This permanently deletes "${deleteTarget.name}" along with all of its columns, tasks, comments and files. This can't be undone.`
            : ""
        }
      />
    </>
  );
}
