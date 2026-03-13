'use client'

import { useEffect, useState } from 'react'

/**
 * Time-based gradient — unique palette for Christian
 * Vibrant, clean, colorful. Not Vlad's muted tones.
 */
const COLOR_STOPS = [
  { hour: 0,  g1: '#0a0e27', g2: '#1a1145', g3: '#2d1b69' }, // deep indigo night
  { hour: 5,  g1: '#1a1145', g2: '#6b2fa0', g3: '#e85d75' }, // predawn purple-rose
  { hour: 8,  g1: '#e85d75', g2: '#f59e42', g3: '#ffe066' }, // sunrise coral-gold
  { hour: 12, g1: '#1e6bff', g2: '#36c5f0', g3: '#56e8cd' }, // midday electric blue-teal
  { hour: 16, g1: '#4338ca', g2: '#d946ef', g3: '#fb923c' }, // afternoon indigo-magenta-orange
  { hour: 19, g1: '#6d28d9', g2: '#be185d', g3: '#f43f5e' }, // sunset purple-crimson
  { hour: 22, g1: '#1e1145', g2: '#0f172a', g3: '#0a0e27' }, // back to night
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

/** Fetches YOUR location from IP geolocation (no permissions needed) */
async function fetchMyLocation(): Promise<{ timezone: string; city: string }> {
  const fallback = { timezone: 'America/New_York', city: 'New York' }
  try {
    const res = await fetch('https://worldtimeapi.org/api/ip', { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return fallback
    const data = await res.json()
    // timezone is like "America/New_York" → extract city
    const tz: string = data.timezone || fallback.timezone
    const city = tz.split('/').pop()?.replace(/_/g, ' ') || fallback.city
    return { timezone: tz, city }
  } catch {
    return fallback
  }
}

function FooterTimeGradient({ timezone }: { timezone: string }) {
  useEffect(() => {
    const html = document.documentElement
    html.dataset.footerGradient = 'on'
    html.dataset.footerGradientReady = '0'

    function update() {
      const { hour, minute, second } = getTimeInZone(timezone)
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
        html.style.setProperty('--footer-link-hover-bg', '#111110')
        html.style.setProperty('--footer-link-hover-fg', '#F2F0E5')
      } else {
        html.style.setProperty('--footer-fg', '#ffffff')
        html.style.setProperty('--footer-link-bg', 'color-mix(in oklab, #ffffff 18%, transparent)')
        html.style.setProperty('--footer-link-hover-bg', '#ffffff')
        html.style.setProperty('--footer-link-hover-fg', '#111110')
      }
    }

    update()
    requestAnimationFrame(() => { html.dataset.footerGradientReady = '1' })

    const { second } = getTimeInZone(timezone)
    const timeout = setTimeout(() => {
      update()
      const interval = setInterval(update, 60000)
      cleanup = () => clearInterval(interval)
    }, (60 - second) * 1000)

    let cleanup = () => {}
    return () => { clearTimeout(timeout); cleanup() }
  }, [timezone])

  return null
}

function LocalTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState<string | null>(null)
  const [iso, setIso] = useState<string | null>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone, hour: 'numeric', minute: '2-digit', hour12: true,
    })
    function tick() {
      const now = new Date()
      setTime(fmt.format(now).toLowerCase())
      setIso(now.toISOString())
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [timezone])

  return <time dateTime={iso ?? undefined}>{time ?? '\u2014'}</time>
}

export default function FooterGradient() {
  const [location, setLocation] = useState({ timezone: 'America/New_York', city: 'New York' })

  useEffect(() => {
    fetchMyLocation().then(setLocation)
  }, [])

  const { timezone, city } = location

  return (
    <>
      <FooterTimeGradient timezone={timezone} />
      <footer
        id="site-footer"
        className="relative z-[1] w-full pt-12 sm:pt-24 pb-16 sm:pb-32"
      >
        <div className="mx-auto w-full max-w-2xl px-8 text-center flex flex-col gap-1.5">
          <p
            className="text-sm leading-relaxed pt-2"
            style={{ color: 'var(--footer-fg)' }}
          >
            Right now I&apos;m in {city}, where it&apos;s <LocalTime timezone={timezone} />
          </p>
          <p
            className="text-sm italic pt-12 font-medium tracking-tight"
            style={{ color: 'var(--footer-fg)', opacity: 0.7 }}
          >
            &copy; {new Date().getFullYear()}, Christian Nyamekye
          </p>
        </div>
      </footer>
    </>
  )
}
