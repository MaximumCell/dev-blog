"use server";

// Server Actions — run on the server, called from form submissions.
// Uses the admin Supabase client (service role key) so writes work
// regardless of whether Clerk → Supabase integration is configured.

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient } from "./supabase/admin";

export type ActionState = { error: string } | null;

// ── Create post ───────────────────────────────────────────────────────────────

export async function createPost(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { error: "You must be signed in to create a post." };

  const title = (formData.get("title") as string).trim();
  const slug = (formData.get("slug") as string).trim();
  const content = (formData.get("content") as string).trim();
  const published = formData.get("published") === "on";

  if (!title || !slug || !content) {
    return { error: "Title, slug, and content are all required." };
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("posts")
    .insert({ title, slug, content, published });

  if (error) {
    if (error.code === "23505") return { error: "A post with this slug already exists. Change the slug and try again." };
    return { error: error.message };
  }

  redirect("/admin");
}

// ── Update post ───────────────────────────────────────────────────────────────

export async function updatePost(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { error: "You must be signed in to edit a post." };

  const title = (formData.get("title") as string).trim();
  const slug = (formData.get("slug") as string).trim();
  const content = (formData.get("content") as string).trim();
  const published = formData.get("published") === "on";

  if (!title || !slug || !content) {
    return { error: "Title, slug, and content are all required." };
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("posts")
    .update({ title, slug, content, published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "A post with this slug already exists. Change the slug and try again." };
    return { error: error.message };
  }

  redirect("/admin");
}

// ── Delete post ───────────────────────────────────────────────────────────────

export async function deletePost(id: string): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) return { error: "You must be signed in to delete a post." };

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return null;
}
