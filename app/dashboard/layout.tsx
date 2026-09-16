import { redirect } from "next/navigation";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { Sidebar } from "@/components/board/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: memberships } = await supabase
    .from("board_members")
    .select("boards(id, name)")
    .eq("user_id", user.id);

  const boards = (memberships ?? [])
    .map((m) => m.boards)
    .flat()
    .filter(Boolean) as { id: string; name: string }[];

  return (
    <div className="grain flex h-dvh overflow-hidden bg-ink">
      <Sidebar
        boards={boards}
        userName={profile?.full_name ?? user.email ?? "You"}
        userEmail={user.email ?? ""}
        avatarUrl={profile?.avatar_url ?? null}
      />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
