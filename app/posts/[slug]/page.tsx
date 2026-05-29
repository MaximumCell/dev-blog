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

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
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
    <article
      className="max-w-2xl mx-auto px-6 py-16"
      style={{
        animationName: "heroEnter",
        animationDuration: "0.5s",
        animationFillMode: "both",
        animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-700 transition-colors duration-150 cursor-pointer mb-14 tracking-wide"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        All posts
      </Link>

      {/* Title */}
      <h1 className="font-(family-name:--font-caveat) text-5xl sm:text-6xl font-bold text-zinc-900 leading-[1.1] mb-6">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
        <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        <span aria-hidden="true">·</span>
        <span>{readingTime(post.content)}</span>
      </div>

      {/* Divider */}
      <div className="my-10 h-px bg-zinc-200" />

      {/* Content */}
      <div className="prose prose-zinc max-w-none leading-relaxed prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline prose-code:text-zinc-700 prose-code:bg-zinc-100 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-blockquote:border-l-pink-300 prose-blockquote:text-zinc-500">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-zinc-100 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-700 transition-colors duration-150 cursor-pointer tracking-wide"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to all posts
        </Link>
        <span className="text-xs font-mono text-zinc-300">{formatDate(post.created_at)}</span>
      </div>
    </article>
  );
}
