import { redirect } from "next/navigation";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/board/ProfileForm";
import { ReloadButton } from "@/components/ui/ReloadButton";

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
      {/* pt-16 on small screens keeps the heading clear of the mobile menu button */}
      <div className="mx-auto max-w-2xl px-5 pb-10 pt-16 sm:px-8 lg:pt-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-[22px] font-semibold">
              Your profile
            </h1>
            <p className="mt-1 text-[13.5px] text-muted">
              Update how you appear to the rest of your team.
            </p>
          </div>
          <ReloadButton className="shrink-0" />
        </div>

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
