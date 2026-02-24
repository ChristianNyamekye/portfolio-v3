'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { experience } from '@/lib/data'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="experience" className="relative py-40">
      <div className="max-w-[1440px] mx-auto section-padding">
        {/* Header */}
        <div ref={ref} className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-3"
          >
            <span className="text-xs font-mono text-accent tracking-widest uppercase">
              002 / Experience
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-text"
          >
            Where I've worked
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0">
            <div className="timeline-line" />
          </div>

          <div className="space-y-0">
            {experience.map((item, i) => (
              <motion.div
                key={`${item.org}-${i}`}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
                className="relative md:pl-10 group"
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent/60 ring-4 ring-background -translate-x-[3px] group-hover:bg-accent transition-colors duration-200" />

                {/* Card */}
                <div className="
                  border-b border-border/50 py-8
                  group-hover:border-border-bright transition-colors duration-300
                ">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-text text-lg leading-tight">
                        {item.role.includes('Coulter Scholar') ? (
                          <>
                            {item.role.split('Coulter Scholar')[0]}
                            <a href="https://students.dartmouth.edu/surfd/scholar-programs/coulter-scholars" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-blue-400 transition-colors">Coulter Scholar</a>
                            {item.role.split('Coulter Scholar')[1]}
                          </>
                        ) : item.role}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-blue-400 transition-colors text-sm font-medium inline-flex items-center gap-1"
                          >
                            {item.org}
                            <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="text-accent text-sm font-medium">{item.org}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-subtle whitespace-nowrap pt-1">
                      {item.period}
                    </span>
                  </div>

                  <p className="text-muted text-sm leading-relaxed mb-4">{item.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag-base">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

