// Reusable form for creating and editing posts.
// Used by both /admin/new and /admin/posts/[id]/edit.
// It's a Client Component so it can auto-generate the slug as you type.

"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/actions";
import type { Post } from "@/types";

// Converts a title to a slug. e.g. "My First Post!" → "my-first-post"
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

type PostFormProps = {
  // The server action to call on submit. Signature matches useActionState.
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  // When editing an existing post, pass it here to pre-fill the form.
  post?: Pick<Post, "title" | "slug" | "content" | "published">;
};

export function PostForm({ action, post }: PostFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  // slugEdited = true means the user has manually changed the slug,
  // so we stop auto-generating it from the title.
  const [slugEdited, setSlugEdited] = useState(!!post);

  // Auto-generate slug from title only in "create" mode.
  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What did you learn?"
        />
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
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
        <p className="text-xs text-muted-foreground">
          This becomes the URL: /posts/{slug || "your-slug"}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <Label htmlFor="content">Content (Markdown)</Label>
        <Textarea
          id="content"
          name="content"
          required
          defaultValue={post?.content}
          rows={20}
          placeholder="Write in Markdown. ## Headings, **bold**, `code`, etc."
          className="font-mono text-sm resize-y"
        />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={post?.published ?? false}
          className="h-4 w-4 rounded border-border accent-foreground"
        />
        <Label htmlFor="published" className="cursor-pointer">
          Published (visible to everyone)
        </Label>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : post ? "Save changes" : "Create post"}
      </Button>
    </form>
  );
}
