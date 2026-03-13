'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Instagram, ArrowRight, ArrowDown } from 'lucide-react'
import { hero, meta } from '@/lib/data'

const socials = [
  { icon: Github,    href: meta.social.github,    label: 'GitHub' },
  { icon: Linkedin,  href: meta.social.linkedin,   label: 'LinkedIn' },
  { icon: Twitter,   href: meta.social.twitter,    label: 'X / Twitter' },
  { icon: Instagram, href: meta.social.instagram,  label: 'Instagram' },
]

const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Ambient gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
      />

      {/* Bottom vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent z-10"
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding w-full pt-36 pb-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
          className="max-w-5xl"
        >

          {/* Eyebrow */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } } }}
            className="flex items-center gap-2.5 mb-10"
          >
            <div className="status-dot-active" />
            <a
              href={hero.eyebrowLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-muted tracking-[0.18em] uppercase hover:text-accent transition-colors duration-200"
            >
              {hero.eyebrow}
            </a>
          </motion.div>

          {/* Name — Space Grotesk display + Sentient italic accent */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
            className="text-display font-semibold mb-6"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', lineHeight: 1.0, letterSpacing: '-0.04em' }}
          >
            <span className="block text-text">Christian</span>
            <span className="block text-display-italic" style={{ color: 'var(--muted)' }}>
              Nyamekye.
            </span>
          </motion.h1>

          {/* Subline with highlighted keywords */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="text-xl md:text-2xl font-light text-muted mb-5 max-w-2xl leading-relaxed"
            style={{ letterSpacing: '-0.01em' }}
          >
            From <span className="text-text font-normal">embedded systems</span> and{' '}
            <span className="text-text font-normal">robotics</span> to full-stack platforms and{' '}
            <span className="text-text font-normal">applied ML</span> — I build technology that
            bridges hardware and software to solve real problems.
          </motion.p>

          {/* Animated rule */}
          <motion.div
            variants={{ hidden: { opacity: 0, scaleX: 0 }, show: { opacity: 1, scaleX: 1, transition: { duration: 0.8, ease } } }}
            className="origin-left h-px bg-gradient-to-r from-accent/60 via-accent/20 to-transparent mb-10 max-w-sm"
          />

          {/* CTAs */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
            className="flex flex-wrap items-center gap-3 mb-14"
          >
            <a
              href={hero.cta.href}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/25"
              style={{ background: 'var(--accent)' }}
            >
              {hero.cta.label}
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>

            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-dim text-sm font-medium transition-all duration-200 hover:border-accent/40 hover:text-text"
            >
              {hero.ctaSecondary.label}
            </a>
          </motion.div>

          {/* Social row */}
          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, ease } } }}
            className="flex items-center gap-1"
          >
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-lg text-muted hover:text-accent hover:bg-accent/5 transition-all duration-200 cursor-pointer"
              >
                <Icon size={17} />
              </a>
            ))}

            <div className="mx-4 h-px w-12 bg-border" />
            <span className="text-xs font-mono text-muted select-all">{meta.email}</span>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} className="text-muted/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
