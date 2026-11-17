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
   * REVERTED to the accurate version. The draft that sat here claimed
   * you still write the frontend day to day; that was written off a
   * one-word answer about your React/TypeScript background and you
   * flagged it as untrue. Nothing on this page should assert how you
   * spend your days except you.
   *
   * If the page is to aim at a frontend role, this line is where it
   * happens — but it has to be built from the real history, not from an
   * inference about it.
   */
  intro:
    'Engineering operations and hiring at Fueled, building the systems that help our teams hire well and ship steadily.',

  /**
   * The bio. First paragraph is set as the lead and the rest as body
   * copy, at one rhythm — see the .prose-lead comment in globals.css.
   * Three paragraphs is the ceiling for a page someone opens from a job
   * application; past that it is a résumé, and the résumé is a link.
   */
  bio: [
    "I'm Jacob. I work on engineering operations and hiring at Fueled, where I help our teams find great engineers and run smoothly once they're here.",
    'This page is a sample of how I like to work. Its stylesheet makes claims — contrast ratios, type steps, which vertical break outranks which — and a script re-derives every one of them and fails the build the moment a claim stops being true.',
    'Before Fueled I spent years as an independent web consultant, building sites for agencies, think tanks and small businesses. Lately I have been handing AI agents the parts of team operations that were eating the week.',
  ],

  /**
   * Selected work. Three rows is the right number for a page someone
   * opens from an application: enough to show a pattern, few enough that
   * every one gets read.
   *
   * Each `description` is one line answering "what did you actually do",
   * not what the thing was. A reviewer scanning for craft wants the verb.
   *
   * TODO — the three below are seeded from what the repo and the old
   * About page already said, and they are the weakest version of this
   * section. Production React/TypeScript work belongs ABOVE them. One
   * row each, in this shape:
   *
   *   {
   *     title: 'What it is called',
   *     meta: '2024–2026',          // or a year, or 'Ongoing'
   *     description: 'What YOU did, in one line, starting with a verb.
   *                   Scale belongs here: users, requests, team size.',
   *     href: 'https://…',          // omit if there is nothing to open
   *   }
   *
   * Drop any of the seeded three that a stronger row displaces. Three
   * rows is the right number; five is a résumé.
   */
  work: [
    {
      title: 'jacobdubail.com',
      meta: '2026',
      description:
        'Next.js 16 and React 19 on Payload. Hand-built design system whose colour, type and spacing claims are asserted by a script that fails the build when one stops being true.',
      href: undefined as string | undefined,
    },
    {
      title: 'Evaluation assistant for Greenhouse',
      meta: 'Ongoing',
      description:
        'Agent that reads a candidate’s submission against the role’s scorecard and drafts the reviewer’s first pass.',
      href: undefined as string | undefined,
    },
    {
      title: 'Agent workflows for Linear',
      meta: 'Ongoing',
      description: 'Triage and backlog grooming handed to agents instead of a weekly meeting.',
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
