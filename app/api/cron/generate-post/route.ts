import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateBlogPost } from '@/lib/gemini'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'

// Max execution time for Vercel (60s on Pro, 10s on Hobby — generation takes ~8-15s)
export const maxDuration = 60

async function isAuthorized(req: NextRequest): Promise<boolean> {
  // Path 1: Vercel cron / external caller — Bearer token
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const header = req.headers.get('authorization')
    if (header === `Bearer ${cronSecret}`) return true
  }

  // Path 2: Admin panel button — Clerk session (admin only)
  const { userId } = await auth()
  const adminId = process.env.ADMIN_CLERK_USER_ID
  if (adminId && userId === adminId) return true

  return false
}

async function run(topic?: string): Promise<NextResponse> {
  const post = await generateBlogPost(topic)

  const supabase = createAdminSupabaseClient()

  // Guard against slug collisions — append today's date if needed
  let slug = post.slug
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (existing) {
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    slug = `${slug}-${today}`
  }

  const { error } = await supabase.from('posts').insert({
    title: post.title,
    slug,
    content: post.content,
    published: true,
  })

  if (error) throw new Error(`Supabase insert error: ${error.message}`)

  return NextResponse.json({
    success: true,
    title: post.title,
    slug,
  })
}

// GET — called by Vercel Cron (daily at 09:00 UTC)
export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return await run()
  } catch (err) {
    console.error('[cron/generate-post]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}

// POST — called from the admin generate page (accepts optional { topic } in body)
export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    let topic: string | undefined
    try {
      const body = await req.json()
      topic = typeof body?.topic === 'string' ? body.topic : undefined
    } catch {
      // no body or invalid JSON — use fallback rotation
    }
    return await run(topic)
  } catch (err) {
    console.error('[cron/generate-post]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
