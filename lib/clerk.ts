// Clerk auth helpers for server-side use.
// Import these in Server Components or Route Handlers — not in 'use client' files.
//
// Usage examples:
//   const { userId } = await getAuthUser()   → Clerk user ID (null if signed out)
//   const user = await getFullUser()          → full user profile object
//
// For client-side Clerk hooks (useUser, useSession, etc.), import directly from '@clerk/nextjs'.

import { auth, currentUser } from "@clerk/nextjs/server";

// Returns the current Clerk auth context (userId, sessionId, etc.)
export async function getAuthUser() {
  return auth();
}

// Returns the full Clerk user object. Slightly slower than getAuthUser() — only use when you need name/email/avatar.
export async function getFullUser() {
  return currentUser();
}
