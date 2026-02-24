'use client'

import { useState } from 'react'
import Loader from '@/components/Loader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import OtherProjects from '@/components/OtherProjects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import AIAssistant from '@/components/AIAssistant'
// 3D art removed to prevent flashes
import CursorGlow from '@/components/CursorGlow'
import SmoothScroll from '@/components/SmoothScroll'

export default function Home() {
  const [loading, setLoading] = useState(true)

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      {!loading && (
        <main className="relative min-h-screen bg-background">
          <SmoothScroll />
          <CursorGlow />
          <Navbar />
          <Hero />
          <About />
          <div className="gradient-line mx-auto max-w-[1440px] section-padding" />
          <Experience />
          <div className="gradient-line mx-auto max-w-[1440px] section-padding" />
          <Projects />
          <OtherProjects />
          <Contact />
          <Footer />
          <AIAssistant />
        </main>
      )}
    </>
  )
}

