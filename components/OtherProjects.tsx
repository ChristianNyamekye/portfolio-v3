'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Github, ExternalLink, ChevronDown } from 'lucide-react'
import { otherProjects } from '@/lib/data'

const ease = [0.22, 1, 0.36, 1] as const
const INITIAL_SHOW = 5

function ArchiveRow({
  project,
  index,
}: {
  project: typeof otherProjects[0]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease, delay: index * 0.04 }}
      className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-4 border-b border-border last:border-none hover:border-border-bright transition-colors duration-200"
    >
      {/* Name */}
      <h4 className="text-sm font-medium text-text group-hover:text-accent transition-colors duration-200 min-w-[180px] shrink-0">
        {project.name}
      </h4>

      {/* Description */}
      <p className="text-xs text-muted leading-relaxed flex-1">
        {project.description}
      </p>

      {/* Tags */}
      <div className="hidden lg:flex flex-wrap gap-1.5 shrink-0 max-w-[220px] justify-end">
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] font-mono text-subtle bg-surface-2 px-2 py-0.5 rounded border border-border">
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-1.5 shrink-0">
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
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function OtherProjects() {
  const [expanded, setExpanded]  = useState(false)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const visible     = expanded ? otherProjects : otherProjects.slice(0, INITIAL_SHOW)
  const hiddenCount = otherProjects.length - INITIAL_SHOW

  return (
    <section id="other-projects" className="relative pt-0 pb-28 md:pb-36">
      <div className="max-w-[1400px] mx-auto section-padding">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="text-xs font-mono text-muted tracking-widest uppercase whitespace-nowrap">
            Archive
          </span>
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-subtle font-mono whitespace-nowrap">
            {otherProjects.length} projects
          </span>
        </motion.div>

        {/* Archive list */}
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <ArchiveRow key={project.name} project={project} index={i} />
          ))}
        </AnimatePresence>

        {/* Toggle */}
        {hiddenCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-text border border-border hover:border-border-bright px-5 py-2 rounded-xl transition-all duration-200"
            >
              {expanded ? (
                <>
                  Show less
                  <motion.span animate={{ rotate: 180 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={13} />
                  </motion.span>
                </>
              ) : (
                <>
                  Show {hiddenCount} more
                  <ChevronDown size={13} />
                </>
              )}
            </button>
          </motion.div>
        )}

      </div>
    </section>
  )
}
