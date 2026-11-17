/**
 * Everything the public page renders, in one file.
 *
 * The site used to read its hero and bio out of Payload globals
 * (SiteSettings + About). It still can — src/lib/queries.ts, the
 * collections and the admin are untouched — but while there is one page
 * and no articles, a deploy is a cheaper edit than a CMS round trip, and
 * the public route now builds with no database reachable at all.
 *
 * When the writing starts, the card goes back on the globals and this
 * file goes away. Until then this is the only place to edit copy.
 */

type Link = {
  /** Gutter label. Short — it sits in a 112px column. */
  label: string
  /** What the reader sees and can read aloud over the phone. */
  value: string
  href: string
}

export const card = {
  /** The one sentence a stranger reads first. Keep it a claim, not a title. */
  headline: 'I build engineering teams and the systems they run on.',
  /**
   * Two words out of the headline, set in azure and tangerine. Both must
   * appear in `headline` verbatim or they are silently ignored — see
   * Headline.tsx, which also binds each to the word before it so neither
   * colour opens a line on a phone.
   */
  highlightBlue: 'teams',
  highlightOrange: 'systems',

  /**
   * The deck does the work the headline deliberately does not. The
   * headline is about teams; this is where a frontend reviewer finds
   * out you are still the architect on the code. Both halves are true
   * and the order matters — lead with the managing and the craft reads
   * as nostalgia.
   */
  intro:
    'Engineering manager for web applications at Fueled, and a hands-on frontend architect — React, Next.js and TypeScript on platforms used by millions.',

  /**
   * The bio. First paragraph is set as the lead and the rest as body
   * copy, at one rhythm — see the .prose-lead comment in globals.css.
   * Three paragraphs is the ceiling for a page someone opens from a job
   * application; past that it is a résumé, and the résumé is a link.
   */
  bio: [
    "I'm Jacob. I lead web application architecture and engineering teams at Fueled, and I am still in the code — React, Next.js and TypeScript on platforms where performance, accessibility and security are requirements rather than ambitions.",
    'The work runs from a multi-agency dashboard serving millions of California residents at WCAG 2.1 AA, to an Emmy-winning journalism platform rebuilt onto the App Router and React Server Components, to a passenger portal that has to stay usable over a satellite link at altitude.',
    'Alongside delivery I write the React practices the wider engineering organisation works from, and coach senior engineers into tech leads. Before Fueled I spent years as an independent web consultant.',
  ],

  /**
   * Selected work. Three rows, in the order a frontend reviewer should
   * meet them: the biggest audience, the deepest framework work, then
   * the one nobody else has done.
   *
   * No client is named beyond what the public profile names, and no row
   * links anywhere, because none of this is public. The descriptions
   * lead with the verb and carry the scale, which is what a reviewer is
   * scanning for.
   *
   * A fourth is available if one of these should go: the global
   * communications portal — Next.js against Contentful with TanStack
   * Query handling caching and revalidation, used daily by tens of
   * thousands of staff worldwide.
   */
  work: [
    {
      title: 'Multi-agency dashboard, State of California',
      meta: '2022–2026',
      description:
        'Led the frontend architecture unifying disconnected legacy systems into one React and Next.js application for millions of residents, held to WCAG 2.1 AA, strict schema validation and state security review.',
      href: undefined as string | undefined,
    },
    {
      title: 'Emmy-winning journalism platform',
      meta: '2025–2026',
      description:
        'Rebuilt a single-instance codebase onto the Next.js App Router and React Server Components, turning it into a commercial multi-state product and moving Core Web Vitals with server-driven UI.',
      href: undefined as string | undefined,
    },
    {
      title: 'In-flight passenger portal, major airline',
      meta: '2025–2026',
      description:
        'Designed an offline-tolerant UI framework in Next.js, Payload and TypeScript against real-time aircraft telemetry over LEO satellite, where bandwidth and latency are the binding constraints.',
      href: undefined as string | undefined,
    },
  ],

  /**
   * How this page is built. It is here because the page is the work
   * sample: a frontend reviewer can check every line of it against what
   * their browser actually received, which is a stronger claim than any
   * adjective in the bio.
   *
   * Keep it honest and keep it current. A colophon that has drifted from
   * the lockfile is worse than none, because it is checkable.
   */
  colophon: [
    {
      label: 'Stack',
      value:
        'Next.js 16 (App Router, Cache Components) · React 19.3 · TypeScript, strict · Tailwind v4 · Payload 3 on Postgres',
    },
    {
      label: 'Design',
      value:
        'One stylesheet, two hues, a 4px grid. scripts/check-tokens.mjs re-derives every contrast ratio, type step and spacing rank the stylesheet claims and fails the build on drift.',
    },
    {
      label: 'Delivery',
      value:
        'Prerendered static, no database read on this route. The only client JavaScript is the theme toggle — and the logo, which fires a volley if you tap Shift three times.',
    },
  ],

  /**
   * The contact block. Every row is a profile, which is why every row
   * gets rel="me".
   *
   * LinkedIn leads because it is doing two jobs here — it is the résumé
   * and it is the inbox. Three profiles and no instruction leaves a
   * reader to guess which one to use, so `contactNote` says it outright.
   *
   * To put an email back, add a row and drop the note's second clause:
   *   { label: 'Email', value: 'you@example.com', href: 'mailto:you@example.com' }
   */
  contact: [
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/jacobdubail',
      href: 'https://www.linkedin.com/in/jacobdubail',
    },
    { label: 'GitHub', value: 'github.com/jacobdubail', href: 'https://github.com/jacobdubail' },
    { label: 'X', value: '@jacobdubail', href: 'https://twitter.com/jacobdubail' },
  ] satisfies Link[],

  /** One line under the rows. Set to null to drop it. */
  contactNote:
    'My full history is on LinkedIn, and a message there is the quickest way to reach me.' as
      string | null,
}
