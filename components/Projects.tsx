'use client'

import { useRef, useState, useEffect, useCallback, type MouseEvent as ReactMouseEvent } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { featuredProjects, notableProjects } from '@/lib/data'

/* ─── Status badge ─────────────────────────────────────── */
function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const colors: Record<string, string> = {
    Active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Live: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Development: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Complete: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  }
  const cls = colors[status] ?? 'text-muted bg-surface-2 border-border'
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}>
      {status === 'Active' && <span className="status-dot-active" />}
      {status}
    </span>
  )
}

/* ─── Media display (image or video) ───────────────────── */
function ProjectMedia({ project, height = 'h-64 md:h-72' }: { project: { name: string; image?: string; video?: string }; height?: string }) {
  if (project.video) {
    return (
      <div className={`relative w-full ${height} overflow-hidden bg-surface-2 flex items-center justify-center`}>
        <video
          src={project.video}
          className="w-full h-full object-cover object-top"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    )
  }
  if (project.image) {
    return (
      <div className={`relative w-full ${height} overflow-hidden bg-surface-2`}>
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }
  return (
    <div className={`relative w-full ${height} overflow-hidden bg-gradient-to-br from-accent/8 via-surface-2 to-surface flex items-center justify-center`}>
      <span className="text-4xl font-bold text-accent/15 font-mono select-none">
        {project.name}
      </span>
    </div>
  )
}

/* ─── Featured Carousel — One project at a time, auto-advances ── */
const AUTO_ADVANCE_MS = 6000

function FeaturedCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = featuredProjects.length
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

  // Auto-advance
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [paused, next])

  const project = featuredProjects[current]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative rounded-2xl overflow-hidden h-[460px] md:h-[540px] lg:h-[600px]">
        {/* Background media */}
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {project.video ? (
              <video
                src={project.video}
                className="w-full h-full object-cover"
                autoPlay muted loop playsInline
              />
            ) : project.image ? (
              <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface-2" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id + '-content'}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 max-w-2xl"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.5)' }}
          >
            <div className="mb-4">
              <StatusBadge status={project.status} />
            </div>

            <h3 className="font-bold tracking-tight text-3xl md:text-4xl lg:text-5xl text-white mb-3">
              {project.name}
            </h3>

            {project.tagline && (
              <p className="text-accent text-sm md:text-base font-medium mb-4">
                {project.tagline}
              </p>
            )}

            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 max-w-lg">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-wrap gap-3">
                {project.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="text-xs font-mono text-white/50 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                    className="p-2.5 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-200">
                    <Github size={18} />
                  </a>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label="Live demo"
                    className="p-2.5 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-200">
                    <ExternalLink size={18} />
                  </a>
                )}
                {(project.github || project.link) && (
                  <a href={project.link || project.github} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-accent/80 hover:bg-accent backdrop-blur-sm transition-all duration-200">
                    View Project <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white transition-all"
          aria-label="Previous project"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white transition-all"
          aria-label="Next project"
        >
          <ChevronRight size={20} />
        </button>

        {/* Progress dots */}
        <div className="absolute bottom-4 right-8 md:right-12 z-20 flex items-center gap-2">
          {featuredProjects.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-accent' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Notable row — huyml-style hover image reveal ────── */
function NotableRow({ project, index }: { project: typeof notableProjects[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const rowRef = useRef<HTMLDivElement>(null)

  const onMouseMove = (e: React.MouseEvent) => {
    if (!rowRef.current) return
    const rect = rowRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group relative border-b border-border/50 last:border-b-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
    >
      <a
        href={project.link || project.github || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between py-6 md:py-8 px-2"
      >
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <span className="text-xs font-mono text-subtle w-8 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-text group-hover:text-accent transition-colors duration-300 truncate">
            {project.name}
          </h3>
          <p className="hidden md:block text-sm text-muted truncate max-w-xs">
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex gap-2">
            {project.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag-base text-[10px]">{tag}</span>
            ))}
          </div>
          <ArrowUpRight size={18} className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
        </div>
      </a>

      {/* Floating image on hover */}
      {project.image && (
        <div
          className="absolute z-30 pointer-events-none transition-opacity duration-300 rounded-xl overflow-hidden shadow-2xl"
          style={{
            opacity: hovered ? 1 : 0,
            left: mousePos.x + 20,
            top: mousePos.y - 80,
            width: 280,
            height: 180,
          }}
        >
          <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
        </div>
      )}
    </motion.div>
  )
}

/* ─── Main section ──────────────────────────────────────── */
export default function Projects() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="relative py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/10 to-background pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto section-padding">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-3"
          >
            <span className="text-xs font-mono text-accent tracking-widest uppercase">
              003 / Projects
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-text">
              Things I&apos;ve built
            </h2>
          </motion.div>
        </div>

        {/* Featured — interactive carousel, one at a time */}
        <div className="mb-32">
          <FeaturedCarousel />
        </div>

        {/* Notable projects */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-12"
          >
            <h3 className="text-sm font-mono text-muted uppercase tracking-widest">Notable</h3>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          <div className="border-t border-border/50">
            {notableProjects.map((project, i) => (
              <NotableRow key={project.name} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

