'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { experience } from '@/lib/data'
import type { ExperienceItem } from '@/lib/data'

function Role({ item, index }: { item: ExperienceItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const Wrapper = item.link ? 'a' : 'div'
  const wrapperProps = item.link
    ? { href: item.link, target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <Wrapper
        {...wrapperProps}
        className="group block p-6 -mx-6 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4">
          {/* Period */}
          <span className="mono-xs text-[var(--text-tertiary)] pt-1 shrink-0">
            {item.period}
          </span>

          <div>
            {/* Title */}
            <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1">
              {item.role}
              <span className="text-[var(--accent)]"> · </span>
              <span className="text-[var(--text-secondary)]">{item.org}</span>
              {item.link && (
                <svg className="inline-block ml-1 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              )}
            </h3>

            {/* Description */}
            <p className="body-sm mt-2 max-w-2xl">{item.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {item.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </motion.div>
  )
}

export default function Experience() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="experience" className="section-gap">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="mono-xs text-[var(--accent)]">02. Experience</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="heading-lg mb-12"
        >
          Where I&apos;ve worked
        </motion.h2>

        <div className="space-y-2">
          {experience.map((item, i) => (
            <Role key={item.org} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
