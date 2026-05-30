'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MermaidDiagram } from './MermaidDiagram'
import type { Components } from 'react-markdown'

const components: Components = {
  // Strip the outer <pre> — our code component manages its own wrapper
  pre({ children }) {
    return <>{children}</>
  },

  code({ className, children }) {
    const language = /language-(\w+)/.exec(className || '')?.[1]
    const raw = String(children)
    const code = raw.replace(/\n$/, '')

    // Mermaid diagrams
    if (language === 'mermaid') {
      return <MermaidDiagram chart={code} />
    }

    // Syntax-highlighted fenced block
    if (language) {
      return (
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          PreTag="pre"
          customStyle={{
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            margin: '1.5rem 0',
          }}
        >
          {code}
        </SyntaxHighlighter>
      )
    }

    // Unstyled fenced block (``` with no language)
    if (raw.endsWith('\n')) {
      return (
        <pre className="my-6 overflow-x-auto rounded-lg bg-zinc-900 px-5 py-4 text-sm text-zinc-100 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      )
    }

    // Inline code
    return (
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono text-zinc-700">
        {children}
      </code>
    )
  },

  // Styled tables
  table({ children }) {
    return (
      <div className="my-6 overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm">{children}</table>
      </div>
    )
  },
  thead({ children }) {
    return <thead className="bg-zinc-50 text-zinc-600 font-semibold">{children}</thead>
  },
  th({ children }) {
    return <th className="px-4 py-2.5 text-left font-semibold tracking-tight">{children}</th>
  },
  td({ children }) {
    return <td className="border-t border-zinc-100 px-4 py-2.5">{children}</td>
  },

  // Open external links in new tab
  a({ href, children }) {
    const isExternal = href?.startsWith('http')
    return (
      <a
        href={href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="text-pink-500 no-underline hover:underline"
      >
        {children}
      </a>
    )
  },

  // Styled blockquote
  blockquote({ children }) {
    return (
      <blockquote className="my-6 border-l-4 border-pink-300 pl-5 text-zinc-500 italic">
        {children}
      </blockquote>
    )
  },
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  )
}
