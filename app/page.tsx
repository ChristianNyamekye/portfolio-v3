'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LandingPage from '@/components/LandingPage'
import Portfolio from '@/components/Portfolio'
import AIAssistant from '@/components/AIAssistant'
import SmoothScroll from '@/components/SmoothScroll'

type Phase = 'landing' | 'portfolio'

export default function Home() {
  const [phase, setPhase] = useState<Phase | null>(null)

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('portfolio-loaded')
    setPhase(hasLoaded ? 'portfolio' : 'landing')
  }, [])

  const handleEnterPortfolio = () => {
    sessionStorage.setItem('portfolio-loaded', '1')
    setPhase('portfolio')
  }

  if (!phase) return null

  return (
    <AnimatePresence mode="wait">
      {phase === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage onEnter={handleEnterPortfolio} />
        </motion.div>
      )}

      {phase === 'portfolio' && (
        <motion.main
          key="portfolio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-screen bg-[var(--background)]"
        >
          <SmoothScroll />
          <Portfolio />
          <AIAssistant />
        </motion.main>
      )}
    </AnimatePresence>
  )
}
