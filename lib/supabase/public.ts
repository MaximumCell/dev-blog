// Public (unauthenticated) Supabase client — for Server Components on public pages.
// Does NOT attach a Clerk token, so Supabase never tries to verify a JWT.
// Use this on the home page and post detail page where no auth is needed.

import { createClient } from "@supabase/supabase-js";

export function createPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
