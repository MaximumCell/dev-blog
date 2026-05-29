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
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-200">
        <div className="max-w-2xl mx-auto px-6 py-20 sm:py-28">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
            Learning in public.
          </h1>
          <p className="mt-4 text-lg text-zinc-500 leading-relaxed max-w-md">
            Concepts I&apos;m figuring out — explained to myself so I actually understand them.
          </p>
        </div>
      </div>

      {/* ── Posts ────────────────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-6 py-12">

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-mono">
            {error.message}
          </div>
        )}

        {!error && posts?.length === 0 && (
          <p className="text-zinc-400 text-sm">No posts yet — write your first one in Admin.</p>
        )}

        {posts && posts.length > 0 && (
          <ul className="divide-y divide-zinc-100">
            {(posts as Pick<Post, "id" | "title" | "slug" | "created_at">[]).map(
              (post) => (
                <li key={post.id}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8 py-5 cursor-pointer"
                  >
                    <time
                      dateTime={post.created_at}
                      className="text-xs text-zinc-400 font-mono sm:w-28 shrink-0"
                    >
                      {formatDate(post.created_at)}
                    </time>
                    <span className="font-medium text-zinc-900 group-hover:text-pink-500 transition-colors duration-150">
                      {post.title}
                    </span>
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
