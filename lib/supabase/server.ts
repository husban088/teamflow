import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Database } from "@/lib/types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component without a mutable cookie store — safe to ignore
            // because middleware refreshes the session on every request.
          }
        },
      },
    }
  );
}

// Every call to supabase.auth.getUser() is a real network round trip to
// Supabase Auth (it revalidates the session — that's intentional and more
// secure than trusting the cookie via getSession()). The dashboard layout,
// the dashboard page, and the board page each used to call it separately,
// so a single navigation paid for that round trip two or three times over.
// React's cache() memoizes this per request, so every Server Component
// rendered for the same navigation shares one call.
export const getCachedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
