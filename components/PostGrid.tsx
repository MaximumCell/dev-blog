"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

type PostPreview = Pick<Post, "id" | "title" | "slug" | "content" | "created_at">;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min`;
}

function excerpt(content: string, max: number) {
  const text = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`[^`]+`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\|[^\n]+\|/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

export function PostGrid({ posts }: { posts: PostPreview[] }) {
  const [selected, setSelected] = useState<PostPreview | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post, i) => (
          <button
            key={post.id}
            onClick={() => setSelected(post)}
            className="group text-left bg-white border border-zinc-200 rounded-xl p-5 cursor-pointer hover:border-pink-200 hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
            style={{
              animationName: "cardEnter",
              animationDuration: "0.5s",
              animationFillMode: "both",
              animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
              animationDelay: `${i * 65}ms`,
            }}
          >
            {/* Meta row */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mb-3">
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              <span aria-hidden="true">·</span>
              <span>{readingTime(post.content)} read</span>
            </div>

            {/* Title */}
            <h2 className="text-sm font-semibold text-zinc-900 leading-snug group-hover:text-pink-500 transition-colors duration-150 mb-2.5 line-clamp-2">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 mb-5">
              {excerpt(post.content, 130)}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1 h-1 rounded-full bg-zinc-200 group-hover:bg-pink-300 transition-colors duration-150"
                    style={{ transitionDelay: `${d * 40}ms` }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-pink-500 transition-colors duration-150">
                Preview →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Preview modal */}
      <Dialog
        open={!!selected}
        onOpenChange={(open: boolean) => { if (!open) setSelected(null); }}
      >
        {selected && (
          <DialogContent className="sm:max-w-md">
            {/* Title */}
            <h2 className="font-(family-name:--font-caveat) text-4xl font-bold text-zinc-900 leading-tight pr-8">
              {selected.title}
            </h2>

            {/* Meta */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <time dateTime={selected.created_at}>{formatDate(selected.created_at)}</time>
              <span aria-hidden="true">·</span>
              <span>{readingTime(selected.content)} read</span>
            </div>

            <hr className="border-zinc-100" />

            {/* Excerpt */}
            <p className="text-sm text-zinc-600 leading-relaxed">
              {excerpt(selected.content, 340)}
            </p>

            {/* CTA */}
            <Link
              href={`/posts/${selected.slug}`}
              className={cn(
                buttonVariants({ size: "default" }),
                "w-full justify-center font-mono text-xs mt-1"
              )}
              onClick={() => setSelected(null)}
            >
              Read full post →
            </Link>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
