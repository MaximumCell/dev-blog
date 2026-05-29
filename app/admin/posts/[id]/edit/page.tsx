// Edit an existing post.
// This is a Server Component: it fetches the post data, then renders the client-side form.

import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { PostForm } from "@/components/admin/PostForm";
import { updatePost } from "@/lib/actions";

type Props = {
  // In Next.js 16, route params are a Promise — must be awaited.
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminSupabaseClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, slug, content, published")
    .eq("id", id)
    .single();

  if (error || !post) notFound();

  // Bind the post ID into the updatePost action so the form doesn't need a hidden field.
  // updatePost.bind(null, id) creates a new function: (prevState, formData) => updatePost(id, prevState, formData)
  const updatePostWithId = updatePost.bind(null, post.id);

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to all posts
        </Link>
        <h1 className="text-2xl font-bold mt-3">Edit post</h1>
      </div>

      <PostForm action={updatePostWithId} post={post} />
    </main>
  );
}
