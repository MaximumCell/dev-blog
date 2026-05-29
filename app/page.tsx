import Link from "next/link";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Post } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function HomePage() {
  const supabase = createPublicSupabaseClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-16">
        <p className="text-[11px] font-mono text-pink-500 tracking-[0.2em] uppercase mb-6">
          Learning Journal
        </p>
        <h1 className="font-(family-name:--font-caveat) text-6xl sm:text-7xl font-bold text-zinc-900 leading-[1.05] mb-6">
          Learning<br />in public.
        </h1>
        <p className="text-zinc-500 text-base leading-relaxed max-w-xs">
          Concepts I&apos;m figuring out — written down so they actually stick.
        </p>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="h-px bg-zinc-200" />
      </div>

      {/* ── Posts ────────────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-6 py-4">

        {error && (
          <div className="mt-8 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-mono">
            {error.message}
          </div>
        )}

        {!error && posts?.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400" aria-hidden="true">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">No posts yet.</p>
            <p className="text-zinc-400 text-xs mt-1">Write your first one in Admin.</p>
          </div>
        )}

        {posts && posts.length > 0 && (
          <ul>
            {(posts as Pick<Post, "id" | "title" | "slug" | "created_at">[]).map(
              (post, index) => (
                <li key={post.id} className="border-t border-zinc-100">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group flex items-center gap-5 py-6 cursor-pointer"
                  >
                    <span className="text-xs font-mono text-pink-300 w-6 shrink-0 group-hover:text-pink-500 transition-colors duration-150 select-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-900 font-medium group-hover:text-pink-500 transition-colors duration-150 truncate">
                        {post.title}
                      </p>
                      <time
                        dateTime={post.created_at}
                        className="text-xs text-zinc-400 font-mono mt-1 block"
                      >
                        {formatDate(post.created_at)}
                      </time>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-200 group-hover:text-pink-400 transition-colors duration-150 shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              )
            )}
          </ul>
        )}
      </main>
    </>
  );
}
