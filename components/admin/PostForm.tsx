"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/actions";
import type { Post } from "@/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

type PostFormProps = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  post?: Pick<Post, "title" | "slug" | "content" | "published">;
};

const DUPLICATE_SLUG_MSG = "A post with this slug already exists. Change the slug and try again.";

export function PostForm({ action, post }: PostFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!post);

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  // When a duplicate slug error comes back, auto-append "-2" so the user
  // can just hit submit again instead of manually editing the slug.
  useEffect(() => {
    if (state?.error === DUPLICATE_SLUG_MSG) {
      setSlug((prev) => {
        const match = prev.match(/^(.*)-(\d+)$/);
        if (match) return `${match[1]}-${Number(match[2]) + 1}`;
        return `${prev}-2`;
      });
      setSlugEdited(true);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-7">
      {state?.error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-mono">
          {state.error === DUPLICATE_SLUG_MSG
            ? "Slug was already taken — updated it for you. Submit again."
            : state.error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What did you learn?"
          className="text-base"
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug" className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Slug
        </Label>
        <Input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugEdited(true);
          }}
          placeholder="url-friendly-slug"
          className="font-mono text-sm"
        />
        <p className="text-xs text-zinc-400 font-mono">
          /posts/<span className="text-zinc-600">{slug || "your-slug"}</span>
        </p>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Content <span className="normal-case text-zinc-400">(Markdown)</span>
        </Label>
        <Textarea
          id="content"
          name="content"
          required
          defaultValue={post?.content}
          rows={22}
          placeholder={"## Start writing\n\nMarkdown supported — **bold**, `code`, > blockquote, etc."}
          className="font-mono text-sm resize-y leading-relaxed"
        />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-2">
        <label htmlFor="published" className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            id="published"
            name="published"
            defaultChecked={post?.published ?? false}
            className="h-4 w-4 rounded border-zinc-300 accent-pink-500 cursor-pointer"
          />
          <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors select-none">
            Publish
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            (visible to everyone)
          </span>
        </label>

        <Button type="submit" disabled={isPending} className="font-mono text-xs">
          {isPending ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
      </div>
    </form>
  );
}
