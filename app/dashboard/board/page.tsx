import { redirect } from "next/navigation";

// Visiting /dashboard/board with no board id (e.g. via a stray history entry,
// bookmark, or the browser's forward/back cache) used to hit Next's default
// 404 because only /dashboard/board/[boardId] existed. Send it somewhere
// useful instead: /dashboard picks the user's first board automatically.
export default function BoardIndexPage() {
  redirect("/dashboard");
}
