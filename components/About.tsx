'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { about } from '@/lib/data'
import WireframeShape from './WireframeShape'

function CountUp({ target, suffix = '', duration = 1500 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

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

      <div className="relative max-w-[1440px] mx-auto section-padding">
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

              {/* Wireframe background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                <WireframeShape size={480} />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
                {/* Headshot */}
                <div className="w-32 h-32 rounded-full bg-surface-2 border-2 border-border overflow-hidden mb-6">
                  <img
                    src="/headshot.jpg"
                    alt="Christian Nyamekye"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-lg font-semibold text-text mb-1">Christian Nyamekye</h3>
                <p className="text-sm text-muted mb-6">EE + CS, Dartmouth '26</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  {[
                    { label: 'Projects', numeric: 17, suffix: '+' },
                    { label: 'Years building', numeric: 4, suffix: '+' },
                    { label: 'Stack depth', value: 'EE → ML' },
                    { label: 'Based in', value: 'Hanover, NH' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-background/60 rounded-xl p-3 border border-border/60"
                    >
                      <div className="text-lg font-semibold text-text">
                        {'numeric' in stat ? (
                          <CountUp target={stat.numeric!} suffix={stat.suffix} />
                        ) : (
                          stat.value
                        )}
                      </div>
                      <div className="text-xs text-subtle mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent" />
            </div>

            {/* Floating accent card — currently building */}
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

