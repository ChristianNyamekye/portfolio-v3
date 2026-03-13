'use client'

import { useEffect, useState } from 'react'

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
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date())
    const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? '0')
    return { hour: get('hour'), minute: get('minute'), second: get('second') }
  } catch {
    return { hour: 12, minute: 0, second: 0 }
  }
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

/** Get browser timezone + city name */
function getBrowserLocation() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const city = tz.split('/').pop()?.replace(/_/g, ' ') || ''
    return { timezone: tz, city }
  } catch {
    return null
  }
}

function LocalTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState<string | null>(null)
  const [iso, setIso] = useState<string | null>(null)

  useEffect(() => {
    let fmt: Intl.DateTimeFormat
    try {
      fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone, hour: 'numeric', minute: '2-digit', hour12: true,
      })
    } catch { return }
    function tick() {
      const now = new Date()
      setTime(fmt.format(now).toLowerCase())
      setIso(now.toISOString())
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [timezone])

  return <time dateTime={iso ?? undefined}>{time ?? ''}</time>
}

export default function FooterGradient() {
  const [location, setLocation] = useState<{ timezone: string; city: string } | null>(null)
  const [colors, setColors] = useState({ g1: '#0a0e27', g2: '#1a1145', g3: '#2d1b69' })
  const [fg, setFg] = useState('#ffffff')
  const [visible, setVisible] = useState(false)

  // Get location from browser
  useEffect(() => {
    const loc = getBrowserLocation()
    if (loc) setLocation(loc)
  }, [])

  // Update gradient colors based on time
  useEffect(() => {
    const tz = location?.timezone || 'America/New_York'

    function update() {
      const { hour, minute, second } = getTimeInZone(tz)
      const frac = hour + minute / 60 + second / 3600
      const grad = interpolateGradient(frac)
      setColors(grad)

      const avgLum = (sRGBLuminance(grad.g1) + sRGBLuminance(grad.g2) + sRGBLuminance(grad.g3)) / 3
      setFg(avgLum > 0.3 ? '#111110' : '#ffffff')
    }

    update()

    // Fade in after portfolio has settled
    const revealTimeout = setTimeout(() => setVisible(true), 800)

    const { second } = getTimeInZone(tz)
    let intervalCleanup = () => {}
    const syncTimeout = setTimeout(() => {
      update()
      const interval = setInterval(update, 60000)
      intervalCleanup = () => clearInterval(interval)
    }, (60 - second) * 1000)

    return () => {
      clearTimeout(revealTimeout)
      clearTimeout(syncTimeout)
      intervalCleanup()
    }
  }, [location])

  const gradientStyle = `linear-gradient(180deg, ${colors.g1} 20%, ${colors.g2} 55%, ${colors.g3} 100%)`

  // Set html bg to bottom gradient color immediately (no gap between footer and page bottom)
  useEffect(() => {
    document.documentElement.style.setProperty('background', colors.g3)
    return () => {
      document.documentElement.style.removeProperty('background')
    }
  }, [colors.g3])

  return (
    <>
      {/* Fixed gradient background — unmounts with portfolio */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-600"
        style={{
          background: gradientStyle,
          opacity: visible ? 1 : 0,
        }}
      />

      <footer
        id="site-footer"
        className="relative z-[1] w-full pt-12 sm:pt-24 pb-16 sm:pb-32"
      >
        <div className="mx-auto w-full max-w-2xl px-8 text-center flex flex-col gap-1.5">
          {location && (
            <p className="text-sm leading-relaxed pt-2" style={{ color: fg }}>
              Right now I&apos;m in {location.city}, where it&apos;s <LocalTime timezone={location.timezone} />
            </p>
          )}
          <p
            className={`text-sm italic font-medium tracking-tight ${location ? 'pt-12' : 'pt-2'}`}
            style={{ color: fg, opacity: 0.7 }}
          >
            &copy; {new Date().getFullYear()}, Christian Nyamekye
          </p>
        </div>
      </footer>
    </>
  )
}
