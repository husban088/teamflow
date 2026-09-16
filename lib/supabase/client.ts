import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types";

// Singleton: every call to createClient() used to spin up a brand-new
// GoTrueClient + PostgREST client. Each fresh instance has to re-read the
// session from cookies before it can attach a real Authorization header to
// a request, and that read is asynchronous. Calling `.insert()` right after
// creating a new client (as every screen was doing) could fire before that
// hydration finished, so the request went out as `anon` even though the
// user was genuinely logged in — that's what was causing the "new row
// violates row-level security policy" errors on board/task/comment
// inserts. Reusing one instance means it only ever hydrates once, and
// every other tab/query shares that already-resolved session.
let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
