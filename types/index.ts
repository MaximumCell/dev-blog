// Shared TypeScript types used across the app.
// Keep database types in sync with your Supabase table schema.

// Matches the `posts` table in Supabase.
// Add or remove fields here as you add columns to the table.
export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};
