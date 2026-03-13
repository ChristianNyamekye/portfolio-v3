'use client'

import { useEffect, useState } from 'react'
import SmoothScroll from '@/components/SmoothScroll'
import FooterReveal from '@/components/FooterReveal'
import FooterGradient from '@/components/FooterGradient'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [showFooter, setShowFooter] = useState(false)

  useEffect(() => {
    // Show footer once portfolio has loaded (set by landing page or on direct visit)
    function check() {
      setShowFooter(!!sessionStorage.getItem('portfolio-loaded'))
    }
    check()
    // Poll for same-tab sessionStorage changes (landing → portfolio transition)
    const interval = setInterval(check, 200)
    return () => clearInterval(interval)
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
