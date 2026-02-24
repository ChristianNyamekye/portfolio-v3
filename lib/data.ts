// ============================================================
// data.ts — Single source of truth for all portfolio content
// Update this file to change any text/links/projects on the site
// ============================================================

export const meta = {
  name: 'Christian Nyamekye',
  title: 'Christian Nyamekye — Building the future of robotics data',
  description:
    'Dartmouth EE+CS. Building EgoDex — crowdsourced manipulation training data for humanoid robots. Hardware, software, and AI at the intersection.',
  url: 'https://christiannyamekye.com',
  email: 'christiankingnyamekye@gmail.com',
  social: {
    github: 'https://github.com/ChristianNyamekye',
    linkedin: 'https://linkedin.com/in/christian-k-nyamekye',
    twitter: 'https://x.com/printlnxristian',
    instagram: 'https://instagram.com/christiannyamekye.kjr',
  },
}

export const hero = {
  eyebrow: 'EE + CS @ Dartmouth',
  headline: 'Building the future\nof robotics data.',
  subline:
    'Crowdsourcing manipulation training data so the next generation of humanoid robots can learn from the best humans on the planet.',
  cta: { label: 'See the work', href: '#projects' },
  ctaSecondary: { label: 'Get in touch', href: '#contact' },
}

export const about = {
  paragraphs: [
    "I'm a Dartmouth double-major in Electrical Engineering and Computer Science, building systems that live at the intersection of hardware, software, and applied AI.",
    'From avionics flight displays to quantum computing to rewriting the economics of robotics training data — I care about problems where the physics matters.',
    "Ghanaian by heritage. Convinced that the most important technology has to work for the whole world, not just the parts that already have everything.",
  ],
  tags: ['Robotics', 'Embedded Systems', 'Applied ML', 'Full-Stack', 'Hardware Design', 'EE + CS'],
}

export interface ExperienceItem {
  role: string
  org: string
  period: string
  description: string
  tags: string[]
  link?: string
}

export const experience: ExperienceItem[] = [
  {
    role: 'Software Engineering Intern',
    org: 'Goldman Sachs',
    period: '2025',
    description:
      'Built internal tooling and data pipelines within the engineering division. Operated in a production-grade, high-stakes environment where correctness and scale are non-negotiable.',
    tags: ['Python', 'Distributed Systems', 'Finance Tech'],
  },
  {
    role: 'Open-Source Contributor',
    org: 'IBM Qiskit',
    period: '2024',
    description:
      'Contributed to the Qiskit quantum computing SDK — features and fixes across the open-source ecosystem, with exposure to quantum circuit simulation and transpilation.',
    tags: ['Python', 'Quantum Computing', 'Open Source'],
    link: 'https://github.com/Qiskit',
  },
  {
    role: 'Developer',
    org: 'DALI Lab — Dartmouth',
    period: '2024',
    description:
      "Dartmouth's applied design and innovation lab. Built client-facing products end-to-end — UX through backend — under real deadline pressure for real clients.",
    tags: ['React', 'Node.js', 'Product Design'],
    link: 'https://dali.dartmouth.edu',
  },
  {
    role: 'Software Engineering Intern',
    org: 'URAD',
    period: '2023',
    description:
      'Avionics flight display systems. Implemented real-time data rendering pipelines for cockpit instrumentation — where the tolerance for bugs is exactly zero.',
    tags: ['C++', 'Embedded', 'Avionics', 'Real-Time Systems'],
  },
  {
    role: 'Entrepreneurship Fellow',
    org: 'Magnuson Center — Dartmouth',
    period: '2023 – Present',
    description:
      "Dartmouth's hub for student entrepreneurship. Resources, mentorship, and a community of builders for constructing companies while still in school.",
    tags: ['Entrepreneurship', 'Venture', 'Product'],
    link: 'https://magnuson.dartmouth.edu',
  },
]

export interface FeaturedProject {
  id: string
  name: string
  tagline: string
  description: string
  tags: string[]
  link?: string
  github?: string
  flagship?: boolean
  status?: string
  metric?: string
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'egodex',
    name: 'EgoDex',
    tagline: 'Crowdsourced manipulation data for humanoid robots',
    description:
      'The economics of robotics training data are broken. Industry-standard motion capture rigs cost $8,700+. EgoDex rebuilds the pipeline from scratch — an iPhone + Apple Watch captures egocentric manipulation data for $950, then syndicates structured training sets to robotics labs. Full-stack platform: iOS capture app, annotation pipeline, quality control, and API. This is how the next generation of humanoid robots learns to use their hands.',
    tags: ['Swift', 'CoreML', 'Next.js', 'Python', 'Computer Vision', 'Robotics'],
    flagship: true,
    status: 'Active',
    metric: '$950 kit vs $8,700 industry standard',
    github: 'https://github.com/ChristianNyamekye/egodex',
  },
  {
    id: 'garb',
    name: 'GARB',
    tagline: 'Gaze-Aware Reading Aid for the Browser',
    description:
      "Attention is the scarcest resource. The browser is where it goes to die. GARB uses Tobii eye-tracking to build a real-time gaze model, then adapts the reading environment around it — dynamic line highlighting, distraction removal, comprehension nudges, and focus flow. Rebuilt with a full service architecture for extensibility. A user study is in design to quantify cognitive load reduction.",
    tags: ['TypeScript', 'Chrome Extension APIs', 'Tobii SDK', 'Python', 'Accessibility'],
    status: 'Development',
    github: 'https://github.com/ChristianNyamekye/garb-2024',
  },
  {
    id: 'echecsai',
    name: 'EchecsAI',
    tagline: 'Real-time Stockfish analysis — explained',
    description:
      'Chess improvement tools are either too shallow to learn from or too dense to parse. EchecsAI is a browser extension that brings Stockfish analysis directly to chess.com and lichess — streaming engine evaluations with human-readable explanations so players understand *why* a move is good, not just that it is. Runs on GCP Functions behind a Vercel frontend.',
    tags: ['TypeScript', 'Stockfish', 'Chrome APIs', 'GCP Functions', 'Vercel'],
    status: 'Live',
    link: 'https://echecsai.vercel.app',
    github: 'https://github.com/ChristianNyamekye/EchecsAI',
  },
  {
    id: 'spot',
    name: 'Spot Voice Control',
    tagline: 'Boston Dynamics Spot, controlled by voice',
    description:
      "Voice-commanding a $75,000 quadruped robot is a pipeline engineering problem. Built on a Jetson Nano, the system runs voice activity detection → ASR → intent parsing → Spot SDK dispatch in under 400ms — fast enough to feel responsive in physical space. Demonstrates natural-language interfaces for legged robotics in unstructured environments.",
    tags: ['Python', 'Jetson Nano', 'VAD', 'ASR', 'Spot SDK', 'Edge ML'],
    status: 'Complete',
    github: 'https://github.com/ChristianNyamekye/spot-voice-control',
  },
]

// ─── Notable Projects (Tier 2) ─────────────────────────────
export interface NotableProject {
  name: string
  description: string
  tags: string[]
  link?: string
  github?: string
}

export const notableProjects: NotableProject[] = [
  {
    name: 'Biblio',
    description:
      'Full-stack book-sharing platform built with a decoupled architecture — Express/MongoDB REST API hosted on Render, React client with Google Books integration, community lending queues, and per-book comment threads.',
    tags: ['Node.js', 'Express', 'MongoDB', 'React', 'REST API'],
    github: 'https://github.com/ChristianNyamekye/biblio-api',
    link: 'https://project-api-biblio.onrender.com/',
  },
  {
    name: 'AM/FM Radio',
    description:
      'Designed and built a fully functional AM/FM receiver from discrete analog components — LC tank circuits, superheterodyne architecture, and IF filtering. PCB designed and tested end-to-end. From theory to a physical, tunable radio.',
    tags: ['Analog Circuits', 'RF Design', 'PCB Layout', 'ENGS 32/61'],
  },
  {
    name: 'Duck Car',
    description:
      'Autonomous and remote-controlled vehicle with obstacle avoidance, IR-based lane following, and real-time motor control. Fused ultrasonic and IR sensor inputs to navigate without human intervention.',
    tags: ['Embedded C', 'Sensors', 'Motor Control', 'Autonomy'],
  },
  {
    name: 'Compilers',
    description:
      'Built a full compiler pipeline from source — lexer, recursive-descent parser, semantic analysis with symbol tables and type checking, and code generation. The project that makes every other CS course make sense.',
    tags: ['C', 'Compiler Design', 'Lexer', 'Parser', 'Code Generation'],
  },
  {
    name: 'Payment Transactions',
    description:
      'Transaction processing backend with ACID guarantees, idempotency keys, and concurrent write safety. Simulated real payment flows with rollback, retry logic, and audit logging under failure conditions.',
    tags: ['TypeScript', 'Node.js', 'SQL', 'Concurrency', 'Backend'],
    github: 'https://github.com/ChristianNyamekye/transfer-backend',
  },
]

// ─── Other Projects (Tier 3) ──────────────────────────────
export interface OtherProject {
  name: string
  description: string
  tags: string[]
  github?: string
  link?: string
}

export const otherProjects: OtherProject[] = [
  {
    name: 'Nuggets Multiplayer Game',
    description:
      'Multiplayer grid game in C over raw sockets. A server manages concurrent player state across rooms and passageways; players collect gold nuggets in real time. Supports up to 26 simultaneous players + a spectator.',
    tags: ['C', 'Sockets', 'Networking', 'Multiplayer'],
    github: 'https://github.com/ChristianNyamekye/nuggets-multiplayer-game',
  },
  {
    name: 'Lossless Data Compression',
    description:
      'Huffman encoding for lossless compression — variable-length code trees built from character frequency analysis, with full compress/decompress pipelines. Trees, priority queues, and maps from scratch in Java.',
    tags: ['Java', 'Huffman Encoding', 'Algorithms', 'Data Structures'],
    github: 'https://github.com/ChristianNyamekye/lossless-data-compression',
  },
  {
    name: 'Interactive Navigation System',
    description:
      'Graph-based navigation system with Dijkstra and A* pathfinding over map data. PyQt5 GUI for interactive route visualization and shortest-path queries across node graphs.',
    tags: ['Python', 'PyQt5', 'Graph Algorithms', 'A*', 'Dijkstra'],
    github: 'https://github.com/ChristianNyamekye/interactive-navigation-system',
  },
  {
    name: 'Knitting Machine IoT',
    description:
      'Retrofitted a mechanical knitting machine with IoT sensors and a web dashboard. Pattern upload, stitch count monitoring, and error detection over a live Arduino + Python pipeline.',
    tags: ['Python', 'Arduino', 'IoT', 'Web Dashboard'],
  },
  {
    name: '3D Filament Extruder',
    description:
      'PID-controlled extrusion system for 3D printer filament production. Closed-loop temperature and feed-rate control with a touchscreen HMI — control theory applied to a physical manufacturing process.',
    tags: ['Python', 'Arduino', 'PID Control', 'Hardware', 'Control Theory'],
  },
  {
    name: 'Mavis AI Chatbot',
    description:
      'NLP-powered conversational assistant with intent classification, context management, and pluggable Flask backend. Custom dialog management and entity extraction without relying on a third-party NLU service.',
    tags: ['Python', 'Flask', 'NLP', 'Intent Classification'],
    github: 'https://github.com/ChristianNyamekye/ai-driven-chatbox',
  },
  {
    name: 'Maze',
    description:
      'Procedural maze generation and multi-algorithm pathfinding — DFS generation with BFS, DFS, and A* solvers visualized in real time. Benchmarked traversal efficiency across grid topologies.',
    tags: ['Python', 'Algorithms', 'Graph Theory', 'Visualization'],
  },
  {
    name: 'Listserv',
    description:
      'Email list management system with subscription/unsubscribe flows, bounce handling, and scheduled digest delivery. Built to handle group communication at scale without third-party ESPs.',
    tags: ['Python', 'SMTP', 'Email', 'Systems'],
  },
]
