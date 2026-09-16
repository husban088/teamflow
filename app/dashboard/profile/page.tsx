import { redirect } from "next/navigation";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/board/ProfileForm";

export default async function ProfilePage() {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
        <h1 className="font-display text-[22px] font-semibold">Your profile</h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Update how you appear to the rest of your team.
        </p>

        <ProfileForm
          userId={user.id}
          email={user.email ?? ""}
          fullName={profile?.full_name ?? ""}
          avatarUrl={profile?.avatar_url ?? null}
          createdAt={profile?.created_at ?? user.created_at}
        />
      </div>
    </div>
  );
}
