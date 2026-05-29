import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { PostForm } from "@/components/admin/PostForm";
import { updatePost } from "@/lib/actions";

type Props = {
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

  const updatePostWithId = updatePost.bind(null, post.id);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer mb-4"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          All posts
        </Link>
        <p className="text-[11px] font-mono text-pink-500 tracking-[0.2em] uppercase mb-1">Edit</p>
        <h1 className="font-(family-name:--font-caveat) text-4xl font-bold text-zinc-900 truncate">
          {post.title}
        </h1>
      </div>

      <PostForm action={updatePostWithId} post={post} />
    </main>
  );
}
