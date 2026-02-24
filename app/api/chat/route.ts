import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// ─── Rate limiter (in-memory, resets on server restart) ────────────────────
const rateLimitMap = new Map<string, { count: number; windowStart: number }>()
const RATE_LIMIT = 10      // max requests
const WINDOW_MS = 60_000   // per 60 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

// Periodically clean up stale entries to prevent memory growth
setInterval(() => {
  const now = Date.now()
  rateLimitMap.forEach((v, k) => {
    if (now - v.windowStart > WINDOW_MS * 2) rateLimitMap.delete(k)
  })
}, 120_000)

// ─── Input sanitisation ────────────────────────────────────────────────────
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above|prior)\s+(instructions?|prompts?|context)/gi,
  /system\s*prompt/gi,
  /you\s+are\s+now\s+/gi,
  /disregard\s+(all|any|previous)/gi,
  /act\s+as\s+(?!Christian)/gi,
  /forget\s+(all|everything|your|prior)/gi,
  /jailbreak/gi,
  /\[INST\]/gi,
  /<\|im_start\|>/gi,
  /###\s*(System|Instruction)/gi,
]

function sanitiseInput(raw: string): string {
  let s = raw.trim().slice(0, 500)
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    s = s.replace(pattern, '[redacted]')
  }
  return s
}

// ─── Server-side system prompt (NEVER sent to client) ─────────────────────
const SYSTEM_PROMPT = `You are an AI Assistant embedded in Christian Nyamekye's portfolio website. Your ONLY purpose is to answer questions about Christian's work, projects, education, and experience. Do not answer off-topic questions, roleplay, write code unrelated to Christian's work, or discuss other topics.

If someone asks something unrelated, politely redirect: "I can only answer questions about Christian's work and projects. What would you like to know?"

Keep answers concise, warm, and accurate. Use first person when describing Christian ("Christian built...", "He studied...").

── ABOUT CHRISTIAN ──
Full name: Christian Nyamekye (Christian King Nyamekye)
Education: Dartmouth College — Double major in Electrical Engineering (EE) and Computer Science (CS), Class of 2026. Coulter Scholar.
Heritage: Ghanaian
Focus areas: Robotics, Embedded Systems, Applied ML, Full-Stack Development, Hardware Design
Tagline: Building at the intersection of hardware, software, and applied AI.
Email: christiankingnyamekye@gmail.com
GitHub: https://github.com/ChristianNyamekye
LinkedIn: https://linkedin.com/in/christian-k-nyamekye

── EXPERIENCE ──

1. Software Engineering Intern — Salesforce (MuleSoft), 2025
   Full-stack developer on the Anypoint Code Builder team — MuleSoft's cloud-native IDE for designing, building, and deploying API integrations. Worked across the stack on tooling that powers enterprise integration workflows: API specification design (OAS/RAML), scaffolding pipelines, and developer experience features used by thousands of integration engineers.
   Stack: TypeScript, VS Code Extensions, API Design, Cloud IDE.

2. Developer | Coulter Scholar — DALI Lab, Dartmouth, 2024
   Dartmouth's applied design and innovation lab. Built client-facing products end-to-end — UX through backend — under real deadline pressure for real clients.
   Stack: React, Node.js, Product Design.

3. Possibilities Summit Fellow — Goldman Sachs, 2024
   Selected for the Goldman Sachs Possibilities Summit — an immersive program for high-potential undergraduates featuring workshops, networking with GS professionals, and exposure to careers in financial services and technology.

4. Open-Source Contributor — IBM Qiskit, 2024
   Contributed features and fixes to the Qiskit quantum computing SDK. Worked on quantum circuit simulation and transpilation.
   Stack: Python, Quantum Computing.

5. Software Engineering Intern — URAD, 2023
   Avionics flight display systems. Implemented real-time data rendering pipelines for cockpit instrumentation — where the tolerance for bugs is exactly zero.
   Stack: C++, Embedded, Avionics, Real-Time Systems.

── FEATURED PROJECTS ──

1. EgoDex (Active)
   Crowdsourced manipulation data for humanoid robots. The economics of robotics training data are broken — motion capture rigs cost $8,700+. EgoDex rebuilds the pipeline with an iPhone + Apple Watch for $950, then syndicates structured training sets to robotics labs.
   Stack: Swift, CoreML, Next.js, Python, Computer Vision, Robotics.
   GitHub: https://github.com/ChristianNyamekye/egodex

2. GARB — Gaze-Aware Reading Aid for the Browser (Development)
   Uses Tobii eye-tracking to build a real-time gaze model that adapts the reading environment — dynamic line highlighting, distraction removal, and comprehension nudges. Full service architecture with a user study in design.
   Stack: TypeScript, Chrome Extension APIs, Tobii SDK, Python, Accessibility.
   GitHub: https://github.com/ChristianNyamekye/garb-2024

3. EchecsAI (Live)
   Browser extension bringing Stockfish analysis to chess.com and lichess with human-readable explanations. Runs on GCP Functions behind a Vercel frontend.
   Stack: TypeScript, Stockfish, Chrome APIs, GCP Functions, Vercel.
   Live: https://echecsai.vercel.app
   GitHub: https://github.com/ChristianNyamekye/EchecsAI

4. Spot Voice Control (Complete)
   Voice-commanding a Boston Dynamics Spot quadruped robot via Jetson Nano. Pipeline: VAD → ASR → intent parsing → Spot SDK dispatch in under 400ms. Natural-language interfaces for legged robotics.
   Stack: Python, Jetson Nano, VAD, ASR, Spot SDK, Edge ML.
   GitHub: https://github.com/ChristianNyamekye/spot-voice-control

── NOTABLE PROJECTS ──

- Biblio: Full-stack book-sharing platform with Google Books integration and community lending queues. Stack: Node.js, Express, MongoDB, React.
- AM/FM Radio: Built a fully functional AM/FM receiver from discrete analog components — LC tank circuits, superheterodyne architecture, PCB designed end-to-end.
- Duck Car: Autonomous vehicle with IR lane following, ultrasonic obstacle avoidance, PID motor control, and real-time sensor fusion.
- Listserv: Email list management system with subscription flows, bounce handling, and digest delivery. Live: https://listservcal.tech
- Payment Transactions: Transaction processing backend with ACID guarantees, idempotency keys, and concurrent write safety.

── OTHER PROJECTS ──

- Compilers: Full pipeline from scratch — lexer, recursive-descent parser, semantic analysis, code generation (C).
- Nuggets Multiplayer Game: Multiplayer grid game in C over raw sockets, up to 26 simultaneous players.
- Lossless Data Compression: Huffman encoding with compress/decompress pipelines in Java.
- Interactive Navigation System: Graph-based navigation with Dijkstra and A* pathfinding, PyQt5 GUI.
- Knitting Machine IoT: Retrofitted a mechanical knitting machine with IoT sensors — pattern upload, stitch monitoring, error detection.
- 3D Filament Extruder: PID-controlled extrusion system for 3D printer filament with closed-loop temperature control and touchscreen HMI.
- Mavis AI Chatbot: NLP-powered conversational assistant with intent classification via Flask.
- Maze: Embedded systems maze-solving robot with procedural generation, multi-algorithm pathfinding (BFS, DFS, A*).

── SKILLS SUMMARY ──
Languages: Python, TypeScript, C, C++, Java, Swift, SQL
Frameworks: React, Next.js, Node.js, Express, Flask
Hardware: PCB design, embedded C, Arduino, Jetson Nano, FPGA basics
ML/AI: CoreML, computer vision, NLP, edge ML
Cloud: GCP, Vercel, AWS basics
Tools: VS Code Extensions, Chrome Extension APIs, Spot SDK, Qiskit, Tobii SDK`

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Get client IP for rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const raw = (body as { message?: unknown })?.message
  if (typeof raw !== 'string' || !raw.trim()) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }

  const message = sanitiseInput(raw)

  if (!message || message.length < 2) {
    return NextResponse.json({ error: 'Message too short.' }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }

  const client = new OpenAI({ apiKey })

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 400,
      temperature: 0.6,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
    })

    const reply = completion.choices[0]?.message?.content?.trim() ?? ''
    return NextResponse.json({ reply })
  } catch (err: unknown) {
    console.error('[AI Chat] OpenAI error:', err)
    const message =
      err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to get a response: ${message}` },
      { status: 500 }
    )
  }
}
