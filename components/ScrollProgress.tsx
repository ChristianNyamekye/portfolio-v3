'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-50"
      aria-hidden
    >
      <div className="h-full w-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dim)]" />
    </motion.div>
  )
}
