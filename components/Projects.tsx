'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react'
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

/* ─── Featured card (Tier 1) ───────────────────────────── */
function FeaturedCard({ project, index }: { project: typeof featuredProjects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="group relative"
    >
      <div className={`
        relative rounded-2xl border overflow-hidden transition-all duration-500
        ${project.flagship
          ? 'bg-gradient-to-br from-surface via-surface to-surface-2 border-accent/30 hover:border-accent/60'
          : 'bg-surface border-border hover:border-border-bright'
        }
        hover:shadow-2xl hover:shadow-accent/5
      `}>
        {/* Flagship gradient header bar */}
        {project.flagship && (
          <div className="h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        )}

        {/* Decorative bg glow on flagship */}
        {project.flagship && (
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative p-7 md:p-9">
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex flex-wrap items-center gap-2">
              {project.flagship && (
                <span className="flagship-badge text-xs font-semibold px-3 py-1 rounded-full">
                  ★ Flagship
                </span>
              )}
              <StatusBadge status={project.status} />
            </div>
            {/* Links */}
            <div className="flex items-center gap-2 shrink-0">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2 rounded-lg text-subtle hover:text-text hover:bg-surface-2 border border-transparent hover:border-border transition-all duration-200"
                >
                  <Github size={16} />
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Live demo"
                  className="p-2 rounded-lg text-subtle hover:text-text hover:bg-surface-2 border border-transparent hover:border-border transition-all duration-200"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Name & tagline */}
          <h3 className={`font-semibold tracking-tight mb-2 ${project.flagship ? 'text-2xl md:text-3xl text-text' : 'text-xl md:text-2xl text-text'}`}>
            {project.name}
          </h3>
          <p className={`font-medium mb-4 ${project.flagship ? 'text-accent text-base' : 'text-accent/80 text-sm'}`}>
            {project.tagline}
          </p>

          {/* Metric callout (flagship only) */}
          {project.metric && (
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-lg px-4 py-2 mb-5">
              <span className="text-accent font-mono text-sm font-semibold">{project.metric}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-muted text-sm leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="tag-base">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Notable card (Tier 2) ────────────────────────────── */
function NotableCard({ project, index }: { project: typeof notableProjects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className="group card-base card-hover p-6 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors duration-300">
          <span className="text-accent/70 text-sm">
            {project.name.charAt(0)}
          </span>
        </div>
        <div className="flex gap-1.5">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="p-1.5 text-subtle hover:text-text transition-colors"
              aria-label="GitHub">
              <Github size={14} />
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer"
              className="p-1.5 text-subtle hover:text-text transition-colors"
              aria-label="Live">
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-text text-base mb-2">{project.name}</h3>
      <p className="text-muted text-sm leading-relaxed flex-1 mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {project.tags.map((tag) => (
          <span key={tag} className="tag-base text-[11px]">{tag}</span>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Main section ──────────────────────────────────────── */
export default function Projects() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="projects" className="relative py-32">
      {/* Subtle section bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/10 to-background pointer-events-none" />

      <div className="relative max-w-7xl mx-auto section-padding">

        {/* ── Header ── */}
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
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text">
              Things I've built
            </h2>
            <p className="text-sm text-muted max-w-sm">
              From hardware prototypes to full-stack platforms. 17+ projects across the stack.
            </p>
          </motion.div>
        </div>

        {/* ── Tier 1: Featured (2-col on large) ── */}
        <div className="mb-20">
          {/* Flagship project gets full-width treatment */}
          <div className="mb-6">
            <FeaturedCard project={featuredProjects[0]} index={0} />
          </div>

          {/* Rest of featured in 1–2 col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProjects.slice(1).map((project, i) => (
              <FeaturedCard key={project.id} project={project} index={i + 1} />
            ))}
          </div>
        </div>

        {/* ── Tier 2: Notable projects ── */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <h3 className="text-sm font-mono text-muted uppercase tracking-widest">Notable</h3>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notableProjects.map((project, i) => (
              <NotableCard key={project.name} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
