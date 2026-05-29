import Link from "next/link";
import { PostForm } from "@/components/admin/PostForm";
import { createPost } from "@/lib/actions";

export default function NewPostPage() {
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
        <p className="text-[11px] font-mono text-pink-500 tracking-[0.2em] uppercase mb-1">New</p>
        <h1 className="font-(family-name:--font-caveat) text-4xl font-bold text-zinc-900">
          Write a post
        </h1>
      </div>

      <PostForm action={createPost} />
    </main>
  );
}
