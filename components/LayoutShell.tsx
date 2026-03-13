'use client'

import { useEffect, useState } from 'react'
import SmoothScroll from '@/components/SmoothScroll'
import FooterReveal from '@/components/FooterReveal'
import FooterGradient from '@/components/FooterGradient'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [showFooter, setShowFooter] = useState(false)

  useEffect(() => {
    // Show footer once portfolio has loaded (or on project pages)
    function check() {
      const loaded = sessionStorage.getItem('portfolio-loaded')
      setShowFooter(!!loaded)
    }
    check()

    // Listen for storage changes (when landing page sets the flag)
    const onStorage = () => check()
    window.addEventListener('storage', onStorage)

    // Also poll briefly for same-tab sessionStorage changes
    const interval = setInterval(check, 300)
    const timeout = setTimeout(() => clearInterval(interval), 10000)

    return () => {
      window.removeEventListener('storage', onStorage)
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      {showFooter && <SmoothScroll />}
      {showFooter && <FooterReveal />}

      <main className={showFooter ? 'site-surface' : ''}>
        {children}
      </main>

      {showFooter && <FooterGradient />}
    </>
  )
}
