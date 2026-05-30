'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TopicSuggestion } from '@/lib/gemini'
import { cn } from '@/lib/utils'

const CATEGORY_STYLES: Record<string, string> = {
  'System Design': 'bg-blue-50 text-blue-600 border-blue-200',
  'Web Dev':       'bg-violet-50 text-violet-600 border-violet-200',
  'DevOps':        'bg-orange-50 text-orange-600 border-orange-200',
  'Database':      'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Mobile':        'bg-cyan-50 text-cyan-600 border-cyan-200',
  'Security':      'bg-red-50 text-red-600 border-red-200',
  'Performance':   'bg-amber-50 text-amber-600 border-amber-200',
  'AI/ML':         'bg-pink-50 text-pink-600 border-pink-200',
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner:     'text-emerald-500',
  Intermediate: 'text-amber-500',
  Advanced:     'text-red-500',
}

function Badge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn('inline-block rounded border px-1.5 py-0.5 text-[10px] font-mono tracking-wide', className)}>
      {label}
    </span>
  )
}

interface Props {
  initialTopics: TopicSuggestion[]
}

export function GeneratePageClient({ initialTopics }: Props) {
  const router = useRouter()
  const [topics, setTopics] = useState<TopicSuggestion[]>(initialTopics)
  const [selected, setSelected] = useState<TopicSuggestion | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<{ title: string; slug: string } | null>(null)
  const [error, setError] = useState('')

  async function handleRefresh() {
    if (refreshing) return
    setRefreshing(true)
    setSelected(null)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/generate-topics', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to refresh topics')
      setTopics(json.topics)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setRefreshing(false)
    }
  }

  async function handleGenerate() {
    if (generating || !selected) return
    setGenerating(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/cron/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selected.title }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Generation failed')
      setResult({ title: json.title, slug: json.slug })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-8">

      {/* Topic grid header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {selected ? (
            <span>
              Selected: <span className="font-medium text-zinc-800">{selected.title}</span>
            </span>
          ) : (
            'Pick a topic to generate a post about'
          )}
        </p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-700 transition-colors',
            refreshing && 'opacity-50 cursor-not-allowed'
          )}
        >
          <svg
            className={cn('w-3 h-3', refreshing && 'animate-spin')}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          {refreshing ? 'Fetching ideas…' : 'Regenerate ideas'}
        </button>
      </div>

      {/* Topic cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topics.map((topic) => {
          const isSelected = selected?.id === topic.id
          return (
            <button
              key={topic.id}
              onClick={() => setSelected(isSelected ? null : topic)}
              className={cn(
                'text-left rounded-xl border p-4 transition-all duration-150 cursor-pointer',
                'hover:border-zinc-300 hover:shadow-sm',
                isSelected
                  ? 'border-pink-400 bg-pink-50/60 shadow-sm ring-1 ring-pink-300'
                  : 'border-zinc-200 bg-white'
              )}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <Badge
                  label={topic.category}
                  className={CATEGORY_STYLES[topic.category] ?? 'bg-zinc-50 text-zinc-500 border-zinc-200'}
                />
                <span className={cn('text-[10px] font-mono', DIFFICULTY_STYLES[topic.difficulty] ?? 'text-zinc-400')}>
                  {topic.difficulty}
                </span>
                {isSelected && (
                  <span className="ml-auto text-pink-500">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-zinc-900 leading-snug mb-1.5">
                {topic.title}
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {topic.description}
              </p>
            </button>
          )
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-mono">
          {error}
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span className="font-semibold">Published:</span> {result.title}
          <a
            href={`/posts/${result.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 font-mono text-xs text-emerald-600 hover:underline"
          >
            View post ↗
          </a>
        </div>
      )}

      {/* Generate button */}
      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
        <p className="text-xs font-mono text-zinc-400">
          {selected ? `Topic: "${selected.title.slice(0, 48)}${selected.title.length > 48 ? '…' : ''}"` : 'No topic selected'}
        </p>
        <button
          onClick={handleGenerate}
          disabled={!selected || generating}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-150',
            selected && !generating
              ? 'bg-zinc-900 text-white hover:bg-zinc-700 cursor-pointer'
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          )}
        >
          {generating && (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          )}
          {generating ? 'Generating post…' : 'Generate & Publish Post'}
        </button>
      </div>
    </div>
  )
}
