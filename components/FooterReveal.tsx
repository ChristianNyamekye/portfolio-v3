'use client'

import { useEffect } from 'react'

/**
 * FooterReveal — scroll-driven reveal animation (matching vladsavruk.com)
 * Sets --page-reveal (0→1) on <html> as user scrolls past main content.
 * The main content (.site-surface) uses this to scale down + round corners,
 * revealing the gradient footer behind it.
 */
export default function FooterReveal() {
  useEffect(() => {
    const html = document.documentElement
    let rafPending = 0
    let animRaf = 0
    let target = 0
    let current = 0
    let lastTime = 0

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches

    function clamp01(v: number) {
      return Math.min(1, Math.max(0, v))
    }

    function getNumericVar(name: string, fallback: number) {
      const val = parseFloat(getComputedStyle(html).getPropertyValue(name).trim())
      return Number.isFinite(val) ? val : fallback
    }

    function measure() {
      rafPending = 0

      const revealDistance = getNumericVar('--reveal-distance', 520)
      const revealOffset = getNumericVar('--reveal-offset', 0)

      // Recalculate --page-scale-amount based on surface height
      const surface = document.querySelector('.site-surface') as HTMLElement
      if (surface) {
        const h = surface.offsetHeight
        if (h > 0) {
          const baseScale = getNumericVar('--page-scale-amount-base', 0.05)
          const maxShrinkPx = getNumericVar('--max-shrink-px', 180)
          const scale = clamp01(Math.min(baseScale, maxShrinkPx / Math.max(1, h)))
          html.style.setProperty('--page-scale-amount', scale.toFixed(5))
        }
      }

      // Calculate reveal progress based on footer position
      const footer = document.getElementById('site-footer')
      if (footer) {
        const rect = footer.getBoundingClientRect()
        const t = clamp01((window.innerHeight - rect.top + revealOffset) / Math.max(1, revealDistance))
        target = window.scrollY <= 0 ? 0 : t
      } else {
        const remaining = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
        const t = clamp01(1 - remaining / Math.max(1, revealDistance))
        target = window.scrollY <= 0 ? 0 : t
      }

      if (prefersReduced) {
        current = target
        html.style.setProperty('--page-reveal', String(current))
        window.dispatchEvent(new CustomEvent('page-reveal', { detail: current }))
        return
      }

      if (!animRaf) {
        lastTime = 0
        animRaf = requestAnimationFrame(animate)
      }
    }

    function animate(time: number) {
      if (!lastTime) lastTime = time
      const dt = Math.min(64, time - lastTime)
      lastTime = time

      const factor = 1 - Math.exp(-dt / 80)
      current += (target - current) * factor

      if (Math.abs(target - current) < 0.001) {
        current = target
      }

      html.style.setProperty('--page-reveal', String(current))
      window.dispatchEvent(new CustomEvent('page-reveal', { detail: current }))

      if (current === target) {
        animRaf = 0
        return
      }
      animRaf = requestAnimationFrame(animate)
    }

    function onScroll() {
      if (!rafPending) {
        rafPending = requestAnimationFrame(measure)
      }
    }

    // Initial measurement
    measure()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (rafPending) cancelAnimationFrame(rafPending)
      if (animRaf) cancelAnimationFrame(animRaf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return null
}
