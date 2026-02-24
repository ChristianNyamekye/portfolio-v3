'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Twitter, Instagram } from 'lucide-react'
import { hero, meta } from '@/lib/data'

const socials = [
  { icon: Github, href: meta.social.github, label: 'GitHub' },
  { icon: Linkedin, href: meta.social.linkedin, label: 'LinkedIn' },
  { icon: Twitter, href: meta.social.twitter, label: 'X / Twitter' },
  { icon: Instagram, href: meta.social.instagram, label: 'Instagram' },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const headlineLines = hero.headline.split('\n')

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg"
    >
      {/* Animated orbs */}
      <div className="mesh-bg">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
      </div>

      {/* Vignette bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto section-padding w-full pt-28 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <div className="status-dot-active" />
            <span className="text-sm font-mono text-muted tracking-widest uppercase">
              {hero.eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.05] mb-6"
          >
            {headlineLines.map((line, i) => (
              <span key={i} className="block">
                {i === 0 ? (
                  <span className="text-text">{line}</span>
                ) : (
                  <span className="text-gradient-accent">{line}</span>
                )}
              </span>
            ))}
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-10"
          >
            {hero.subline}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-16">
            <a
              href={hero.cta.href}
              className="
                group inline-flex items-center gap-2 px-6 py-3 rounded-xl
                bg-accent text-white font-medium text-sm
                hover:bg-accent-dim transition-all duration-200
                shadow-lg shadow-accent/20
              "
            >
              {hero.cta.label}
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-xl
                border border-border text-text-dim font-medium text-sm
                hover:border-border-bright hover:text-text transition-all duration-200
              "
            >
              {hero.ctaSecondary.label}
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="
                  p-2.5 rounded-lg text-subtle hover:text-text
                  hover:bg-surface-2 border border-transparent hover:border-border
                  transition-all duration-200
                "
              >
                <Icon size={18} />
              </a>
            ))}
            <div className="ml-4 h-px w-16 bg-border" />
            <span className="text-xs text-subtle font-mono">{meta.email}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} className="text-subtle" />
        </motion.div>
      </motion.div>
    </section>
  )
}
