"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const { isSignedIn, user } = useUser();

  // The Admin link is only visible to the blog owner.
  // NEXT_PUBLIC_ADMIN_CLERK_USER_ID is safe to expose — Clerk user IDs
  // are already embedded in every session JWT.
  const isAdmin = user?.id === process.env.NEXT_PUBLIC_ADMIN_CLERK_USER_ID;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-[#FAFAFA]/90 backdrop-blur-sm">
      <nav className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-900 tracking-tight hover:text-zinc-500 transition-colors duration-150"
        >
          My Learning Blog
        </Link>

        <div className="flex items-center gap-5">
          {isSignedIn ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors duration-150 cursor-pointer"
                >
                  Admin
                </Link>
              )}
              <UserButton />
            </>
          ) : (
            <SignInButton>
              <button className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors duration-150 cursor-pointer">
                Sign in
              </button>
            </SignInButton>
          )}
        </div>
      </nav>
    </header>
  );
}
