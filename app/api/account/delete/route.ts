import { NextResponse } from "next/server";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    // Identify the caller from their own session cookie — never trust a
    // user id sent in the request body, or anyone could delete anyone.
    const user = await getCachedUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    const admin = createAdminClient();

    // Deleting the auth.users row is what actually needs the service role.
    // Everything else (profiles, boards they own, board_members, tasks,
    // comments, attachments) cascades automatically via the "on delete
    // cascade" foreign keys already in schema.sql — no extra queries needed.
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Clear the now-invalid session cookies on our end too.
    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete account.";
    console.error("Delete account error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
