# app/api/ — Backend Route Handlers

This folder contains Next.js Route Handlers (the App Router equivalent of API routes).

Each subfolder maps to a URL. For example:
- `app/api/posts/route.ts` → `GET /api/posts`, `POST /api/posts`
- `app/api/posts/[id]/route.ts` → `GET /api/posts/:id`, `PUT /api/posts/:id`

## When to use a Route Handler vs a Server Action

- **Route Handler** — when you need a real HTTP endpoint (e.g., a webhook, a third-party service calling your app, or a mobile client).
- **Server Action** — when it's just your own frontend calling the backend. Server Actions are simpler and don't need an explicit HTTP contract.

## Auth in Route Handlers

```ts
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })
  // ...
}
```
