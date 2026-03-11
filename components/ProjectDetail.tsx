'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Github, ExternalLink } from 'lucide-react'
import type { FeaturedProject } from '@/lib/data'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function ProjectDetail({ project }: { project: FeaturedProject }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      <motion.div variants={stagger} initial="hidden" animate="show">
        {/* Back */}
        <motion.div variants={fadeUp}>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors mb-12"
          >
            <ArrowLeft size={13} /> Back
          </a>
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeUp}>
          {project.status && (
            <span className="text-[11px] text-[var(--muted)] border border-[var(--border)] rounded-full px-3 py-1 inline-block mb-4">
              {project.status}
            </span>
          )}
          <h1 className="text-3xl font-semibold tracking-tight mb-2">{project.name}</h1>
          <p className="text-sm text-[var(--dim)] italic mb-8">{project.tagline}</p>
        </motion.div>

        {/* Media — consistent 16:9 aspect ratio */}
        {(project.video || project.image) && (
          <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden bg-[var(--surface)] mb-8 aspect-video">
            {project.video ? (
              <video
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : project.image ? (
              <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
            ) : null}
          </motion.div>
        )}

        {/* Description */}
        <motion.div variants={fadeUp}>
          <p className="text-sm text-[var(--dim)] leading-relaxed mb-8">
            {project.description}
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-[var(--muted)] border border-[var(--border)] rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Links */}
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--dim)] border border-[var(--border)] rounded-full px-4 py-1.5 hover:text-[var(--text)] hover:border-[var(--text)] transition-all"
            >
              <Github size={13} /> Code
            </motion.a>
          )}
          {project.link && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--dim)] border border-[var(--border)] rounded-full px-4 py-1.5 hover:text-[var(--text)] hover:border-[var(--text)] transition-all"
            >
              <ExternalLink size={13} /> Live
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
