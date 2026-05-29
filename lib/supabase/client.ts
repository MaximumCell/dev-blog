// Browser-side Supabase client — use this inside Client Components ('use client').
// Returns a new client instance each render, scoped to the current Clerk session.
// When the user is signed out, accessToken returns null and Supabase falls back to anon access.

"use client";

import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

export function useSupabaseClient() {
  const { session } = useSession();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      async accessToken() {
        return session?.getToken() ?? null;
      },
    }
  );
}
