# My Learning Blog

A personal learning blog where I write about concepts I'm figuring out — explained to myself so they actually stick.

**Live:** [github.com/MaximumCell/dev-blog](https://github.com/MaximumCell/dev-blog)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (base-ui/react) |
| Database | Supabase (PostgreSQL) |
| Auth | Clerk |
| Fonts | Geist (UI) + Caveat (display headings) |
| Markdown | react-markdown + remark-gfm |

---

## Features

- **Public blog** — home page grid of post cards with click-to-preview modal
- **Full post pages** — markdown rendered with syntax highlighting
- **Admin dashboard** — create, edit, delete posts (locked to owner account)
- **Draft / publish** — posts can be saved as drafts before going live
- **Auth** — Clerk handles sign-in; only the owner can access `/admin`
- **Animations** — staggered card entrance, hover effects, modal transitions

---

## Project Structure

```
app/
  page.tsx                  # Home page (Server Component)
  layout.tsx                # Root layout — ClerkProvider, Navbar, Toaster
  globals.css               # Tailwind + custom keyframes
  posts/[slug]/page.tsx     # Full post page
  admin/
    page.tsx                # Dashboard — list all posts
    new/page.tsx            # Create post
    posts/[id]/edit/page.tsx # Edit post

components/
  Navbar.tsx                # Sticky nav — shows Admin link only to owner
  PostGrid.tsx              # Card grid + preview modal (Client Component)
  admin/
    PostForm.tsx            # Reusable create/edit form
    DeletePostButton.tsx    # Confirm-before-delete button

lib/
  supabase/
    public.ts              # Anon client — public pages, no auth
    admin.ts               # Service role client — admin writes, bypasses RLS
    server.ts              # Clerk-authenticated client (for future RLS use)
    client.ts              # Browser hook (for future use)
  actions.ts               # Server Actions: createPost, updatePost, deletePost
  clerk.ts                 # Server auth helpers

types/
  index.ts                 # Post type

proxy.ts                   # Clerk middleware (Next.js 16 — not middleware.ts)
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/MaximumCell/dev-blog.git
cd dev-blog
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `ADMIN_CLERK_USER_ID` | Clerk dashboard → Users → your account → User ID |
| `NEXT_PUBLIC_ADMIN_CLERK_USER_ID` | Same value as above |

### 3. Create the posts table in Supabase

Run this in the Supabase SQL Editor:

```sql
CREATE TABLE public.posts (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  content    TEXT NOT NULL DEFAULT '',
  published  BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin Access

The blog is single-author. Admin access is locked at three layers:

1. **`proxy.ts`** (middleware) — redirects unsigned-in users to Clerk sign-in; redirects wrong-account users to home
2. **Server Actions** — each action re-checks `userId` before any database write
3. **Supabase service role** — admin writes use the service role key, bypassing RLS entirely

The `ADMIN_CLERK_USER_ID` env var is the only account that can reach `/admin`.

---

## Key Gotchas

- **Next.js 16** renamed `middleware.ts` → `proxy.ts`
- **Tailwind v4** uses `@import "tailwindcss"` and `@plugin` directives — no `tailwind.config.js`
- **shadcn/ui** in this version uses `@base-ui/react` (not Radix UI) — no `asChild` on Button; use `buttonVariants()` on `<Link>` instead
- **Clerk v7** removed `<SignedIn>` / `<SignedOut>` components — use `useUser()` hook
- **Supabase** new key format is `sb_publishable_...` — do not pass as a Bearer token
- **RLS is currently disabled** on the posts table — re-enable once Clerk is configured as a Supabase auth provider (Auth → Sign In Providers → Clerk)

---

## Design System

- **Background:** `#FAFAFA`
- **Text:** `zinc-900` → `zinc-500` scale
- **Accent:** `#EC4899` (pink-500) — hover states, labels, interactive indicators
- **Display font:** Caveat (handwritten) — headings and page titles
- **UI font:** Geist — body, labels, buttons
- **Mono font:** Geist Mono — dates, slugs, code
- **Reading width:** `max-w-2xl` (672px)
- **Style:** Swiss Modernism — generous whitespace, clear hierarchy, no decorative gradients
