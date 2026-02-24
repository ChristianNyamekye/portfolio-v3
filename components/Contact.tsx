'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Github, Linkedin, Twitter, Instagram, ArrowUpRight } from 'lucide-react'
import { meta } from '@/lib/data'

const socials = [
  { icon: Github, href: meta.social.github, label: 'GitHub', handle: '@ChristianNyamekye' },
  { icon: Linkedin, href: meta.social.linkedin, label: 'LinkedIn', handle: 'christian-k-nyamekye' },
  { icon: Twitter, href: meta.social.twitter, label: 'X / Twitter', handle: '@printlnxristian' },
  { icon: Instagram, href: meta.social.instagram, label: 'Instagram', handle: 'christiannyamekye.kjr' },
]

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* BG accent */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-[1440px] mx-auto section-padding">
        <div ref={ref} className="max-w-2xl mx-auto text-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="text-xs font-mono text-accent tracking-widest uppercase">
              004 / Contact
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-text mb-6"
          >
            Let's build something
            <br />
            <span className="text-gradient-accent">together.</span>
          </motion.h2>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-muted text-lg leading-relaxed mb-12"
          >
            Whether it's robotics, a hard engineering problem, or building something from zero — my inbox is open.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mb-16"
          >
            <a
              href={`mailto:${meta.email}`}
              className="
                group inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                bg-surface border border-border
                hover:border-accent/50 hover:bg-surface-2
                transition-all duration-300
                text-text font-medium
              "
            >
              <Mail size={18} className="text-accent" />
              {meta.email}
              <ArrowUpRight
                size={16}
                className="text-muted group-hover:text-text group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </a>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={inView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="gradient-line mb-12"
          />

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {socials.map(({ icon: Icon, href, label, handle }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                  border border-border text-muted text-sm
                  hover:border-border-bright hover:text-text hover:bg-surface-2
                  transition-all duration-200
                "
                aria-label={label}
              >
                <Icon size={15} className="group-hover:text-accent transition-colors duration-200" />
                <span className="font-mono text-xs">{handle}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

