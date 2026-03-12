'use client'

import { useEffect, useState } from 'react'
import { meta } from '@/lib/data'

/* Time-based gradient colors — shifts through the day like Vlad's */
function getTimeGradient() {
  const hour = new Date().getHours()

  // Night (8pm-5am): deep purple → navy
  if (hour >= 20 || hour < 5) {
    return { g1: '#1a1147', g2: '#2d2460', g3: '#4a3a7a', fg: '#ffffff' }
  }
  // Morning (5am-10am): warm sunrise
  if (hour < 10) {
    return { g1: '#f4b36e', g2: '#e8856b', g3: '#c96b8a', fg: '#ffffff' }
  }
  // Midday (10am-4pm): bright warm
  if (hour < 16) {
    return { g1: '#39366e', g2: '#b3668f', g3: '#f4b36e', fg: '#ffffff' }
  }
  // Evening (4pm-8pm): sunset
  return { g1: '#2d1b4e', g2: '#8b4570', g3: '#e8956b', fg: '#ffffff' }
}

function getTimeString() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York',
  }).toLowerCase()
}

export default function FooterGradient() {
  const [time, setTime] = useState('')
  const [colors, setColors] = useState({ g1: '#39366e', g2: '#b3668f', g3: '#f4b36e', fg: '#ffffff' })

  useEffect(() => {
    setTime(getTimeString())
    setColors(getTimeGradient())
    const interval = setInterval(() => {
      setTime(getTimeString())
      setColors(getTimeGradient())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer
      className="w-full pb-16 pt-12 sm:pt-24 sm:pb-32 relative z-[1]"
      style={{
        background: `linear-gradient(180deg, ${colors.g1} 0%, ${colors.g2} 50%, ${colors.g3} 100%)`,
      }}
    >
      <div className="mx-auto w-full max-w-2xl px-8 text-center flex flex-col gap-1.5">
        <p className="text-sm leading-relaxed pt-2" style={{ color: colors.fg, opacity: 0.85 }}>
          Right now I&apos;m in New York, where it&apos;s {time || '...'}
        </p>
        <p className="text-sm" style={{ color: colors.fg, opacity: 0.85 }}>
          You can also find me on{' '}
          <FooterLink href={meta.social.github} colors={colors}>GitHub</FooterLink>
          <FooterLink href={meta.social.linkedin} colors={colors}>LinkedIn</FooterLink>
          <FooterLink href={meta.social.twitter} colors={colors}>X</FooterLink>
          or{' '}
          <FooterLink href={`mailto:${meta.email}`} colors={colors}>Email</FooterLink>
          {' '}me directly.
        </p>
        <p className="text-sm italic pt-12" style={{ color: colors.fg, opacity: 0.7 }}>
          &copy; {new Date().getFullYear()}, Christian Nyamekye
        </p>
      </div>
    </footer>
  )
}

function FooterLink({
  href,
  colors,
  children,
}: {
  href: string
  colors: { fg: string }
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer px-1 py-0.5 mx-1 rounded-sm italic transition-colors duration-200"
      style={{
        backgroundColor: `color-mix(in oklab, ${colors.fg} 18%, transparent)`,
        color: colors.fg,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.fg
        e.currentTarget.style.color = '#111110'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `color-mix(in oklab, ${colors.fg} 18%, transparent)`
        e.currentTarget.style.color = colors.fg
      }}
    >
      {children}
    </a>
  )
}
