// Create a new post.

import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";
import { createPost } from "@/lib/actions";

export default function NewPostPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to all posts
        </Link>
        <h1 className="text-2xl font-bold mt-3">New post</h1>
      </div>

      <PostForm action={createPost} />
    </main>
  );
}
