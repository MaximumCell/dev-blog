// Admin Supabase client — server-only, uses the service role key.
// The service role key bypasses Row Level Security entirely.
// Use this in Server Actions for create / update / delete operations
// until Clerk is wired to Supabase as a third-party auth provider.
//
// NEVER import this in a 'use client' file — the key must stay server-side.

import { createClient } from "@supabase/supabase-js";

export function createAdminSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey
  );
}
