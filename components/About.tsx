'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { about, meta } from '@/lib/data'

const ease = [0.22, 1, 0.36, 1] as const

const stats = [
  { label: 'Projects shipped', value: '17+' },
  { label: 'Years building',   value: '4+' },
  { label: 'Stack depth',      value: 'EE → ML' },
  { label: 'Based in',         value: 'Hanover, NH' },
]

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay },
  },
})

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="max-w-[1400px] mx-auto section-padding">

        {/* Section label */}
        <motion.div
          ref={ref}
          variants={fadeUp(0)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="mb-16"
        >
          <span className="text-xs font-mono text-accent tracking-[0.18em] uppercase">
            01 / About
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 xl:gap-28 items-start">

          {/* ── Left — biography ───────────────────────────── */}
          <div>
            <motion.h2
              variants={fadeUp(0.08)}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              className="text-display font-semibold text-text mb-10"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
            >
              Hardware + software +{' '}
              <em className="text-display-italic" style={{ color: 'var(--text-dim)' }}>
                AI in one person.
              </em>
            </motion.h2>

            <div className="space-y-5 mb-10">
              {about.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  variants={fadeUp(0.12 + i * 0.07)}
                  initial="hidden"
                  animate={inView ? 'show' : 'hidden'}
                  className="text-muted text-base md:text-lg leading-relaxed"
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Tags */}
            <motion.div
              variants={fadeUp(0.3)}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              className="flex flex-wrap gap-2"
            >
              {about.tags.map((tag) => (
                <span key={tag} className="tag-base">
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right — headshot + stats ─────────────────── */}
          <motion.div
            variants={fadeUp(0.18)}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            className="flex flex-col gap-6"
          >
            {/* Headshot */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-surface border border-border">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/headshot.jpg`}
                alt="Christian Nyamekye"
                className="w-full h-full object-cover"
              />
              {/* Subtle gradient at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface/80 to-transparent" />
              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-sm font-medium text-text">Christian Nyamekye</p>
                <p className="text-xs text-muted font-mono">EE + CS, Dartmouth '26</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-surface border border-border rounded-xl p-4"
                >
                  <div className="text-xl font-semibold text-text tracking-tight mb-0.5">
                    {value}
                  </div>
                  <div className="text-xs text-muted font-mono">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
