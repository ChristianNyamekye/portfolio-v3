import type { Metadata } from 'next'
import './globals.css'
import { meta } from '@/lib/data'

export const metadata: Metadata = {
  metadataBase: new URL(meta.url),
  title: meta.title,
  description: meta.description,
  keywords: [
    'Christian Nyamekye',
    'robotics data',
    'EgoDex',
    'Dartmouth EE CS',
    'software engineer',
    'machine learning',
    'embedded systems',
    'full stack developer',
  ],
  authors: [{ name: 'Christian Nyamekye', url: meta.url }],
  creator: 'Christian Nyamekye',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: meta.url,
    title: meta.title,
    description: meta.description,
    siteName: 'Christian Nyamekye',
    images: [
      {
        url: `${meta.url}/og.png`,
        width: 1200,
        height: 630,
        alt: 'Christian Nyamekye — Building the future of robotics data',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    creator: '@printlnxristian',
    images: [`${meta.url}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Christian Nyamekye',
              url: 'https://christiannyamekye.com',
              jobTitle: 'Software Engineer & Founder',
              description: 'Dartmouth EE+CS. Building EgoDex — crowdsourced manipulation training data for humanoid robots.',
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Dartmouth College',
              },
              sameAs: [
                'https://github.com/ChristianNyamekye',
                'https://linkedin.com/in/christian-k-nyamekye',
                'https://x.com/printlnxristian',
              ],
              knowsAbout: ['Robotics', 'Embedded Systems', 'Applied ML', 'Full-Stack Development', 'Hardware Design'],
            }),
          }}
        />
        {/* Theme flash prevention */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme');if(t==='light'||(!t&&window.matchMedia('(prefers-color-scheme:light)').matches))document.documentElement.classList.add('light')}catch(e){}`,
          }}
        />
      </head>
      <body className="noise-overlay">
        {children}
        {/* Chatbot placeholder — mount a widget here */}
        <div id="chatbot-root" aria-hidden="true" />
      </body>
    </html>
  )
}
