'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch devices
    if (typeof window === 'undefined' || 'ontouchstart' in window) return

    const dot = dotRef.current
    const circle = circleRef.current
    if (!dot || !circle) return

    let mouseX = 0, mouseY = 0
    let circleX = 0, circleY = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
    }

    const lerp = () => {
      circleX += (mouseX - circleX) * 0.15
      circleY += (mouseY - circleY) * 0.15
      circle.style.transform = `translate(${circleX - 20}px, ${circleY - 20}px)`
      requestAnimationFrame(lerp)
    }

    // Scale up on interactive elements
    const onEnterInteractive = () => {
      circle.style.width = '60px'
      circle.style.height = '60px'
      circle.style.marginLeft = '-10px'
      circle.style.marginTop = '-10px'
      circle.style.borderColor = 'rgba(59,130,246,0.5)'
    }
    const onLeaveInteractive = () => {
      circle.style.width = '40px'
      circle.style.height = '40px'
      circle.style.marginLeft = '0px'
      circle.style.marginTop = '0px'
      circle.style.borderColor = 'rgba(255,255,255,0.3)'
    }

    document.addEventListener('mousemove', onMove)
    requestAnimationFrame(lerp)

    // Observe interactive elements
    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnterInteractive)
      el.addEventListener('mouseleave', onLeaveInteractive)
    })

    // Re-observe on DOM changes
    const observer = new MutationObserver(() => {
      const els = document.querySelectorAll('a, button, [role="button"], input, textarea')
      els.forEach(el => {
        el.addEventListener('mouseenter', onEnterInteractive)
        el.addEventListener('mouseleave', onLeaveInteractive)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // Hide default cursor
    document.documentElement.style.cursor = 'none'
    document.body.style.cursor = 'none'
    const style = document.createElement('style')
    style.textContent = 'a, button, input, textarea, [role="button"] { cursor: none !important; }'
    document.head.appendChild(style)

    return () => {
      document.removeEventListener('mousemove', onMove)
      observer.disconnect()
      document.documentElement.style.cursor = ''
      document.body.style.cursor = ''
      style.remove()
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
        style={{
          width: 8, height: 8,
          borderRadius: '50%',
          backgroundColor: 'white',
          transition: 'width 0.2s, height 0.2s',
        }}
      />
      {/* Trailing circle */}
      <div
        ref={circleRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none hidden md:block"
        style={{
          width: 40, height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.3)',
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, margin 0.3s ease',
        }}
      />
    </>
  )
}
