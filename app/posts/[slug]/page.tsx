import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createPublicSupabaseClient();
  const { data } = await supabase
    .from("posts")
    .select("title")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return { title: data?.title ?? "Post not found" };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createPublicSupabaseClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, content, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !post) notFound();

  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors duration-150 cursor-pointer mb-12"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        All posts
      </Link>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
        {post.title}
      </h1>

      {/* Date */}
      <time
        dateTime={post.created_at}
        className="mt-3 block text-sm text-zinc-400 font-mono"
      >
        {formatDate(post.created_at)}
      </time>

      {/* Divider */}
      <hr className="my-10 border-zinc-200" />

      {/* Content — prose plugin handles heading/paragraph/code styles */}
      <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline prose-code:text-zinc-700 prose-code:bg-zinc-100 prose-code:rounded prose-code:px-1 prose-code:text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-zinc-200">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors duration-150 cursor-pointer"
        >
          ← Back to all posts
        </Link>
      </div>
    </article>
  );
}
