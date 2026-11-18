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
  /* The file carries 400-600 and nothing else. This page sets 400, 500
     and 600 and never asks for another, so the rest of the axis was
     deltas nobody rendered. Declaring a range the file cannot cover
     makes the browser synthesise the missing weights, so this line and
     the file have to move together. */
  weight: '400 600',
  display: 'swap',
  adjustFontFallback: 'Arial',
})
const fraunces = localFont({
  src: '../../fonts/Fraunces.woff2',
  variable: '--font-fraunces',
  /* One weight, because the serif is only ever set at 400: the h1 says
     font-normal and .work-title is a span inheriting body weight. The
     optical size axis STAYS variable — the browser feeds it the
     rendered size, and at 60px that is worth more than the 16KB
     pinning it would save. */
  weight: '400',
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
  /* www already 308s to the apex at the Vercel domain, so a crawler
     cannot reach a second copy of this page by hostname. This is for
     the URLs a redirect cannot touch: anything that arrives carrying
     ?utm_source, ?ref or a share parameter is the same document, and
     without this tag each one is a separate URL to an indexer. '/'
     resolves against metadataBase, so it follows siteUrl rather than
     hardcoding the host a second time. */
  alternates: { canonical: '/' },
  openGraph: { siteName, type: 'website', title: siteName, description: card.intro },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfcfa' },
    { media: '(prefers-color-scheme: dark)', color: '#14120f' },
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
        <div className="mx-auto max-w-[912px] px-6 pt-[var(--gap-top)] pb-[var(--gap-bottom)] max-lg:px-8">
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
