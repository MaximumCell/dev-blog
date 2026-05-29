// Server-side Supabase client — safe to use in Server Components, Server Actions, and Route Handlers.
// Automatically attaches the Clerk session token so Supabase RLS policies can identify the user.
// Uses the native Clerk → Supabase integration (no JWT templates needed).

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Called automatically on every request; returning null falls back to anon access.
      async accessToken() {
        return (await auth()).getToken();
      },
    }
  );
}
