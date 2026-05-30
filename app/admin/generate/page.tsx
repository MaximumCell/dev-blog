import Link from 'next/link'
import { generateTopics, type TopicSuggestion } from '@/lib/gemini'
import { GeneratePageClient } from '@/components/admin/GeneratePageClient'

export const dynamic = 'force-dynamic'

export default async function GeneratePage() {
  let topics: TopicSuggestion[] = []
  let fetchError = ''

  try {
    topics = await generateTopics()
  } catch (err) {
    fetchError = err instanceof Error ? err.message : String(err)
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-700 transition-colors mb-12"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Admin
      </Link>

      <div className="mb-10">
        <p className="text-[11px] font-mono text-pink-500 tracking-[0.2em] uppercase mb-1">
          AI Generation
        </p>
        <h1 className="font-(family-name:--font-caveat) text-4xl font-bold text-zinc-900 mb-2">
          Generate a Post
        </h1>
        <p className="text-sm text-zinc-500">
          Trending topics suggested by Gemini. Pick one, then generate a full post with diagrams and code.
        </p>
      </div>

      {fetchError ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-mono">
            Failed to load topics: {fetchError}
          </div>
          {/* Still render the client with empty topics so user can retry */}
          <GeneratePageClient initialTopics={[]} />
        </div>
      ) : (
        <GeneratePageClient initialTopics={topics} />
      )}
    </main>
  )
}
