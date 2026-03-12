'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, ExternalLink, ChevronRight, ChevronDown } from 'lucide-react'
import {
  meta,
  hero,
  featuredProjects,
  notableProjects,
  otherProjects,
  experience,
  asset,
} from '@/lib/data'

/* Fade-in */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Social pill */
function Pill({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center px-3 py-1 text-[11px] text-[var(--dim)] border border-[var(--border)] rounded-full hover:text-[var(--text)] hover:border-[var(--text)] transition-all duration-200"
    >
      {label}
    </motion.a>
  )
}

/* Collapsible section - uses details/summary for native smooth behavior */
function Collapsible({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const toggle = () => {
    if (!open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
    setOpen(!open)
  }

  return (
    <div>
      <button
        onClick={toggle}
        className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-200 flex items-center gap-1.5"
      >
        {label} ({count})
        <ChevronDown
          size={12}
          className="transition-transform duration-300 ease-out"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-[500ms] ease-[cubic-bezier(0.33,1,0.68,1)]"
        style={{
          maxHeight: open ? `${height}px` : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  )
}

const shortDescriptions: Record<string, string> = {
  flexa: 'Rebuilding the economics of robotics training data. iPhone + Apple Watch capture for $950, replacing $8,700+ motion capture rigs.',
  garb: 'Real-time gaze tracking that adapts the browser reading environment \u2014 dynamic line highlighting, distraction removal, and comprehension nudges.',
  quadsense: 'Voice-controlled autonomy platform for Boston Dynamics Spot, built on NVIDIA Jetson AGX Orin with real-time speech, vision, and navigation.',
}

const categories: Record<string, string> = {
  flexa: 'Robotics Data',
  garb: 'Accessibility',
  quadsense: 'Autonomous Systems',
}

export default function Portfolio() {
  return (
    <div className="max-w-2xl mx-auto px-6 min-h-screen flex flex-col">

      {/* Header */}
      <header className="pt-8 pb-0">
        <Reveal>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--surface)]">
              <img
                src={asset('/headshot.jpg')}
                alt="Christian Nyamekye"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-sm font-medium tracking-tight">Christian Nyamekye</h1>
              <span className="text-[11px] text-[var(--muted)] italic"> &mdash; {hero.eyebrow}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-sm text-[var(--dim)] mt-3 mb-3">
            hardware, software, and the messy parts in between.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <Pill href={meta.social.github} label="GitHub" />
            <Pill href={meta.social.linkedin} label="LinkedIn" />
            <Pill href={`mailto:${meta.email}`} label="Email" />
            <Pill href="https://docs.google.com/document/d/1baFxz880bwpHy8L0S91R3N1W0Ou0C3GJbxlDbjYw9Yo/edit?tab=t.0" label="Resume" />
            <Pill href={meta.social.twitter} label="X" />
          </div>
        </Reveal>
      </header>

      {/* Featured projects */}
      <div className="space-y-3 mt-6">
        {featuredProjects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.08}>
            <motion.a
              href={`/projects/${project.id}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              className="block bg-[var(--surface)] rounded-2xl p-5 md:p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5"
            >
              <div className="flex justify-end mb-2">
                <span className="text-[11px] text-[var(--muted)] border border-[var(--border)] rounded-full px-3 py-0.5">
                  {categories[project.id] || project.status}
                </span>
              </div>
              <h2 className="text-base font-semibold tracking-tight mb-1.5">{project.name}</h2>
              <p className="text-sm text-[var(--dim)] leading-relaxed mb-2">
                {shortDescriptions[project.id] || project.description}
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-[var(--accent)] group/link">
                <ChevronRight size={13} className="transition-transform duration-200 group-hover/link:translate-x-0.5" />
                Learn more
              </span>
            </motion.a>
          </Reveal>
        ))}
      </div>

      {/* Collapsible sections */}
      <div className="mt-6 space-y-3">
        <Collapsible label="Notable Projects" count={notableProjects.length}>
          <div className="mt-3 space-y-4 pb-2">
            {notableProjects.map((p) => (
              <div key={p.name} className="flex items-start justify-between gap-3 py-2 border-b border-[var(--border)] last:border-0">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-[var(--text)] mb-0.5">{p.name}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{p.description}</p>
                </div>
                <div className="flex gap-2 shrink-0 pt-1">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                      <Github size={13} />
                    </a>
                  )}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Collapsible>

        <Collapsible label="Experience" count={experience.length}>
          <div className="mt-3 space-y-4 pb-2">
            {experience.map((exp) => (
              <div key={`${exp.org}-${exp.role}`} className="py-2 border-b border-[var(--border)] last:border-0">
                <div className="flex items-baseline justify-between gap-3 mb-0.5">
                  <span className="text-sm font-medium text-[var(--text)]">
                    {exp.link ? (
                      <a href={exp.link} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">{exp.org}</a>
                    ) : exp.org}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--muted)] shrink-0">{exp.period}</span>
                </div>
                <p className="text-xs text-[var(--dim)]">{exp.role}</p>
              </div>
            ))}
          </div>
        </Collapsible>

        <Collapsible label="Archive" count={otherProjects.length}>
          <div className="mt-3 space-y-3 pb-2">
            {otherProjects.map((p) => (
              <div key={p.name} className="flex items-baseline justify-between gap-3 py-1">
                <span className="text-xs text-[var(--text)]">{p.name}</span>
                <div className="flex gap-2 shrink-0">
                  {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors"><Github size={11} /></a>}
                  {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors"><ExternalLink size={11} /></a>}
                </div>
              </div>
            ))}
          </div>
        </Collapsible>
      </div>

      {/* Footer - pushed to bottom */}
      <footer className="mt-auto pt-8 pb-6 text-xs text-[var(--muted)] flex items-center justify-between">
        <p>Dartmouth &apos;26 &middot; EE &amp; CS</p>
        <a href={`mailto:${meta.email}`} className="hover:text-[var(--text)] transition-colors">{meta.email}</a>
      </footer>
    </div>
  )
}
