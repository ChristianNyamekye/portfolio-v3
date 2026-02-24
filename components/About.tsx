'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { about } from '@/lib/data'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="about" className="section-gap">
      <div className="container-main">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="mono-xs text-[var(--accent)]">01. About</span>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 items-start">
          {/* Text */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="heading-lg mb-8"
            >
              A bit about me
            </motion.h2>

            <div className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="body-lg"
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-2 mt-8"
            >
              {about.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </motion.div>
          </div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[var(--bg-surface)]">
              <img
                src={`${BASE}/headshot.jpg`}
                alt="Christian Nyamekye"
                className="w-full h-full object-cover"
              />
              {/* Accent border */}
              <div className="absolute inset-0 rounded-2xl border border-[var(--accent)]/10" />
            </div>
            {/* Decorative offset */}
            <div className="absolute -inset-3 rounded-2xl border border-[var(--border)] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
