import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { buttonVariants } from "@/components/ui/button";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import type { Post } from "@/types";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminPage() {
  const supabase = createAdminSupabaseClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, published, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-[11px] font-mono text-pink-500 tracking-[0.2em] uppercase mb-1">
            Admin
          </p>
          <h1 className="font-(family-name:--font-caveat) text-4xl font-bold text-zinc-900">
            All Posts
          </h1>
        </div>
        <Link
          href="/admin/new"
          className={cn(
            buttonVariants({ size: "sm" }),
            "font-mono text-xs tracking-wide"
          )}
        >
          + New post
        </Link>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-mono mb-6">
          {error.message}
        </div>
      )}

      {!error && posts?.length === 0 && (
        <div className="py-20 text-center border border-dashed border-zinc-200 rounded-lg">
          <p className="text-zinc-500 text-sm">No posts yet.</p>
          <Link
            href="/admin/new"
            className="text-xs text-pink-500 hover:text-pink-600 transition-colors mt-1 inline-block cursor-pointer"
          >
            Write your first one →
          </Link>
        </div>
      )}

      {posts && posts.length > 0 && (
        <ul className="divide-y divide-zinc-100">
          {(
            posts as Pick<Post, "id" | "title" | "slug" | "published" | "created_at">[]
          ).map((post) => (
            <li key={post.id} className="py-5 flex items-center gap-4">
              {/* Status dot */}
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  post.published ? "bg-emerald-400" : "bg-zinc-300"
                )}
                title={post.published ? "Published" : "Draft"}
              />

              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 truncate text-sm">
                  {post.title}
                </p>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {post.published ? "Published" : "Draft"} · {formatDate(post.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-xs font-mono text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${post.title}`}
                >
                  ↗
                </Link>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "text-xs font-mono h-7 px-3"
                  )}
                >
                  Edit
                </Link>
                <DeletePostButton id={post.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
