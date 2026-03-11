'use client'

import { useState, useEffect } from 'react'
import Loader from '@/components/Loader'
import Portfolio from '@/components/Portfolio'
import AIAssistant from '@/components/AIAssistant'
import SmoothScroll from '@/components/SmoothScroll'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Only show loader on first visit per session
    const hasLoaded = sessionStorage.getItem('portfolio-loaded')
    if (hasLoaded) {
      setReady(true)
    } else {
      setLoading(true)
    }
  }, [])

  const handleLoaderComplete = () => {
    sessionStorage.setItem('portfolio-loaded', '1')
    setLoading(false)
    setReady(true)
  }

  return (
    <>
      {loading && <Loader onComplete={handleLoaderComplete} />}
      {ready && (
        <main className="relative min-h-screen bg-[var(--background)]">
          <SmoothScroll />
          <Portfolio />
          <AIAssistant />
        </main>
      )}
    </>
  )
}
