'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, ArrowUpRight, ChevronLeft, ChevronRight, ChevronDown, Play, X } from 'lucide-react'
import { featuredProjects, notableProjects, otherProjects } from '@/lib/data'
import type { FeaturedProject, NotableProject, OtherProject } from '@/lib/data'

/* ─── Status badge ─────────────────────────────────────── */
function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const colors: Record<string, string> = {
    Active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Live: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Development: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Complete: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${colors[status] || 'text-zinc-400 border-zinc-700'}`}>
      {status === 'Active' && <span className="status-dot" />}
      {status}
    </span>
  )
}

/* ─── Featured Carousel ────────────────────────────────── */
const AUTO_ADVANCE_MS = 6000

function FeaturedCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = featuredProjects.length

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [paused, next])

  const project = featuredProjects[current]

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-[460px] md:h-[540px] lg:h-[600px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
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
            <video src={project.video} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : project.image ? (
            <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[var(--bg-surface)]" />
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
            <p className="text-[var(--accent)] text-sm md:text-base font-medium mb-4">{project.tagline}</p>
          )}

          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 max-w-lg">{project.description}</p>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-wrap gap-3">
              {project.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="text-xs font-mono text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                  className="p-2.5 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                  <Github size={18} />
                </a>
              )}
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label="Live"
                  className="p-2.5 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                  <ExternalLink size={18} />
                </a>
              )}
              {(project.github || project.link) && (
                <a href={project.link || project.github} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--accent)]/80 hover:bg-[var(--accent)] transition-all">
                  View Project <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      <button onClick={prev} className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white transition-all" aria-label="Previous">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white transition-all" aria-label="Next">
        <ChevronRight size={20} />
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-4 right-8 md:right-12 z-20 flex items-center gap-2">
        {featuredProjects.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-[var(--accent)]' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
            aria-label={`Project ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Notable row ──────────────────────────────────────── */
function NotableRow({ project, index }: { project: NotableProject; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group"
    >
      <a
        href={project.link || project.github || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between py-5 md:py-6 border-b border-[var(--border)] hover:border-[var(--border-bright)] transition-colors"
      >
        <div className="flex items-center gap-5 flex-1 min-w-0">
          {/* Thumbnail */}
          {project.image && (
            <div className="hidden sm:block w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-surface)] shrink-0">
              <img src={project.image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
              {project.name}
            </h4>
            <p className="text-xs text-[var(--text-tertiary)] truncate max-w-md mt-0.5">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <div className="hidden md:flex gap-2">
            {project.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <ArrowUpRight size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-all" />
        </div>
      </a>
    </motion.div>
  )
}

/* ─── Other project card ───────────────────────────────── */
function OtherCard({ project, index }: { project: OtherProject; index: number }) {
  const [playing, setPlaying] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative p-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-bright)] transition-all"
    >
      {/* Video/image overlay */}
      {playing && (project.video || project.image) && (
        <div className="absolute inset-0 z-20 rounded-xl overflow-hidden bg-[var(--bg-surface)]">
          <button onClick={() => setPlaying(false)} className="absolute top-2 right-2 z-30 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors" aria-label="Close">
            <X size={14} />
          </button>
          {project.video ? (
            <video src={project.video} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          ) : project.image ? (
            <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
          ) : null}
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <svg className="text-[var(--accent)]/40 group-hover:text-[var(--accent)] transition-colors" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
        <div className="flex gap-1.5">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors" aria-label="GitHub">
              <Github size={14} />
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors" aria-label="Live">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <h4 className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
        {project.name}
      </h4>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 items-center">
        {project.tags.map((tag) => (
          <span key={tag} className="text-[10px] font-mono text-[var(--text-tertiary)] bg-[var(--bg-surface)] px-2 py-0.5 rounded">{tag}</span>
        ))}
        {(project.video || project.image) && (
          <button onClick={() => setPlaying(true)} className="ml-auto p-1.5 rounded-lg bg-[var(--accent-glow)] text-[var(--accent)]/60 hover:text-[var(--accent)] transition-colors" aria-label="Preview">
            {project.video ? <Play size={12} fill="currentColor" /> : <ExternalLink size={12} />}
          </button>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Main Work Section ────────────────────────────────── */
export default function Work() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [showAll, setShowAll] = useState(false)

  const visibleOther = showAll ? otherProjects : otherProjects.slice(0, 4)

  return (
    <section ref={ref} id="work" className="section-gap">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="mono-xs text-[var(--accent)]">03. Work</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="heading-lg mb-16"
        >
          Things I&apos;ve built
        </motion.h2>

        {/* Featured carousel */}
        <div className="mb-24">
          <FeaturedCarousel />
        </div>

        {/* Divider */}
        <div className="divider mb-16" />

        {/* Notable */}
        <div className="mb-24">
          <h3 className="mono-xs text-[var(--text-tertiary)] mb-8">Notable Projects</h3>
          <div>
            {notableProjects.map((project, i) => (
              <NotableRow key={project.name} project={project} index={i} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-16" />

        {/* Other */}
        <div>
          <h3 className="mono-xs text-[var(--text-tertiary)] mb-8">
            Other Projects <span className="text-[var(--text-tertiary)]/50">({otherProjects.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {visibleOther.map((project, i) => (
                <OtherCard key={project.name} project={project} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {otherProjects.length > 4 && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:border-[var(--border-bright)] hover:text-[var(--text-primary)] transition-all"
              >
                {showAll ? 'Show less' : `Show ${otherProjects.length - 4} more`}
                <ChevronDown size={15} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
