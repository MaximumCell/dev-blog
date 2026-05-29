import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { PostGrid } from "@/components/PostGrid";
import type { Post } from "@/types";

export default async function HomePage() {
  const supabase = createPublicSupabaseClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, content, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-16">
        <p
          className="text-[11px] font-mono text-pink-500 tracking-[0.2em] uppercase mb-6"
          style={{
            animationName: "labelPop",
            animationDuration: "0.4s",
            animationFillMode: "both",
            animationTimingFunction: "ease-out",
          }}
        >
          Learning Journal
        </p>
        <h1
          className="font-(family-name:--font-caveat) text-6xl sm:text-7xl font-bold text-zinc-900 leading-[1.05] mb-6"
          style={{
            animationName: "heroEnter",
            animationDuration: "0.6s",
            animationFillMode: "both",
            animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
            animationDelay: "60ms",
          }}
        >
          Learning<br />in public.
        </h1>
        <p
          className="text-zinc-500 text-base leading-relaxed max-w-xs"
          style={{
            animationName: "heroEnter",
            animationDuration: "0.6s",
            animationFillMode: "both",
            animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
            animationDelay: "120ms",
          }}
        >
          Concepts I&apos;m figuring out — written down so they actually stick.
        </p>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="h-px bg-zinc-200" />
      </div>

      {/* ── Posts grid ───────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-6 py-10">
        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-mono">
            {error.message}
          </div>
        )}

        {!error && posts?.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 mb-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-400"
                aria-hidden="true"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">No posts yet.</p>
            <p className="text-zinc-400 text-xs mt-1">Write your first one in Admin.</p>
          </div>
        )}

        {posts && posts.length > 0 && (
          <PostGrid
            posts={
              posts as Pick<
                Post,
                "id" | "title" | "slug" | "content" | "created_at"
              >[]
            }
          />
        )}
      </main>
    </>
  );
}
