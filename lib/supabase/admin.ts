import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

// Service-role client — NEVER import this from a Client Component or send
// this key to the browser (that's why it's read from SUPABASE_SERVICE_ROLE_KEY,
// not a NEXT_PUBLIC_ var). It bypasses Row Level Security entirely, which is
// exactly what's needed for admin.deleteUser(): deleting a row from
// auth.users can only be done with the service role, an anon/user session
// can never do it no matter what RLS policies exist on public.profiles.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local — Supabase dashboard → Project Settings → API → service_role key (keep it secret, server-only)."
    );
  }

  return createSupabaseClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
