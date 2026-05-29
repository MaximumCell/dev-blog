"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const { isSignedIn, user } = useUser();
  const isAdmin = user?.id === process.env.NEXT_PUBLIC_ADMIN_CLERK_USER_ID;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-[#FAFAFA]/95 backdrop-blur-sm">
      <nav className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-(family-name:--font-caveat) text-2xl font-bold text-zinc-900 hover:text-pink-500 transition-colors duration-150 cursor-pointer leading-none"
        >
          My Learning Blog
        </Link>

        <div className="flex items-center gap-5">
          {isSignedIn ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-xs font-mono text-zinc-400 hover:text-zinc-700 transition-colors duration-150 cursor-pointer tracking-wide uppercase"
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
