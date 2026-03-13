'use client'

import { useEffect, useState } from 'react'

/**
 * Location is set via env vars — update on Vercel when you move.
 * NEXT_PUBLIC_MY_TIMEZONE = "America/New_York"
 * NEXT_PUBLIC_MY_CITY = "New York"
 * If either is missing, the location line is hidden entirely.
 */
const MY_TIMEZONE = process.env.NEXT_PUBLIC_MY_TIMEZONE || ''
const MY_CITY = process.env.NEXT_PUBLIC_MY_CITY || ''

/* ── Gradient palette ── */
const COLOR_STOPS = [
  { hour: 0,  g1: '#0a0e27', g2: '#1a1145', g3: '#2d1b69' },
  { hour: 5,  g1: '#1a1145', g2: '#6b2fa0', g3: '#e85d75' },
  { hour: 8,  g1: '#e85d75', g2: '#f59e42', g3: '#ffe066' },
  { hour: 12, g1: '#1e6bff', g2: '#36c5f0', g3: '#56e8cd' },
  { hour: 16, g1: '#4338ca', g2: '#d946ef', g3: '#fb923c' },
  { hour: 19, g1: '#6d28d9', g2: '#be185d', g3: '#f43f5e' },
  { hour: 22, g1: '#1e1145', g2: '#0f172a', g3: '#0a0e27' },
]

function clamp01(v: number) { return Math.min(1, Math.max(0, v)) }

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function lerpColor(a: string, b: string, t: number) {
  const ca = hexToRgb(a), cb = hexToRgb(b), f = clamp01(t)
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  return `#${toHex(ca.r + (cb.r - ca.r) * f)}${toHex(ca.g + (cb.g - ca.g) * f)}${toHex(ca.b + (cb.b - ca.b) * f)}`
}

function sRGBLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const lin = (v: number) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function getTimeInZone(tz: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? '0')
  return { hour: get('hour'), minute: get('minute'), second: get('second') }
}

function interpolateGradient(frac: number) {
  const h = ((frac % 24) + 24) % 24
  let idx = 0
  for (let i = 0; i < COLOR_STOPS.length; i++) {
    if (COLOR_STOPS[i].hour <= h) idx = i
  }
  const a = COLOR_STOPS[idx], b = COLOR_STOPS[(idx + 1) % COLOR_STOPS.length]
  const startH = a.hour, endH = b.hour > startH ? b.hour : b.hour + 24
  const t = clamp01(((h < startH ? h + 24 : h) - startH) / Math.max(0.0001, endH - startH))
  return { g1: lerpColor(a.g1, b.g1, t), g2: lerpColor(a.g2, b.g2, t), g3: lerpColor(a.g3, b.g3, t) }
}

function FooterTimeGradient() {
  useEffect(() => {
    const html = document.documentElement
    const tz = MY_TIMEZONE || 'America/New_York'

    function update() {
      const { hour, minute, second } = getTimeInZone(tz)
      const frac = hour + minute / 60 + second / 3600
      const { g1, g2, g3 } = interpolateGradient(frac)

      html.style.setProperty('--footer-g1', g1)
      html.style.setProperty('--footer-g2', g2)
      html.style.setProperty('--footer-g3', g3)

      const avgLum = (sRGBLuminance(g1) + sRGBLuminance(g2) + sRGBLuminance(g3)) / 3
      const isLight = avgLum > 0.3
      html.dataset.footerTone = isLight ? 'light' : 'dark'

      if (isLight) {
        html.style.setProperty('--footer-fg', '#111110')
        html.style.setProperty('--footer-link-bg', 'color-mix(in oklab, #111110 10%, transparent)')
      } else {
        html.style.setProperty('--footer-fg', '#ffffff')
        html.style.setProperty('--footer-link-bg', 'color-mix(in oklab, #ffffff 18%, transparent)')
      }
    }

    // Set gradient colors FIRST (before revealing)
    update()

    // THEN enable the gradient display with a small delay to prevent flicker on page transition
    const revealTimeout = setTimeout(() => {
      html.dataset.footerGradient = 'on'
      requestAnimationFrame(() => { html.dataset.footerGradientReady = '1' })
    }, 800) // wait for portfolio fade-in to complete

    const { second } = getTimeInZone(tz)
    const syncTimeout = setTimeout(() => {
      update()
      const interval = setInterval(update, 60000)
      cleanup = () => clearInterval(interval)
    }, (60 - second) * 1000)

    let cleanup = () => {}

    return () => {
      clearTimeout(revealTimeout)
      clearTimeout(syncTimeout)
      cleanup()
      // Clean up when unmounting (navigating away)
      delete html.dataset.footerGradient
      delete html.dataset.footerGradientReady
      delete html.dataset.footerTone
      html.style.removeProperty('--footer-g1')
      html.style.removeProperty('--footer-g2')
      html.style.removeProperty('--footer-g3')
      html.style.removeProperty('--footer-fg')
      html.style.removeProperty('--footer-link-bg')
      html.style.removeProperty('--page-reveal')
      html.style.removeProperty('--page-scale-amount')
    }
  }, [])

  return null
}

function LocalTime() {
  const [time, setTime] = useState<string | null>(null)
  const [iso, setIso] = useState<string | null>(null)

  useEffect(() => {
    if (!MY_TIMEZONE) return
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: MY_TIMEZONE, hour: 'numeric', minute: '2-digit', hour12: true,
    })
    function tick() {
      const now = new Date()
      setTime(fmt.format(now).toLowerCase())
      setIso(now.toISOString())
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])

  return <time dateTime={iso ?? undefined}>{time ?? '\u2014'}</time>
}

export default function FooterGradient() {
  const hasLocation = !!(MY_TIMEZONE && MY_CITY)

  return (
    <>
      <FooterTimeGradient />
      <footer
        id="site-footer"
        className="relative z-[1] w-full pt-12 sm:pt-24 pb-16 sm:pb-32"
      >
        <div className="mx-auto w-full max-w-2xl px-8 text-center flex flex-col gap-1.5">
          {hasLocation && (
            <p
              className="text-sm leading-relaxed pt-2"
              style={{ color: 'var(--footer-fg)' }}
            >
              Right now I&apos;m in {MY_CITY}, where it&apos;s <LocalTime />
            </p>
          )}
          <p
            className={`text-sm italic font-medium tracking-tight ${hasLocation ? 'pt-12' : 'pt-2'}`}
            style={{ color: 'var(--footer-fg)', opacity: 0.7 }}
          >
            &copy; {new Date().getFullYear()}, Christian Nyamekye
          </p>
        </div>
      </footer>
    </>
  )
}
