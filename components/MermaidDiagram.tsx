'use client'

import { useEffect, useId, useState } from 'react'

// Mermaid parse errors occur when node labels contain bare parentheses, commas,
// or colons that clash with shape/link syntax. Quote any unquoted label that
// contains these characters across all shape delimiters:
//   A[foo (bar)]  → A["foo (bar)"]   rectangle
//   A{foo (bar)}  → A{"foo (bar)"}   diamond
//   A(foo (bar))  is left alone — nested parens are valid in rounded nodes
function sanitizeMermaid(src: string): string {
  // Fix [ ] rectangle labels
  let out = src.replace(
    /(\[)([^\]"[]+[(),:/][^\]"[]*)(\])/g,
    (_, o, label, c) => `${o}"${label}"${c}`,
  )
  // Fix { } diamond labels
  out = out.replace(
    /(\{)([^}"'{]+[(),:/][^}"'{]*)(\})/g,
    (_, o, label, c) => `${o}"${label}"${c}`,
  )
  return out
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const rawId = useId()
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import('mermaid').then((mod: any) => {
      const mermaid = mod.default ?? mod
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        fontFamily: 'inherit',
        fontSize: 14,
      })

      mermaid
        .render(id, sanitizeMermaid(chart))
        .then(({ svg: rendered }: { svg: string }) => {
          if (!cancelled) setSvg(rendered)
        })
        .catch((err: unknown) => {
          if (!cancelled)
            setError(err instanceof Error ? err.message : String(err))
        })
    })

    return () => {
      cancelled = true
    }
  }, [chart, id])

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-mono">
        Diagram error: {error}
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="my-6 flex justify-center rounded-lg border border-zinc-100 bg-zinc-50 p-8">
        <span className="text-sm text-zinc-400 font-mono">Rendering diagram…</span>
      </div>
    )
  }

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-zinc-100 bg-zinc-50 p-6"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
