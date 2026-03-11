'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Github, Linkedin, Twitter, ArrowUpRight } from 'lucide-react'
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
      <div className="max-w-[1400px] mx-auto section-padding">
        <div ref={ref}>

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="mb-8"
          >
            <span className="text-xs font-mono text-accent tracking-[0.18em] uppercase">
              04 / Contact
            </span>
          </motion.div>

          {/* Heading — large, editorial */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.08 }}
            className="text-display font-semibold text-text mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 1.0 }}
          >
            Let's talk.
          </motion.h2>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.16 }}
            className="text-muted text-lg md:text-xl leading-relaxed max-w-xl mb-12"
          >
            Robotics, hard engineering problems, or building something from zero — my inbox is open.
          </motion.p>

          {/* Email CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.24 }}
            className="mb-16"
          >
            <a
              href={`mailto:${meta.email}`}
              className="group inline-flex items-center gap-3 text-text hover:text-accent transition-colors duration-200"
            >
              <span
                className="text-display font-medium"
                style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}
              >
                {meta.email}
              </span>
              <ArrowUpRight
                size={22}
                className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
              />
            </a>
          </motion.div>

          {/* Rule */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.32 }}
            className="origin-left rule-gradient mb-12 max-w-md"
          />

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            {socials.map(({ icon: Icon, href, label, handle }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border text-muted text-sm hover:border-border-bright hover:text-text hover:bg-surface transition-all duration-200"
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
