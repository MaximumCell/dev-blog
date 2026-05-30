// Gemini API integration for AI blog post generation.
// Uses gemini-2.5-flash — best reasoning in the Flash family, still very cheap at this volume.

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export interface GeneratedPost {
  title: string
  slug: string
  content: string
}

export interface TopicSuggestion {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

// ── Fallback rotation pool for the daily cron ────────────────────────────────

const FALLBACK_TOPICS = [
  'load balancing strategies and algorithms',
  'database sharding and partitioning',
  'event-driven architecture with message queues',
  'CQRS and event sourcing pattern',
  'distributed caching with Redis',
  'API gateway design patterns',
  'service mesh and sidecar proxy pattern',
  'CAP theorem and distributed consistency',
  'rate limiting algorithms',
  'circuit breaker pattern in microservices',
  'JWT authentication vs session-based auth',
  'WebSockets and real-time communication',
  'React Server Components architecture',
  'micro-frontends architecture',
  'web performance optimization techniques',
  'GraphQL schema design best practices',
  'HTTP/2 and HTTP/3 improvements',
  'Progressive Web App internals',
  'database indexing strategies',
  'SQL query optimization techniques',
  'ACID properties and transaction isolation',
  'NoSQL data modeling patterns',
  'database connection pooling',
  'time-series database design',
  'SOLID principles in practice',
  'dependency injection and IoC containers',
  'repository and unit of work patterns',
  'clean architecture layers',
  'observer and pub/sub patterns',
  'strategy and factory design patterns',
  'Docker container internals and layers',
  'Kubernetes pod scheduling',
  'CI/CD pipeline design',
  'blue-green and canary deployments',
  'infrastructure as code with Terraform',
  'observability: logs, metrics, and traces',
  'offline-first mobile architecture',
  'React Native bridge and new architecture',
  'mobile app performance optimization',
  'state management patterns in mobile apps',
]

function pickFallbackTopic(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  )
  return FALLBACK_TOPICS[dayOfYear % FALLBACK_TOPICS.length]
}

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

// ── Topic suggestion generation ───────────────────────────────────────────────

const TOPICS_PROMPT = `You are curating content ideas for a technical software development blog called noob.dev.

Search the web right now for what software developers are actively discussing this week — look for recent releases, announcements, GitHub trending repos, Hacker News discussions, and dev community debates happening TODAY.

Based on what you find, suggest 6 compelling blog post topics that are genuinely timely and relevant right now.

Each topic must be specific — not generic evergreen content.
Good: "Why Bun 1.2's Node.js Compatibility Layer Changes Your Build Pipeline"
Bad: "Understanding JavaScript Runtimes"

Output a JSON array of exactly 6 objects. Each object must have exactly these keys:
- "title": string — the specific article title
- "description": string — 2 sentences on what it covers and why it matters right now
- "category": string — one of: System Design, Web Dev, DevOps, Database, Mobile, Security, Performance, AI/ML
- "difficulty": string — one of: Beginner, Intermediate, Advanced

Output ONLY the raw JSON array. No markdown fences, no explanation, nothing else.`

async function callGemini(
  prompt: string,
  opts: { json?: boolean; temperature?: number; grounded?: boolean } = {}
): Promise<string> {
  const apiKey = process.env.GEMINI_KEY
  if (!apiKey) throw new Error('GEMINI_KEY is not set')

  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: opts.temperature ?? 0.8,
      maxOutputTokens: 32768,
      thinkingConfig: { thinkingBudget: 0 },
      // json + grounded conflict — grounded wins when both requested
      ...(!opts.grounded && opts.json ? { responseMimeType: 'application/json' } : {}),
    },
    // Google Search grounding — gives Gemini real-time web access
    ...(opts.grounded ? { tools: [{ google_search: {} }] } : {}),
  }

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

export async function generateTopics(): Promise<TopicSuggestion[]> {
  // Use Google Search grounding so topics are based on actual current news.
  // responseMimeType can't be combined with grounding, so we parse the text ourselves.
  const raw = await callGemini(TOPICS_PROMPT, { grounded: true, temperature: 0.9 })
  if (!raw) throw new Error('Gemini returned empty topics')

  const jsonStr = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  let topics: Omit<TopicSuggestion, 'id'>[]
  try {
    topics = JSON.parse(jsonStr)
  } catch {
    throw new Error(`Failed to parse topics JSON: ${jsonStr.slice(0, 200)}`)
  }

  return topics.map((t, i) => ({
    ...t,
    id: `topic-${i}-${Date.now()}`,
  }))
}

// ── Blog post generation ──────────────────────────────────────────────────────

const POST_PROMPT = `You are a senior software engineer writing for a technical developer blog called noob.dev. Your posts are detailed, genuinely educational, and written for intermediate to senior developers.

Write a complete blog post about this topic: {TOPIC}

Strict output rules — follow exactly:
1. The VERY FIRST line must be a single markdown H1 title: # Your Specific Title Here
2. After the title, write the full post body in markdown. No preamble, no "Here is your post".
3. Post structure: hook paragraph → why it matters → core concept deep dive → implementation → code examples → diagrams → key takeaways
4. Include exactly 2 Mermaid diagrams in \`\`\`mermaid fences (flowchart, sequenceDiagram, erDiagram, or stateDiagram-v2). CRITICAL mermaid rules: ALWAYS wrap node labels in double quotes when they contain parentheses, commas, colons, curly braces, slashes, or ANY special character. This applies to ALL node shapes — rectangles A["label"], diamonds A{"label"}, rounded A("label"), etc. Examples: A["Loss Function (MSE)"] not A[Loss Function (MSE)], B{"Decision (Yes/No)"} not B{Decision (Yes/No)}. No exceptions.
5. Include 3–4 code examples in the relevant language in proper fenced code blocks
6. Length: 1600–2400 words
7. Tone: clear, direct, technical — no filler phrases, no "In conclusion"
8. Output raw markdown only. Do not wrap in any code fence. Do not add any commentary before or after.`

export async function generateBlogPost(topicOverride?: string): Promise<GeneratedPost> {
  const topic = topicOverride ?? pickFallbackTopic()
  const prompt = POST_PROMPT.replace('{TOPIC}', topic)

  const raw = await callGemini(prompt, { temperature: 0.7 })
  if (!raw) throw new Error('Gemini returned an empty response')

  const markdown = raw
    .replace(/^```(?:markdown)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  const lines = markdown.split('\n')
  const titleLine = lines[0].trim()
  if (!titleLine.startsWith('# ')) {
    throw new Error(`Gemini output did not start with an H1 title. Got: ${titleLine.slice(0, 100)}`)
  }

  const title = titleLine.replace(/^#+\s*/, '').trim()
  const slug = titleToSlug(title)

  return { title, slug, content: markdown }
}
