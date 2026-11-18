import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { StructuredData } from '@/components/StructuredData'
import { themeScript } from '@/components/ThemeToggle'
import { card } from '@/content/card'
import { plainText } from '@/lib/format'
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
/* The deck's own string with its line-breaking characters taken
   out. See plainText: "hands-on" is set with a non-breaking hyphen
   so it cannot break across a 390px column, and a search result, a
   share card and a JSON-LD field all want the spelling a reader
   would type. */
const summary = plainText(card.intro)

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: `%s · ${siteName}` },
  description: summary,
  /* www already 308s to the apex at the Vercel domain, so a crawler
     cannot reach a second copy of this page by hostname. This is for
     the URLs a redirect cannot touch: anything that arrives carrying
     ?utm_source, ?ref or a share parameter is the same document, and
     without this tag each one is a separate URL to an indexer. '/'
     resolves against metadataBase, so it follows siteUrl rather than
     hardcoding the host a second time. */
  alternates: { canonical: '/' },
  /* `url` resolves against metadataBase, so og:url names the canonical
     apex however the reader arrived — off a www link, a share
     parameter, or a preview deployment. Without it a scraper takes the
     URL it happened to fetch, and the card for ?utm_source=... is a
     second card for the same page.

     The image comes from opengraph-image.tsx in this directory, which
     Next finds and measures on its own; nothing names it here. Twitter
     falls back to the Open Graph image, so the only twitter field worth
     setting is the shape of the card: `summary` crops a 1200x630 card
     into a small square and throws away the headline, which is the one
     thing on it worth reading. */
  openGraph: {
    siteName,
    type: 'website',
    title: siteName,
    description: summary,
    url: '/',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: siteName, description: summary },
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
        {/* The Markdown twin of this page, announced rather than left to
            be guessed at. rel="describedby" is the relation the llms.txt
            proposal settled on, and it is the accurate one: /llms.txt
            describes the site, where rel="alternate" would claim it is
            another encoding of this document and invite a client to
            fetch one instead of the other. */}
        <link rel="describedby" type="text/plain" href="/llms.txt" />
        <StructuredData
          profile={card.profile}
          siteUrl={siteUrl}
          siteName={siteName}
          description={summary}
          image={card.portrait}
          imageAlt={card.portraitAlt}
          sameAs={card.contact.map((c) => c.href)}
        />
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
