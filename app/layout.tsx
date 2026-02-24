import type { Metadata } from 'next'
import './globals.css'
import { meta } from '@/lib/data'

export const metadata: Metadata = {
  metadataBase: new URL(meta.url),
  title: meta.title,
  description: meta.description,
  keywords: [
    'Christian Nyamekye', 'robotics', 'EgoDex', 'Dartmouth',
    'software engineer', 'embedded systems', 'machine learning',
  ],
  authors: [{ name: meta.name, url: meta.url }],
  creator: meta.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: meta.url,
    title: meta.title,
    description: meta.description,
    siteName: meta.name,
    images: [{ url: `${meta.url}/og.png`, width: 1200, height: 630, alt: meta.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    creator: '@printlnxristian',
    images: [`${meta.url}/og.png`],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: meta.name,
              url: meta.url,
              jobTitle: 'Software Engineer & Founder',
              alumniOf: { '@type': 'CollegeOrUniversity', name: 'Dartmouth College' },
              sameAs: Object.values(meta.social),
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
