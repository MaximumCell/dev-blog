// A single post card — used on the home page to list published posts.

import Link from "next/link";
import type { Post } from "@/types";

type PostCardProps = Pick<Post, "title" | "slug" | "created_at">;

export function PostCard({ title, slug, created_at }: PostCardProps) {
  return (
    <article>
      <Link href={`/posts/${slug}`} className="group block">
        <h2 className="font-semibold text-foreground group-hover:underline underline-offset-4">
          {title}
        </h2>
        <time
          dateTime={created_at}
          className="text-sm text-muted-foreground mt-1 block"
        >
          {new Date(created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </Link>
    </article>
  );
}
