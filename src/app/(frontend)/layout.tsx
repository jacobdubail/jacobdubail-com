import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { themeScript } from '@/components/ThemeToggle'
import { card } from '@/content/card'
import { siteName, siteUrl } from '@/lib/site'

import './globals.css'

const franklin = localFont({
  src: '../../fonts/LibreFranklin.woff2',
  variable: '--font-franklin',
  weight: '100 900',
  display: 'swap',
  adjustFontFallback: 'Arial',
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

/**
 * One page, so no title template and no feed link: the template never
 * fires with nothing to nest under it, and advertising an RSS feed that
 * redirects to the home page is worse than advertising none. Both come
 * back with /writing.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s · ${siteName}` },
  description: card.intro,
  openGraph: { siteName, type: 'website', title: siteName, description: card.intro },
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
      className={`${franklin.variable} ${fraunces.variable} ${jetbrains.variable}`}
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
