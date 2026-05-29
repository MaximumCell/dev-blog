// Admin dashboard — lists all posts (published and draft).
// Protected by Clerk middleware: you must be signed in to see this page.

import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import type { Post } from "@/types";
import { cn } from "@/lib/utils";

export default async function AdminPage() {
  const supabase = createAdminSupabaseClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, published, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">All posts</h1>
        <Link href="/admin/new" className={buttonVariants()}>
          New post
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {!error && posts?.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No posts yet.{" "}
          <Link href="/admin/new" className="underline underline-offset-4">
            Write your first one.
          </Link>
        </p>
      )}

      {posts && posts.length > 0 && (
        <ul className="divide-y divide-border">
          {(
            posts as Pick<Post, "id" | "title" | "slug" | "published" | "created_at">[]
          ).map((post) => (
            <li key={post.id} className="py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  /posts/{post.slug}
                </p>
              </div>

              <Badge variant={post.published ? "default" : "secondary"}>
                {post.published ? "Published" : "Draft"}
              </Badge>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
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
