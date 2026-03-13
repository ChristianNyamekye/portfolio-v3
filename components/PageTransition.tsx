'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  // Clean up footer gradient when navigating to project pages
  useEffect(() => {
    const html = document.documentElement
    delete html.dataset.footerGradient
    delete html.dataset.footerGradientReady
    delete html.dataset.footerTone
    html.style.removeProperty('--footer-g1')
    html.style.removeProperty('--footer-g2')
    html.style.removeProperty('--footer-g3')
    html.style.removeProperty('--footer-fg')
    html.style.removeProperty('--footer-link-bg')
    html.style.removeProperty('--footer-link-hover-bg')
    html.style.removeProperty('--footer-link-hover-fg')
    html.style.removeProperty('--page-reveal')
    html.style.removeProperty('--page-scale-amount')
    html.style.background = ''
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[var(--background)]"
    >
      {children}
    </motion.div>
  )
}
