'use client'

import { meta } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="py-8 border-t border-[var(--border)]">
      <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--text-tertiary)]">
          Built by {meta.name}
        </p>
        <div className="flex items-center gap-4">
          {Object.entries(meta.social).map(([key, href]) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors capitalize"
            >
              {key}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
