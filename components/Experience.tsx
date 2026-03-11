'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { experience } from '@/lib/data'

const ease = [0.22, 1, 0.36, 1] as const

export default function Experience() {
  const headerRef = useRef<HTMLDivElement>(null)
  const listRef   = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const listInView   = useInView(listRef,   { once: true, margin: '-60px' })

  return (
    <section id="experience" className="relative py-28 md:py-36">
      <div className="max-w-[1400px] mx-auto section-padding">

        {/* Label */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="mb-4"
        >
          <span className="text-xs font-mono text-accent tracking-[0.18em] uppercase">
            02 / Experience
          </span>
        </motion.div>

        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.08 }}
          className="text-display font-semibold text-text mb-16"
          style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}
        >
          Where I've worked
        </motion.h2>

        {/* Experience list */}
        <div ref={listRef} className="max-w-3xl space-y-0 divide-y divide-border">
          {experience.map((item, i) => (
            <motion.div
              key={`${item.org}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={listInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className="group py-8 first:pt-0 last:pb-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                <div>
                  {/* Org — linked if available */}
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:text-blue-400 font-semibold text-base transition-colors duration-200"
                    >
                      {item.org}
                      <ArrowUpRight size={13} className="opacity-60" />
                    </a>
                  ) : (
                    <span className="font-semibold text-accent text-base">{item.org}</span>
                  )}

                  {/* Role */}
                  <p className="text-text text-sm mt-0.5">
                    {item.role.includes('Coulter Scholar') ? (
                      <>
                        {item.role.split('Coulter Scholar')[0]}
                        <a
                          href="https://students.dartmouth.edu/surfd/scholar-programs/coulter-scholars"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-dim hover:text-accent transition-colors"
                        >
                          Coulter Scholar
                        </a>
                        {item.role.split('Coulter Scholar')[1]}
                      </>
                    ) : (
                      item.role
                    )}
                  </p>
                </div>

                {/* Period */}
                <span className="text-xs font-mono text-subtle whitespace-nowrap pt-0.5 shrink-0">
                  {item.period}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag-base text-[11px]">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
