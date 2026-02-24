'use client'

import { meta } from '@/lib/data'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/50 py-8">
      <div className="max-w-7xl mx-auto section-padding flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-subtle text-sm">
          <span className="font-mono text-accent text-xs">{'<'}</span>
          <span>CN</span>
          <span className="font-mono text-accent text-xs">{'/>'}</span>
          <span className="mx-2 text-border">·</span>
          <span>© {year} Christian Nyamekye</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={meta.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-subtle hover:text-muted transition-colors duration-200"
          >
            GitHub
          </a>
          <a
            href={meta.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-subtle hover:text-muted transition-colors duration-200"
          >
            LinkedIn
          </a>
          <a
            href={meta.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-subtle hover:text-muted transition-colors duration-200"
          >
            X
          </a>
          <span className="text-xs font-mono text-border">
            Next.js · Framer Motion · Tailwind
          </span>
        </div>
      </div>
    </footer>
  )
}
