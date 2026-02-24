'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, AnimatePresence } from 'framer-motion'
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

/* ═══════════════════════════════════════════════════════════
   IMMERSIVE PROJECT — Each featured project is a full-viewport
   scroll-driven experience. As you scroll, the media fills the
   background and content layers on top with parallax.
   ═══════════════════════════════════════════════════════════ */
function ImmersiveProject({ project, index }: { project: typeof featuredProjects[0]; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Parallax: media moves slower than scroll
  const mediaY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  // Content fades in as section enters center of viewport
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0, 1, 1, 0])
  const contentY = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [60, 0, 0, -60])
  // Scale media slightly as it enters
  const mediaScale = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [1.05, 1, 1, 1.05])

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Full-bleed background media with parallax */}
      <motion.div
        style={{ y: mediaY, scale: mediaScale }}
        className="absolute inset-0 z-0"
      >
        {project.video ? (
          <video
            src={project.video}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : project.image ? (
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface-2" />
        )}
      </motion.div>

      {/* Gradient overlays — left-heavy for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Content overlay */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 max-w-[1440px] mx-auto section-padding w-full py-20"
      >
        <div className="max-w-2xl"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)' }}
        >
          {/* Project number */}
          <motion.span
            className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-6"
          >
            {String(index + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}
          </motion.span>

          {/* Status */}
          <div className="mb-5">
            <StatusBadge status={project.status} />
          </div>

          {/* Title — big, bold */}
          <h3 className="font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-[0.95]">
            {project.name}
          </h3>

          {/* Tagline */}
          {project.tagline && (
            <p className="text-accent text-base md:text-lg font-medium mb-5">
              {project.tagline}
            </p>
          )}

          {/* Description */}
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono text-white/40 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action links */}
          <div className="flex items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-3 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 transition-all duration-200"
              >
                <Github size={18} />
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
                className="p-3 rounded-xl text-white/60 hover:text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 transition-all duration-200"
              >
                <ExternalLink size={18} />
              </a>
            )}
            {(project.github || project.link) && (
              <a
                href={project.link || project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white bg-accent/80 hover:bg-accent backdrop-blur-sm transition-all duration-200 shadow-lg shadow-accent/20"
              >
                View Project
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Scroll hint on first project */}
      {index === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/30" />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

/* ─── Media display (image or video) ───────────────────── */
function ProjectMedia({ project, height = 'h-64 md:h-72' }: { project: { name: string; image?: string; video?: string }; height?: string }) {
  if (project.video) {
    return (
      <div className={`relative w-full ${height} overflow-hidden bg-surface-2`}>
        <video src={project.video} className="w-full h-full object-cover" autoPlay muted loop playsInline />
      </div>
    )
  }
  if (project.image) {
    return (
      <div className={`relative w-full ${height} overflow-hidden bg-surface-2`}>
        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
      </div>
    )
  }
  return <div className={`w-full ${height} bg-surface-2`} />
}

/* ─── Notable card (Tier 2) — original grid style ──────── */
function NotableCard({ project, index }: { project: typeof notableProjects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className="group card-base card-hover flex flex-col overflow-hidden h-full"
    >
      <ProjectMedia project={project} height="h-40" />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-text text-base">{project.name}</h3>
          <div className="flex gap-1.5 shrink-0">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="p-1.5 text-muted hover:text-text transition-colors" aria-label="GitHub">
                <Github size={14} />
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                className="p-1.5 text-muted hover:text-text transition-colors" aria-label="Live">
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>

        <p className="text-muted text-sm leading-relaxed flex-1 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.tags.map((tag) => (
            <span key={tag} className="tag-base text-[11px]">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════ */
export default function Projects() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="projects">
      {/* Section header */}
      <div className="relative py-32">
        <div className="max-w-[1440px] mx-auto section-padding">
          <div ref={headerRef}>
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
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl font-semibold tracking-tight text-text"
            >
              Things I&apos;ve built
            </motion.h2>
          </div>
        </div>
      </div>

      {/* Featured — Full-bleed immersive sections */}
      {featuredProjects.map((project, i) => (
        <ImmersiveProject key={project.id} project={project} index={i} />
      ))}

      {/* Notable projects — rows with micro-interactions */}
      <div className="relative py-32">
        <div className="max-w-[1440px] mx-auto section-padding">
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
