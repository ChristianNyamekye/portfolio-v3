'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { about } from '@/lib/data'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Section background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background pointer-events-none" />

      <div className="relative max-w-7xl mx-auto section-padding">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          {/* Left — text */}
          <div>
            <motion.div variants={fadeUp} className="mb-3">
              <span className="text-xs font-mono text-accent tracking-widest uppercase">
                001 / About
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-semibold tracking-tight text-text mb-8"
            >
              Hardware + software +<br />
              <span className="text-gradient-accent">AI in one person.</span>
            </motion.h2>

            <div className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  variants={fadeUp}
                  className="text-muted text-base md:text-lg leading-relaxed"
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Tags */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-8">
              {about.tags.map((tag) => (
                <span key={tag} className="tag-base">
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — visual card */}
          <motion.div variants={fadeUp} className="relative">
            {/* Headshot placeholder card */}
            <div className="relative rounded-3xl overflow-hidden bg-surface border border-border aspect-[4/5] max-w-sm mx-auto lg:mx-0">
              {/* Gradient mesh bg inside card */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-2 to-background" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />
              </div>

              {/* Placeholder content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
                {/* Avatar placeholder */}
                <div className="w-32 h-32 rounded-full bg-surface-2 border-2 border-border flex items-center justify-center mb-6">
                  <svg
                    className="w-16 h-16 text-subtle"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-text mb-1">Christian Nyamekye</h3>
                <p className="text-sm text-muted mb-6">EE + CS, Dartmouth '26</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  {[
                    { label: 'Projects', value: '17+' },
                    { label: 'Years building', value: '4+' },
                    { label: 'Stack depth', value: 'EE → ML' },
                    { label: 'Based in', value: 'Hanover, NH' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-background/60 rounded-xl p-3 border border-border/60"
                    >
                      <div className="text-lg font-semibold text-text">{value}</div>
                      <div className="text-xs text-subtle mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent" />
            </div>

            {/* Floating accent card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -right-6 bg-surface-2 border border-border rounded-2xl p-4 shadow-xl hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <span className="text-accent text-sm">🤖</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-text">EgoDex</div>
                  <div className="text-xs text-muted">Robotics data platform</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
