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
    org: 'Salesforce',
    period: '2025',
    description:
      'Software Engineering Intern at Salesforce. Details coming soon.',
    tags: ['Salesforce', 'Cloud Platform', 'Enterprise Software'],
    link: 'https://salesforce.com',
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
  image?: string
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'egodex',
    name: 'EgoDex',
    tagline: 'Crowdsourced manipulation data for humanoid robots',
    description:
      'The economics of robotics training data are broken — motion capture rigs cost $8,700+. EgoDex rebuilds the pipeline with an iPhone + Apple Watch for $950, then syndicates structured training sets to robotics labs.',
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
      'Uses Tobii eye-tracking to build a real-time gaze model that adapts the reading environment — dynamic line highlighting, distraction removal, and comprehension nudges. Full service architecture with a user study in design.',
    tags: ['TypeScript', 'Chrome Extension APIs', 'Tobii SDK', 'Python', 'Accessibility'],
    status: 'Development',
    github: 'https://github.com/ChristianNyamekye/garb-2024',
  },
  {
    id: 'echecsai',
    name: 'EchecsAI',
    tagline: 'Real-time Stockfish analysis — explained',
    description:
      'Browser extension bringing Stockfish analysis to chess.com and lichess with human-readable explanations. Runs on GCP Functions behind a Vercel frontend.',
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
      'Voice-commanding a quadruped robot via Jetson Nano: VAD → ASR → intent parsing → Spot SDK dispatch in under 400ms. Natural-language interfaces for legged robotics.',
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
  image?: string
}

export const notableProjects: NotableProject[] = [
  {
    name: 'Biblio',
    description:
      'Full-stack book-sharing platform — Express/MongoDB API, React client with Google Books integration and community lending queues.',
    tags: ['Node.js', 'Express', 'MongoDB', 'React', 'REST API'],
    github: 'https://github.com/ChristianNyamekye/biblio-api',
    link: 'https://project-api-biblio.onrender.com/',
  },
  {
    name: 'AM/FM Radio',
    description:
      'Built a fully functional AM/FM receiver from discrete analog components — LC tank circuits, superheterodyne architecture, PCB designed end-to-end.',
    tags: ['Analog Circuits', 'RF Design', 'PCB Layout', 'ENGS 32/61'],
  },
  {
    name: 'Duck Car',
    description:
      'Autonomous vehicle with IR-based lane following, ultrasonic obstacle avoidance, and real-time motor control.',
    tags: ['Embedded C', 'Sensors', 'Motor Control', 'Autonomy'],
  },
  {
    name: 'Compilers',
    description:
      'Full compiler pipeline from scratch — lexer, recursive-descent parser, semantic analysis, and code generation.',
    tags: ['C', 'Compiler Design', 'Lexer', 'Parser', 'Code Generation'],
  },
  {
    name: 'Payment Transactions',
    description:
      'Transaction processing backend with ACID guarantees, idempotency keys, and concurrent write safety under failure conditions.',
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
      'Multiplayer grid game in C over raw sockets supporting up to 26 simultaneous players collecting gold nuggets in real time.',
    tags: ['C', 'Sockets', 'Networking', 'Multiplayer'],
    github: 'https://github.com/ChristianNyamekye/nuggets-multiplayer-game',
  },
  {
    name: 'Lossless Data Compression',
    description:
      'Huffman encoding with full compress/decompress pipelines — trees, priority queues, and maps from scratch in Java.',
    tags: ['Java', 'Huffman Encoding', 'Algorithms', 'Data Structures'],
    github: 'https://github.com/ChristianNyamekye/lossless-data-compression',
  },
  {
    name: 'Interactive Navigation System',
    description:
      'Graph-based navigation with Dijkstra and A* pathfinding, PyQt5 GUI for interactive route visualization.',
    tags: ['Python', 'PyQt5', 'Graph Algorithms', 'A*', 'Dijkstra'],
    github: 'https://github.com/ChristianNyamekye/interactive-navigation-system',
  },
  {
    name: 'Knitting Machine IoT',
    description:
      'Retrofitted a mechanical knitting machine with IoT sensors — pattern upload, stitch monitoring, and error detection via Arduino + Python.',
    tags: ['Python', 'Arduino', 'IoT', 'Web Dashboard'],
  },
  {
    name: '3D Filament Extruder',
    description:
      'PID-controlled extrusion system for 3D printer filament with closed-loop temperature control and touchscreen HMI.',
    tags: ['Python', 'Arduino', 'PID Control', 'Hardware', 'Control Theory'],
  },
  {
    name: 'Mavis AI Chatbot',
    description:
      'NLP-powered conversational assistant with intent classification, context management, and custom dialog handling via Flask.',
    tags: ['Python', 'Flask', 'NLP', 'Intent Classification'],
    github: 'https://github.com/ChristianNyamekye/ai-driven-chatbox',
  },
  {
    name: 'Maze',
    description:
      'Procedural maze generation with DFS and multi-algorithm pathfinding (BFS, DFS, A*) visualized in real time.',
    tags: ['Python', 'Algorithms', 'Graph Theory', 'Visualization'],
  },
  {
    name: 'Listserv',
    description:
      'Email list management with subscription flows, bounce handling, and scheduled digest delivery.',
    tags: ['Python', 'SMTP', 'Email', 'Systems'],
  },
]
