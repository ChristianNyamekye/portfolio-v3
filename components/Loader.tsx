'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'animate' | 'exit'>('animate')

  useEffect(() => {
    const timer = setTimeout(() => setPhase('exit'), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (phase === 'exit') {
      const timer = setTimeout(onComplete, 600)
      return () => clearTimeout(timer)
    }
  }, [phase, onComplete])

  return (
    <AnimatePresence>
      {phase !== 'exit' ? null : null}
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        animate={phase === 'exit' ? { opacity: 0, scale: 0.95 } : { opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      >
        <div className="relative flex items-center gap-1">
          {/* < bracket */}
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-accent font-mono text-4xl md:text-5xl font-light"
          >
            {'<'}
          </motion.span>

          {/* CN */}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-text font-semibold text-4xl md:text-5xl tracking-tight"
          >
            CN
          </motion.span>

          {/* /> bracket */}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-accent font-mono text-4xl md:text-5xl font-light"
          >
            {'/>'}
          </motion.span>

          {/* Underline sweep */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent origin-left"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

