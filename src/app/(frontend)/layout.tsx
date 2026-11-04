import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { themeScript } from '@/components/ThemeToggle'
import { siteName, siteUrl } from '@/lib/site'

import './globals.css'

const inter = localFont({
  src: '../../fonts/Inter.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
})
const fraunces = localFont({
  src: '../../fonts/Fraunces.woff2',
  variable: '--font-fraunces',
  weight: '100 900',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
})
const jetbrains = localFont({
  src: '../../fonts/JetBrainsMono.woff2',
  variable: '--font-jetbrains',
  weight: '100 800',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s · ${siteName}` },
  description:
    'Engineering operations and hiring at Fueled. Writing about hiring, team process, and the tools that make product teams faster.',
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: { siteName, type: 'website' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfcfa' },
    { media: '(prefers-color-scheme: dark)', color: '#101318' },
  ],
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body id="top" className="relative">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:bg-bg focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <div className="band" aria-hidden />
        <div className="mx-auto max-w-[784px] px-6 pt-[var(--gap-top)] pb-[var(--gap-bottom)] max-lg:px-8 max-sm:px-5">
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
