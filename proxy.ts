// Protects /admin routes in two steps:
// 1. auth.protect() — redirects to Clerk sign-in if not signed in at all
// 2. userId check  — redirects home if the signed-in user isn't the admin
//
// This means even if someone else created a Clerk account, they can't reach /admin.
// Set ADMIN_CLERK_USER_ID in .env.local to your Clerk user ID (starts with user_).
// Find it: Clerk dashboard → Users → click your account → copy User ID.

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    // Step 1: must be signed in — redirects to Clerk sign-in page if not
    await auth.protect();

    // Step 2: must be the admin specifically
    const { userId } = await auth();
    const adminUserId = process.env.ADMIN_CLERK_USER_ID;

    if (adminUserId && userId !== adminUserId) {
      // Signed in but not you — redirect to home silently
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
