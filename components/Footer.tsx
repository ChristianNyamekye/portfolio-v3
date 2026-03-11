'use client'

import { meta } from '@/lib/data'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-[1400px] mx-auto section-padding flex flex-col sm:flex-row items-center justify-between gap-4">

        <span className="text-xs text-subtle font-mono">
          © {year} Christian Nyamekye
        </span>

        <div className="flex items-center gap-6">
          {[
            { label: 'GitHub',   href: meta.social.github },
            { label: 'LinkedIn', href: meta.social.linkedin },
            { label: 'X',        href: meta.social.twitter },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-subtle hover:text-muted transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

      </div>
    </footer>
  )
}
