'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Github, ExternalLink, ChevronDown, Play, X } from 'lucide-react'
import { otherProjects } from '@/lib/data'

const INITIAL_SHOW = 4

function CompactCard({ project, index }: { project: typeof otherProjects[0]; index: number }) {
  const [playing, setPlaying] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="group card-base card-hover p-5 relative overflow-hidden"
    >
      {/* Media overlay — same size as card, cropped to fit */}
      {playing && (project.video || project.image) && (
        <div className="absolute inset-0 z-20 bg-surface rounded-2xl overflow-hidden">
          <button
            onClick={() => setPlaying(false)}
            className="absolute top-2 right-2 z-30 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
            aria-label="Close media"
          >
            <X size={14} />
          </button>
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
              className="w-full h-full object-contain bg-surface cursor-zoom-in p-2"
              onClick={() => window.open(project.image, '_blank')}
            />
          ) : null}
        </div>
      )}
      {/* Top bar */}
      <div className="flex items-start justify-between mb-3">
        {/* Folder icon */}
        <svg
          className="text-accent/50 group-hover:text-accent transition-colors duration-300"
          width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        </svg>

        <div className="flex gap-1.5">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-1 text-subtle hover:text-text transition-colors">
              <Github size={14} />
            </a>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer"
              aria-label="Live"
              className="p-1 text-subtle hover:text-text transition-colors">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      <h4 className="font-semibold text-text text-sm mb-2 group-hover:text-accent transition-colors duration-200">
        {project.name}
      </h4>
      <p className="text-muted text-xs leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Tags + play button */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {project.tags.map((tag) => (
          <span key={tag} className="text-[10px] font-mono text-subtle bg-surface-2 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
        {(project.video || project.image) && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setPlaying(true)
            }}
            className="ml-auto p-1.5 rounded-lg bg-accent/5 text-accent/60 hover:text-accent hover:bg-accent/10 transition-colors duration-200"
            aria-label={project.video ? 'Play video' : 'View image'}
            title={project.video ? 'Watch video' : 'View image'}
          >
            {project.video ? <Play size={12} fill="currentColor" /> : <ExternalLink size={12} />}
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function OtherProjects() {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const visible = expanded ? otherProjects : otherProjects.slice(0, INITIAL_SHOW)
  const hiddenCount = otherProjects.length - INITIAL_SHOW

  return (
    <section id="other-projects" className="relative pt-20 pb-32">
      <div className="max-w-[1440px] mx-auto section-padding">

        {/* Header */}
        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-4"
          >
            <h3 className="text-sm font-mono text-muted uppercase tracking-widest whitespace-nowrap">
              More Projects
            </h3>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-subtle font-mono whitespace-nowrap">
              {otherProjects.length} total
            </span>
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <CompactCard key={project.name} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Show more / less button */}
        {hiddenCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="
                group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl
                border border-border text-muted text-sm font-medium
                hover:border-border-bright hover:text-text
                transition-all duration-200
              "
            >
              {expanded ? (
                <>
                  Show less
                  <motion.span animate={{ rotate: 180 }}>
                    <ChevronDown size={15} />
                  </motion.span>
                </>
              ) : (
                <>
                  Show {hiddenCount} more
                  <motion.span animate={{ rotate: 0 }}>
                    <ChevronDown size={15} />
                  </motion.span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

