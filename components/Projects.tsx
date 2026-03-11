'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react'
import { featuredProjects, notableProjects } from '@/lib/data'

const ease = [0.22, 1, 0.36, 1] as const

/* ─── Status badge ─────────────────────────────────────── */
function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const map: Record<string, string> = {
    Active:      'text-emerald-400 bg-emerald-400/8  border-emerald-400/20',
    Live:        'text-blue-400   bg-blue-400/8    border-blue-400/20',
    Development: 'text-amber-400  bg-amber-400/8   border-amber-400/20',
    Complete:    'text-violet-400 bg-violet-400/8  border-violet-400/20',
  }
  const cls = map[status] ?? 'text-muted bg-surface-2 border-border'
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-medium px-2.5 py-1 rounded-full border ${cls}`}>
      {status === 'Active' && <span className="status-dot-active" />}
      {status}
    </span>
  )
}

/* ─── Project media ────────────────────────────────────── */
function ProjectMedia({
  project,
  className = '',
}: {
  project: { name: string; image?: string; video?: string }
  className?: string
}) {
  if (project.video) {
    return (
      <video
        src={project.video}
        className={`w-full h-full object-cover ${className}`}
        autoPlay muted loop playsInline
      />
    )
  }
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.name}
        className={`w-full h-full object-cover object-center ${className}`}
      />
    )
  }
  return <div className={`w-full h-full bg-surface-2 ${className}`} />
}

/* ═══════════════════════════════════════════════════════════
   FEATURED CARD — horizontal layout (media left, text right)
   On mobile it stacks vertically.
   ═══════════════════════════════════════════════════════════ */
function FeaturedCard({
  project,
  index,
}: {
  project: typeof featuredProjects[0]
  index: number
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease, delay: index * 0.1 }}
      className="group grid grid-cols-1 lg:grid-cols-[1fr_1fr] rounded-2xl overflow-hidden border border-border bg-surface transition-all duration-300 hover:border-border-bright"
    >
      {/* Media */}
      <div className="relative overflow-hidden aspect-video lg:aspect-auto min-h-[240px] bg-surface-2">
        <ProjectMedia
          project={project}
          className="transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {/* Gradient overlay so media edge merges into the card */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface/50 hidden lg:block" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-8 lg:p-10">
        <div>
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-5">
            <StatusBadge status={project.status} />
            <span className="text-xs font-mono text-subtle">
              {String(index + 1).padStart(2, '0')} / featured
            </span>
          </div>

          {/* Name */}
          <h3
            className="text-display font-semibold text-text mb-2 transition-colors duration-200 group-hover:text-text"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
          >
            {project.name}
          </h3>

          {/* Tagline */}
          {project.tagline && (
            <p className="text-accent text-sm font-medium mb-4 leading-snug">
              {project.tagline}
            </p>
          )}

          {/* Description */}
          <p className="text-muted text-sm leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-8">
            {project.tags.slice(0, 6).map((tag) => (
              <span key={tag} className="tag-base text-[11px]">{tag}</span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-text border border-border hover:border-border-bright px-3 py-2 rounded-lg transition-all duration-200"
            >
              <Github size={13} />
              GitHub
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit project"
              className="flex items-center gap-1.5 text-xs font-mono text-accent hover:text-blue-400 border border-accent/30 hover:border-accent/60 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <ExternalLink size={13} />
              Visit
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/* ─── Notable card (compact grid tile) ────────────────── */
function NotableCard({
  project,
  index,
}: {
  project: typeof notableProjects[0]
  index: number
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease, delay: (index % 3) * 0.07 }}
      className="group card-base card-hover flex flex-col overflow-hidden h-full"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-surface-2 overflow-hidden">
        <ProjectMedia
          project={project}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3 className="font-semibold text-text text-sm leading-snug group-hover:text-accent transition-colors duration-200">
            {project.name}
          </h3>
          <div className="flex gap-1 shrink-0">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-1.5 text-subtle hover:text-text transition-colors"
              >
                <Github size={13} />
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit"
                className="p-1.5 text-subtle hover:text-text transition-colors"
              >
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </div>

        <p className="text-muted text-xs leading-relaxed flex-1 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag-base text-[10px]">{tag}</span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION
   ═══════════════════════════════════════════════════════════ */
export default function Projects() {
  const headerRef    = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const [showAll, setShowAll]  = useState(false)
  const INITIAL = 6

  return (
    <section id="projects" className="relative py-28 md:py-36">
      <div className="max-w-[1400px] mx-auto section-padding">

        {/* Section label + heading */}
        <div ref={headerRef} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-4"
          >
            <span className="text-xs font-mono text-accent tracking-[0.18em] uppercase">
              03 / Projects
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="text-display font-semibold text-text"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}
          >
            Things I've built
          </motion.h2>
        </div>

        {/* Featured — horizontal cards, stacked */}
        <div className="flex flex-col gap-5 mb-20">
          {featuredProjects.map((project, i) => (
            <FeaturedCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Notable divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10"
        >
          <span className="text-xs font-mono text-muted tracking-widest uppercase whitespace-nowrap">
            Notable
          </span>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {/* Notable grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showAll ? notableProjects : notableProjects.slice(0, INITIAL)).map((project, i) => (
            <NotableCard key={project.name} project={project} index={i} />
          ))}
        </div>

        {/* Toggle */}
        {notableProjects.length > INITIAL && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-mono text-muted hover:text-text border border-border hover:border-border-bright px-6 py-2.5 rounded-xl transition-all duration-200"
            >
              {showAll
                ? 'Show less'
                : `View ${notableProjects.length - INITIAL} more`}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
