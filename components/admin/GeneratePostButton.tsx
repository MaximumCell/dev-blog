'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type State = 'idle' | 'loading' | 'success' | 'error'

export function GeneratePostButton() {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

  async function handleClick() {
    if (state === 'loading') return
    setState('loading')
    setMessage('')

    try {
      const res = await fetch('/api/cron/generate-post', {
        method: 'POST',
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unknown error')

      setState('success')
      setMessage(`Published: "${json.title}"`)
      router.refresh()
    } catch (err) {
      setState('error')
      setMessage(err instanceof Error ? err.message : String(err))
    } finally {
      // Reset to idle after 6 seconds so the button is usable again
      setTimeout(() => setState('idle'), 6000)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handleClick}
        disabled={state === 'loading'}
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'font-mono text-xs tracking-wide gap-1.5',
          state === 'loading' && 'opacity-60 cursor-not-allowed',
          state === 'success' && 'border-emerald-300 text-emerald-600',
          state === 'error' && 'border-red-300 text-red-600'
        )}
      >
        {state === 'loading' && (
          <svg
            className="w-3 h-3 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        {state === 'idle' && '✦ Generate AI post'}
        {state === 'loading' && 'Generating…'}
        {state === 'success' && '✓ Published'}
        {state === 'error' && '✗ Failed'}
      </button>

      {message && (
        <p
          className={cn(
            'text-[11px] font-mono max-w-xs text-right',
            state === 'success' ? 'text-emerald-500' : 'text-red-500'
          )}
        >
          {message}
        </p>
      )}
    </div>
  )
}
