"use client";

import { UserPlus } from "lucide-react";
import type { Board, BoardMember } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export function BoardHeader({
  board,
  members,
  onlineUsers,
  onInvite,
}: {
  board: Board;
  members: BoardMember[];
  onlineUsers: { id: string; name: string }[];
  onInvite: () => void;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-line px-5 py-4 pl-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:pl-6">
      <div className="min-w-0">
        <h1 className="truncate font-display text-[19px] font-semibold">{board.name}</h1>
        {board.description && (
          <p className="mt-0.5 truncate text-[13px] text-muted">{board.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onlineUsers.length > 0 && (
          <div className="hidden items-center gap-1.5 rounded-full border border-line-solid bg-panel px-2.5 py-1.5 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />
            <span className="text-[12px] text-muted">
              {onlineUsers.length} online
            </span>
          </div>
        )}

        <div className="flex -space-x-2">
          {members.slice(0, 5).map((m) => (
            <Avatar
              key={m.user_id}
              name={m.profile?.full_name || m.profile?.email}
              size={30}
              ring
            />
          ))}
        </div>

        <Button size="sm" variant="outline" onClick={onInvite}>
          <UserPlus size={14} />
          Invite
        </Button>
      </div>
    </header>
  );
}
