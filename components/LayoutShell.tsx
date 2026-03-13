'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import SmoothScroll from '@/components/SmoothScroll'
import FooterReveal from '@/components/FooterReveal'
import FooterGradient from '@/components/FooterGradient'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showFooter, setShowFooter] = useState(false)

  useEffect(() => {
    // Show footer on project pages immediately (deep links),
    // or on homepage once landing phase is complete
    if (pathname.startsWith('/projects')) {
      sessionStorage.setItem('portfolio-loaded', '1')
      setShowFooter(true)
      return
    }

    function check() {
      setShowFooter(!!sessionStorage.getItem('portfolio-loaded'))
    }
    check()
    const interval = setInterval(check, 200)
    return () => clearInterval(interval)
  }, [pathname])

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
