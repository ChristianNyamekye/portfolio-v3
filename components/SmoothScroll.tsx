'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      prevent: (node: HTMLElement) => {
        // Don't hijack scroll inside AI assistant or any element with overflow-y auto/scroll
        let el: HTMLElement | null = node
        while (el) {
          if (el.hasAttribute('data-lenis-prevent')) return true
          const oy = getComputedStyle(el).overflowY
          if (oy === 'auto' || oy === 'scroll') {
            if (el.scrollHeight > el.clientHeight) return true
          }
          el = el.parentElement
        }
        return false
      },
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Support anchor links
    document.querySelectorAll('a[href^="#"]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        const href = el.getAttribute('href')
        if (href) {
          const target = document.querySelector(href)
          if (target) lenis.scrollTo(target as HTMLElement)
        }
      })
    })

    return () => lenis.destroy()
  }, [])

  return null
}

