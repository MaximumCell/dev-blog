import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateTopics } from '@/lib/gemini'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  const adminId = process.env.ADMIN_CLERK_USER_ID
  if (!adminId || userId !== adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const topics = await generateTopics()
    return NextResponse.json({ topics })
  } catch (err) {
    console.error('[generate-topics]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
