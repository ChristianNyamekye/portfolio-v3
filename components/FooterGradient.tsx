'use client'

import { useEffect, useState } from 'react'
import { meta } from '@/lib/data'

/**
 * Time-based gradient colors — matches vladsavruk.com's FooterTimeGradient
 * Colors lerp between stops based on current hour in America/New_York
 */
const COLOR_STOPS = [
  { hour: 0,  g1: '#070A14', g2: '#0B1533', g3: '#1A2A5E' }, // deep night
  { hour: 7,  g1: '#2B3A7A', g2: '#C08A7A', g3: '#F2D5A0' }, // sunrise
  { hour: 12, g1: '#7FB7FF', g2: '#BFE8FF', g3: '#FFF4D6' }, // midday
  { hour: 18, g1: '#2B1D52', g2: '#B14D7A', g3: '#F2A65A' }, // sunset
  { hour: 22, g1: '#070A14', g2: '#0B1533', g3: '#1A2A5E' }, // back to night
]

const TIMEZONE = 'America/New_York'

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '').trim()
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function lerpColor(a: string, b: string, t: number) {
  const ca = hexToRgb(a), cb = hexToRgb(b)
  const f = clamp01(t)
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  return `#${toHex(ca.r + (cb.r - ca.r) * f)}${toHex(ca.g + (cb.g - ca.g) * f)}${toHex(ca.b + (cb.b - ca.b) * f)}`
}

function sRGBLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const toLinear = (v: number) => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function getTimeInZone(tz: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? '0')
  return { hour: get('hour'), minute: get('minute'), second: get('second') }
}

function interpolateGradient(fractionalHour: number) {
  const h = ((fractionalHour % 24) + 24) % 24
  let idx = 0
  for (let i = 0; i < COLOR_STOPS.length; i++) {
    if (COLOR_STOPS[i].hour <= h) idx = i
  }
  const a = COLOR_STOPS[idx]
  const b = COLOR_STOPS[(idx + 1) % COLOR_STOPS.length]
  const startH = a.hour
  const endH = b.hour > startH ? b.hour : b.hour + 24
  const t = clamp01(((h < startH ? h + 24 : h) - startH) / Math.max(0.0001, endH - startH))
  return {
    g1: lerpColor(a.g1, b.g1, t),
    g2: lerpColor(a.g2, b.g2, t),
    g3: lerpColor(a.g3, b.g3, t),
  }
}

function FooterTimeGradient() {
  useEffect(() => {
    const html = document.documentElement
    html.dataset.footerGradient = 'on'
    html.dataset.footerGradientReady = '0'

    function update() {
      const { hour, minute, second } = getTimeInZone(TIMEZONE)
      const frac = hour + minute / 60 + second / 3600
      const { g1, g2, g3 } = interpolateGradient(frac)

      html.style.setProperty('--footer-g1', g1)
      html.style.setProperty('--footer-g2', g2)
      html.style.setProperty('--footer-g3', g3)

      // Auto-detect light/dark text based on luminance
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

    // Sync to next minute boundary, then update every 60s
    const { second } = getTimeInZone(TIMEZONE)
    const timeout = setTimeout(() => {
      update()
      const interval = setInterval(update, 60000)
      cleanup = () => clearInterval(interval)
    }, (60 - second) * 1000)

    let cleanup = () => {}

    return () => {
      clearTimeout(timeout)
      cleanup()
    }
  }, [])

  return null
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block cursor-pointer px-1 py-0 my-0.5 rounded-sm italic transition-colors duration-200"
      style={{
        backgroundColor: 'var(--footer-link-bg)',
        color: 'var(--footer-fg)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--footer-link-hover-bg)'
        e.currentTarget.style.color = 'var(--footer-link-hover-fg)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--footer-link-bg)'
        e.currentTarget.style.color = 'var(--footer-fg)'
      }}
    >
      {children}
    </a>
  )
}

function LocalTime() {
  const [time, setTime] = useState<string | null>(null)
  const [iso, setIso] = useState<string | null>(null)

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  useEffect(() => {
    function tick() {
      const now = new Date()
      setTime(formatter.format(now).toLowerCase())
      setIso(now.toISOString())
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <time dateTime={iso ?? undefined}>
      {time ?? '\u2014'}
    </time>
  )
}

export default function FooterGradient() {
  return (
    <>
      <FooterTimeGradient />
      <footer
        id="site-footer"
        className="relative z-[1] w-full pt-12 sm:pt-24 pb-16 sm:pb-32"
      >
        <div className="mx-auto w-full max-w-2xl px-8 text-center flex flex-col gap-1.5">
          <p
            className="text-sm leading-relaxed pt-2"
            style={{ color: 'var(--footer-fg)', opacity: 0.85 }}
          >
            Right now I&apos;m in New York, where it&apos;s <LocalTime />
          </p>
          <p className="text-sm" style={{ color: 'var(--footer-fg)', opacity: 0.85 }}>
            You can also find me on{' '}
            <FooterLink href={meta.social.github}>GitHub</FooterLink>{' '}
            <FooterLink href={meta.social.linkedin}>LinkedIn</FooterLink>{' '}
            <FooterLink href={meta.social.twitter}>X</FooterLink>{' '}
            or{' '}
            <FooterLink href={`mailto:${meta.email}`}>Email</FooterLink>{' '}
            me directly.
          </p>
          <p
            className="text-sm italic pt-12"
            style={{ color: 'var(--footer-fg)', opacity: 0.7 }}
          >
            &copy; {new Date().getFullYear()}, Christian Nyamekye
          </p>
        </div>
      </footer>
    </>
  )
}
