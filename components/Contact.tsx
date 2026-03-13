'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Github, Linkedin, Twitter, ArrowUpRight, Copy } from 'lucide-react'
import { meta } from '@/lib/data'

const ease = [0.22, 1, 0.36, 1] as const

const socials = [
  { icon: Github,   href: meta.social.github,   label: 'GitHub',   handle: '@ChristianNyamekye' },
  { icon: Linkedin, href: meta.social.linkedin,  label: 'LinkedIn', handle: 'christian-k-nyamekye' },
  { icon: Twitter,  href: meta.social.twitter,   label: 'X',        handle: '@printlnxristian' },
]

export default function Contact() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" className="relative py-28 md:py-40">
      {/* Ambient accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
      />

      <div className="max-w-[1400px] mx-auto section-padding">
        <div ref={ref}>

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-8"
          >
            <span className="text-xs font-mono text-accent tracking-[0.18em] uppercase">
              04 / Contact
            </span>
          </motion.div>

          {/* Heading — large, mixed typography */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.08 }}
            className="text-display font-semibold text-text mb-3"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 1.0 }}
          >
            Let's build
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.14 }}
            className="text-display-italic mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 1.0, color: 'var(--muted)' }}
          >
            something real.
          </motion.h2>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="text-muted text-lg md:text-xl leading-relaxed max-w-xl mb-12"
          >
            Robotics, hard engineering problems, or building something from zero — my inbox is open.
          </motion.p>

          {/* Email CTA — prominent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.28 }}
            className="mb-16"
          >
            <a
              href={`mailto:${meta.email}`}
              className="group inline-flex items-center gap-4 px-8 py-5 rounded-2xl border border-border hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 cursor-pointer"
              style={{ background: 'var(--surface)' }}
            >
              <Mail size={20} className="text-accent" />
              <span
                className="text-display font-medium text-text group-hover:text-accent transition-colors duration-200"
                style={{ fontSize: 'clamp(1rem, 2.5vw, 1.35rem)' }}
              >
                {meta.email}
              </span>
              <ArrowUpRight
                size={18}
                className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
              />
            </a>
          </motion.div>

          {/* Rule */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.36 }}
            className="origin-left h-px bg-gradient-to-r from-accent/40 via-border to-transparent mb-12 max-w-md"
          />

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.44 }}
            className="flex flex-wrap gap-3"
          >
            {socials.map(({ icon: Icon, href, label, handle }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border text-muted text-sm hover:border-accent/30 hover:text-text hover:bg-accent/5 transition-all duration-200 cursor-pointer"
              >
                <Icon size={14} className="group-hover:text-accent transition-colors duration-200" />
                <span className="font-mono text-xs">{handle}</span>
              </a>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
