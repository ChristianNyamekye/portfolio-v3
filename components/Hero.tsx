'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react'
import { hero, meta } from '@/lib/data'
import { HeroArt } from './ArtScene'

const socials = [
  { Icon: Github, href: meta.social.github, label: 'GitHub' },
  { Icon: Linkedin, href: meta.social.linkedin, label: 'LinkedIn' },
  { Icon: Twitter, href: meta.social.twitter, label: 'X' },
  { Icon: Instagram, href: meta.social.instagram, label: 'Instagram' },
]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const words = hero.headline.replace('\n', ' ').split(' ')

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D art — background */}
      <HeroArt />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative z-10 container-main w-full pt-32 pb-24">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="status-dot" />
          {hero.eyebrowLink ? (
            <a href={hero.eyebrowLink} target="_blank" rel="noopener noreferrer"
              className="mono-xs text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors">
              {hero.eyebrow}
            </a>
          ) : (
            <span className="mono-xs text-[var(--text-tertiary)]">{hero.eyebrow}</span>
          )}
        </motion.div>

        {/* Headline */}
        <h1 className="heading-xl max-w-5xl mb-8">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block mr-[0.3em] ${i >= words.length - 2 ? 'text-gradient' : ''}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="body-lg max-w-2xl mb-12"
        >
          {hero.subline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-wrap items-center gap-4 mb-16"
        >
          <a
            href={hero.cta.href}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--accent)] text-white font-medium text-sm hover:bg-[var(--accent-dim)] transition-all shadow-lg shadow-[var(--accent-glow)]"
          >
            {hero.cta.label}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href={hero.ctaSecondary.href}
            className="px-7 py-3.5 rounded-xl border border-[var(--border-bright)] text-[var(--text-secondary)] text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all"
          >
            {hero.ctaSecondary.label}
          </a>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex items-center gap-1"
        >
          {socials.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
            >
              <Icon size={18} />
            </a>
          ))}
          <div className="ml-4 h-px w-16 bg-[var(--border)]" />
          <span className="ml-3 mono-xs text-[var(--text-tertiary)]">{meta.email}</span>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-[var(--border-bright)] flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-[var(--text-tertiary)]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
