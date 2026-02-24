'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { meta } from '@/lib/data'

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="contact" className="section-gap">
      <div className="container-main max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="mono-xs text-[var(--accent)]">04. Contact</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="heading-lg mb-6"
        >
          Let&apos;s build something
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="body-lg mb-10"
        >
          I&apos;m always open to interesting conversations, collaborations, or opportunities.
          If something here resonated, reach out.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          href={`mailto:${meta.email}`}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[var(--accent)] text-[var(--accent)] font-medium hover:bg-[var(--accent-glow)] transition-all"
        >
          Say hello
        </motion.a>
      </div>
    </section>
  )
}
