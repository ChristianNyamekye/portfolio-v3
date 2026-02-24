// ============================================================
// data.ts - Single source of truth for all portfolio content
// Update this file to change any text/links/projects on the site
// ============================================================

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
/** Prefix local assets with basePath for GH Pages compatibility */
const asset = (path: string) => `${BASE}${path}`

export const meta = {
  name: 'Christian Nyamekye',
  title: 'Christian Nyamekye - Engineer, Builder, Founder',
  description:
    'Dartmouth EE+CS. Building at the intersection of hardware, software, and applied AI - from embedded systems and robotics to full-stack platforms.',
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
  eyebrow: 'Developer | Coulter Scholar',
  eyebrowLink: 'https://students.dartmouth.edu/surfd/scholar-programs/coulter-scholars',
  headline: 'Engineering what\ncomes next.',
  subline:
    'From embedded systems and robotics to full-stack platforms and applied ML - I build technology that bridges hardware and software to solve real problems.',
  cta: { label: 'See the work', href: '#projects' },
  ctaSecondary: { label: 'Get in touch', href: '#contact' },
}

export const about = {
  paragraphs: [
    "I'm a Dartmouth double-major in Electrical Engineering and Computer Science, building systems that live at the intersection of hardware, software, and applied AI.",
    'From avionics flight displays to quantum computing to rewriting the economics of robotics training data - I care about problems where the physics matters.',
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
    org: 'Salesforce (MuleSoft)',
    period: '2025',
    description:
      'Full-stack developer on the Anypoint Code Builder team - MuleSoft\'s cloud-native IDE for designing, building, and deploying API integrations. Worked across the stack on tooling that powers enterprise integration workflows: API specification design (OAS/RAML), scaffolding pipelines, and developer experience features used by thousands of integration engineers.',
    tags: ['TypeScript', 'VS Code Extensions', 'API Design', 'Cloud IDE', 'Full-Stack'],
    link: 'https://www.mulesoft.com/platform/api/anypoint-code-builder',
  },
  {
    role: 'Developer | Coulter Scholar',
    org: 'DALI Lab - Dartmouth',
    period: '2024',
    description:
      "Dartmouth's applied design and innovation lab. Built client-facing products end-to-end - UX through backend - under real deadline pressure for real clients.",
    tags: ['React', 'Node.js', 'Product Design'],
    link: 'https://dali.dartmouth.edu',
  },
  {
    role: 'Possibilities Summit Fellow',
    org: 'Goldman Sachs',
    period: '2024',
    description:
      'Selected for the Goldman Sachs Possibilities Summit - an immersive program for high-potential undergraduates featuring interactive workshops on industry skills, networking with GS professionals, and exposure to careers in financial services and technology.',
    tags: ['Finance', 'Leadership', 'Networking'],
    link: 'https://www.goldmansachs.com/careers/students/programs-and-internships/americas/possibilities-series',
  },
  {
    role: 'Open-Source Contributor',
    org: 'IBM Qiskit',
    period: '2024',
    description:
      'Contributed to the Qiskit quantum computing SDK - features and fixes across the open-source ecosystem, with exposure to quantum circuit simulation and transpilation.',
    tags: ['Python', 'Quantum Computing', 'Open Source'],
    link: 'https://github.com/Qiskit',
  },
  {
    role: 'Software Engineering Intern',
    org: 'URAD',
    period: '2023',
    description:
      'Avionics flight display systems. Implemented real-time data rendering pipelines for cockpit instrumentation - where the tolerance for bugs is exactly zero.',
    tags: ['C++', 'Embedded', 'Avionics', 'Real-Time Systems'],
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
  video?: string
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'egodex',
    name: 'EgoDex',
    tagline: 'Crowdsourced manipulation data for humanoid robots',
    description:
      'The economics of robotics training data are broken - motion capture rigs cost $8,700+. EgoDex rebuilds the pipeline with an iPhone + Apple Watch for $950, then syndicates structured training sets to robotics labs.',
    tags: ['Swift', 'CoreML', 'Next.js', 'Python', 'Computer Vision', 'Robotics'],
    status: 'Active',
    video: asset('/egodex-hq.mp4'),
    github: 'https://github.com/ChristianNyamekye/egodex',
  },
  {
    id: 'garb',
    name: 'GARB',
    tagline: 'Gaze-Aware Reading Aid for the Browser',
    description:
      'Uses Tobii eye-tracking to build a real-time gaze model that adapts the reading environment - dynamic line highlighting, distraction removal, and comprehension nudges. Full service architecture with a user study in design.',
    tags: ['TypeScript', 'Chrome Extension APIs', 'Tobii SDK', 'Python', 'Accessibility'],
    video: asset('/garb.mp4'),
    status: 'Development',
    github: 'https://github.com/ChristianNyamekye/garb-2024',
  },
  {
    id: 'spot',
    name: 'Autonomous Spot Platform',
    tagline: 'Extending Boston Dynamics Spot with voice, autonomy, and custom hardware',
    description:
      'Multi-semester research platform built on Boston Dynamics Spot. Developed voice-controlled operation (VAD → ASR → intent → SDK dispatch in <400ms), autonomous navigation, person-following via perception pipelines, and custom payload design in SolidWorks. Full-stack robotics — from CAD and MuJoCo simulation to real-time edge inference on Jetson Nano.',
    tags: ['Python', 'Spot SDK', 'Jetson Nano', 'SolidWorks', 'MuJoCo', 'Edge ML', 'Autonomy'],
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
  video?: string
}

export const notableProjects: NotableProject[] = [
  {
    name: 'Duck Car',
    description:
      'Control systems project: autonomous vehicle with IR-based lane following, ultrasonic obstacle avoidance, PID-tuned motor control, and real-time sensor fusion.',
    tags: ['Control Systems', 'PID', 'Embedded C', 'Sensors'],
    video: asset('/duck-car.mov'),
  },
  {
    name: 'Listserv',
    description:
      'Email list management system with subscription/unsubscribe flows, bounce handling, and scheduled digest delivery.',
    tags: ['Python', 'SMTP', 'Email', 'Systems'],
    link: 'https://listservcal.tech',
    image: asset('/listserv.png'),
  },
  {
    name: 'AM/FM Radio',
    description:
      'Built a fully functional AM/FM receiver from discrete analog components - LC tank circuits, superheterodyne architecture, PCB designed end-to-end.',
    tags: ['Analog Circuits', 'RF Design', 'PCB Layout'],
    image: asset('/amfm-radio.png'),
  },
  {
    name: 'Payment Transactions',
    description:
      'Transaction processing backend with ACID guarantees, idempotency keys, and concurrent write safety under failure conditions.',
    tags: ['TypeScript', 'Node.js', 'SQL', 'Concurrency', 'Backend'],
    github: 'https://github.com/ChristianNyamekye/transfer-backend',
  },
  {
    name: 'EchecsAI',
    description:
      'Browser extension bringing Stockfish analysis to chess.com and lichess with human-readable explanations. Runs on GCP Functions behind a Vercel frontend.',
    tags: ['TypeScript', 'Stockfish', 'Chrome APIs', 'GCP Functions', 'Vercel'],
    image: asset('/echecsai.png'),
    link: 'https://echecsai.vercel.app',
    github: 'https://github.com/ChristianNyamekye/EchecsAI',
  },
  {
    name: 'Biblio',
    description:
      'Full-stack book-sharing platform - Express/MongoDB API, React client with Google Books integration and community lending queues.',
    tags: ['Node.js', 'Express', 'MongoDB', 'React', 'REST API'],
    image: asset('/biblio.png'),
    github: 'https://github.com/ChristianNyamekye/biblio-client',
    link: 'https://project-client-biblio.onrender.com',
  },
]

// ─── Other Projects (Tier 3) ──────────────────────────────
export interface OtherProject {
  name: string
  description: string
  tags: string[]
  github?: string
  link?: string
  image?: string
  video?: string
}

export const otherProjects: OtherProject[] = [
  {
    name: 'Compilers',
    description:
      'Full compiler pipeline from scratch - lexer, recursive-descent parser, semantic analysis, and code generation.',
    tags: ['C', 'Compiler Design', 'Lexer', 'Parser', 'Code Generation'],
  },
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
      'Huffman encoding with full compress/decompress pipelines - trees, priority queues, and maps from scratch in Java.',
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
      'Retrofitted a mechanical knitting machine with IoT sensors - pattern upload, stitch monitoring, and error detection via Arduino + Python.',
    tags: ['Python', 'Arduino', 'IoT', 'Web Dashboard'],
    link: 'https://mollymorin.com/knitlab/',
  },
  {
    name: '3D Filament Extruder',
    description:
      'PID-controlled extrusion system for 3D printer filament with closed-loop temperature control and touchscreen HMI.',
    tags: ['Python', 'Arduino', 'PID Control', 'Hardware', 'Control Theory'],
    video: asset('/filament-extruder.mov'),
    link: 'https://www.instagram.com/thayerschool/reel/Ctr-0E5NCU5/',
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
      'Embedded systems maze-solving robot with procedural generation, multi-algorithm pathfinding (BFS, DFS, A*), and real-time visualization.',
    tags: ['Embedded C', 'Algorithms', 'Robotics', 'Sensors'],
  },
]
