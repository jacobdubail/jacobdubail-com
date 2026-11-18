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
 *
 * PUNCTUATION, on the author's standing instruction: the serial comma,
 * always. "React, Next.js, and TypeScript", never "React, Next.js and
 * TypeScript". It applies to every list of three or more in anything a
 * reader sees, including UI strings and the 404.
 *
 * VOICE, on the author's standing instruction: no passive voice
 * anywhere on this site, copy and UI strings alike. Not a style
 * preference — a passive deletes the person who did the thing, and on
 * a page whose entire job is to say what one person did, that is the
 * one word you cannot afford to cut. "held to WCAG 2.1 AA" and
 * "rebuilt onto the App Router" both read as weather. Watch for the
 * near misses too: "are the binding constraints", "is on LinkedIn",
 * "are requirements rather than ambitions" are copular rather than
 * passive, and they fail for the same reason, which is that the
 * sentence has no one in it doing anything.
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
    'Engineering manager for web applications at Fueled, and a hands‑on frontend architect — React, Next.js, and TypeScript on platforms millions of people use.',

  /**
   * The facts rail: the four lines under the portrait.
   *
   * This is the screening decision, delivered in a glance. Every
   * reviewer of the second design pass ranked it the single biggest
   * thing the page still needed — the 20-second scan was producing a
   * headline, two paragraphs and three titles, and never role, scale,
   * location or availability, which are the four things a recruiter
   * actually filters on.
   *
   * Keep the values short. The rail is 208px and a value that wraps to
   * three lines stops being a fact and starts being a sentence; the
   * sentences are what the deck and the bio are for.
   *
   * A row with an empty `value` does not render, so a fact nobody has
   * supplied costs nothing but the row.
   *
   * There is deliberately no availability row. Every reviewer asked
   * for one — it is the line a recruiter screens on after location —
   * and it cannot go here: this page is public and indexed, it is
   * linked from the author's own profiles, and "open to new roles" on
   * it is a notice to his current employer, not a signal to a
   * recruiter. The tool for that job is LinkedIn's open-to-work
   * setting with recruiters-only visibility, which is invisible to
   * colleagues by design and reaches the same audience.
   * `Work` takes the row instead: a true fact about how the work
   * happens, useful to anyone screening for timezone overlap, and
   * unremarkable to anyone who already employs him.
   */
  facts: [
    /* `value` may be a list, and a list sets one item per line. That is
       not a style choice: a middot separator can only break AFTER
       itself, so "Engineering manager ·" ends up hanging at the end of
       a line in a 208px rail, which is the one element on the page
       whose whole job is to look exact. Values that fit on one line
       keep their middots; values that do not are lists. */
    { term: 'Role', value: ['Engineering manager', 'Frontend architect'] },
    { term: 'Stack', value: 'React · Next.js · TypeScript' },
    { term: 'Based', value: 'Whidbey Island, Washington' },
    { term: 'Work', value: 'Remote · US Pacific' },
  ] as { term: string; value: string | string[] }[],

  /**
   * The same page, said in a form a machine can parse.
   *
   * This feeds the JSON-LD in StructuredData.tsx and the Markdown in
   * llms.txt, and it exists because both of those have to describe a
   * person without guessing. A model reading the prose above can work
   * out the employer and the city; it can also work out a seniority, a
   * tenure and a salary band that nobody wrote down. Giving it the
   * fields outright is how the page stops being a surface to infer
   * from and starts being a source to quote.
   *
   * THE RULE IS THE ONE `emphasis` FOLLOWS: nothing here may assert
   * what the visible page does not. Every value below is already on
   * screen — `employer` is in `intro`, `locality` and `region` are the
   * Based row, `jobTitles` is the Role row, `knows` is the Stack row
   * plus the standards named in `work`. Structured data is not a place
   * to put the claims that were too thin for the copy. A reviewer who
   * finds a certification in the JSON-LD and not in the bio has
   * learned something about the author, and it is not the thing the
   * certification said.
   *
   * There is no availability field, for the reason written out on
   * `facts`: this is a public, indexed document linked from the
   * author's own profiles, and it reaches his employer before it
   * reaches a recruiter.
   */
  profile: {
    /** Exactly as it appears everywhere else. One spelling, or the
        graph describes two people. */
    name: 'Jacob Dubail',
    /** The Role rail, as separate values rather than one string. */
    jobTitles: ['Engineering manager', 'Frontend architect'],
    /** Named in `intro`. The URL is what makes it an organisation a
        consumer can resolve rather than a word. */
    employer: { name: 'Fueled', url: 'https://fueled.com' },
    /** The Based rail, split so an agent filtering on region does not
        have to parse a comma. No street and no postal code: the page
        says which island, and a home address is not a fact this site
        is in the business of publishing. */
    locality: 'Whidbey Island',
    region: 'WA',
    country: 'US',
    /** The Stack rail, then the standards and surfaces `work` names.
        Keep it to what a reader could point at on the page. */
    knows: [
      'React',
      'Next.js',
      'TypeScript',
      'Frontend architecture',
      'Engineering management',
      'React Server Components',
      'Web accessibility',
      'Web performance',
    ],
  },

  /**
   * The portrait, on the rail beside the deck.
   *
   * The path is resolved against /public and the page renders without
   * it — see page.tsx, which checks the file is on disk at build time
   * rather than shipping a broken <img> if it is not. Square source is
   * easiest; anything else is centre-cropped by object-fit.
   */
  portrait: '/portrait.jpg',
  portraitAlt: 'Jacob Dubail',

  /**
   * The bio. First paragraph is set as the lead and the rest as body
   * copy, at one rhythm — see the .prose-lead comment in globals.css.
   * Three paragraphs is the ceiling for a page someone opens from a job
   * application; past that it is a résumé, and the résumé is a link.
   *
   * It is two, because the middle one was the Selected work list in
   * prose — a multi-agency dashboard, an Emmy-winning platform, a
   * passenger portal — set about forty pixels above the same three
   * rows, with dates and detail. A reader who stopped there learned
   * nothing the list does not say better, and a reader who did not
   * stop read it twice. Cutting it also lifts Selected work to the
   * fold on a laptop. To put it back, this was the sentence:
   *   'The work runs from a multi-agency dashboard serving millions of
   *   California residents at WCAG 2.1 AA, to an Emmy-winning
   *   journalism platform rebuilt onto the App Router and React Server
   *   Components, to a passenger portal that has to stay usable over a
   *   satellite link at altitude.'
   * Note the shape of it: "rebuilt onto", with the person who did the
   * rebuilding deleted. Every passive on this page hid the same thing.
   */
  bio: [
    "I'm Jacob. I lead web application architecture and engineering teams at Fueled, and I am still in the code — React, Next.js, and TypeScript on platforms that have to prove performance, accessibility, and security rather than claim them.",
    'I also write the React practices the wider engineering organization works from, and coach senior engineers into tech leads. Before Fueled I spent years as an independent web consultant.',
  ],

  /**
   * Selected work.
   *
   * `emphasis` marks phrases already inside `description` — nothing
   * else. Each string has to appear in that sentence verbatim or
   * WorkRow drops it without a word, which is deliberate: the list can
   * never introduce a claim the sentence does not make. It exists
   * because every reviewer of the first pass said the same thing — the
   * evidence is all present and none of it is findable in a 20-second
   * scan, because every number and standard is an unstressed word mid-
   * line. Two phrases per row is the ceiling; three and the sentence
   * reads as bolded rather than as a sentence with proof in it.
   *
   * Three rows, in the order a frontend reviewer should
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
   * Query handling caching and revalidation, which tens of thousands of
   * staff worldwide open every day.
   */
  work: [
    {
      title: 'Multi-agency dashboard, State of California',
      meta: '2022–2026',
      description:
        'Led the frontend architecture unifying disconnected legacy systems into one React and Next.js application for millions of residents, clearing WCAG 2.1 AA, strict schema validation, and state security review.',
      emphasis: ['millions of residents', 'WCAG 2.1 AA'],
      href: undefined as string | undefined,
    },
    {
      title: 'Emmy-winning journalism platform',
      meta: '2025–2026',
      description:
        'Rebuilt a single-instance codebase onto the Next.js App Router and React Server Components, turning it into a commercial multi-state product and moving Core Web Vitals with server-driven UI.',
      emphasis: ['React Server Components', 'Core Web Vitals'],
      href: undefined as string | undefined,
    },
    {
      title: 'In-flight passenger portal, major airline',
      meta: '2025–2026',
      description:
        'Designed an offline-tolerant UI framework in Next.js, Payload, and TypeScript against real-time aircraft telemetry over LEO satellite, where bandwidth and latency decide what the interface can do.',
      emphasis: ['offline-tolerant', 'LEO satellite'],
      href: undefined as string | undefined,
    },
  ],

  /**
   * One line about the page itself, set last and set quietly.
   *
   * This was a three-row "Colophon" table above Contact, and it read as
   * a list of technologies the author likes — a skills section by
   * another name, in the loudest position on the lower half of the
   * page. The facts were never the problem; the framing and the rank
   * were. As a closing sentence about THIS PAGE it does the one job it
   * was ever good for, which is letting a reader check a claim against
   * what their own browser received.
   *
   * Payload used to be named here and on the rail, and it should not
   * be. Payload is in the repository — the admin, the collections and
   * the queries are all intact — but this page reads no database and
   * renders no CMS content, so an engineer who checks the claim finds
   * a dependency doing nothing. On a page whose argument is that its
   * claims are verifiable, the one unverifiable name is the one that
   * costs the most. It stays in Selected work, where the airline
   * portal actually runs on it.
   *
   * Set to null to drop it entirely.
   */
  /**
   * The rail cell beside the note below. Every other band of the page
   * puts something in the 208px column — a portrait, a date, a
   * platform — and this was the one section that left it empty for its
   * full height, which all three reviewers of the third pass read as
   * unfinished rather than as restraint.
   */
  siteMeta: { term: 'Built with', value: 'Next.js 16 · React 19' },

  site: 'This page is static. No database, no client JavaScript except the theme toggle. The stylesheet writes its own rules down in plain English: contrast ratios, type steps, and which gap beats which. A script reads them back, does the math, and fails the build when one stops being true.' as
    string | null,

  /**
   * The contact block. Every row is a profile, which is why every row
   * gets rel="me".
   *
   * LinkedIn leads because it is doing two jobs here — it is the résumé
   * and it is the inbox. Three profiles and no instruction leaves a
   * reader to guess which one to use, so `contactNote` says it outright.
   *
   * There was an X row. It came out because the author has not posted
   * there in years, and a dormant profile linked from a hiring page is
   * worse than no profile: a reviewer clicks it, finds nothing recent,
   * and what pays for that is the page's claim to being current. The
   * rel="me" made it worse, since that is an assertion of identity on
   * an account nobody is tending. The test for a fourth row is not "is
   * this me", it is "would I want a stranger to spend a minute there".
   *   { label: 'X', value: '@jacobdubail', href: 'https://twitter.com/jacobdubail' }
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
  ] satisfies Link[],

  /**
   * The lines under the rows. Set to null to drop them.
   *
   * The second sentence is there because the GitHub row is a quiet
   * profile, and a reviewer who opens it and finds nothing recent draws
   * a conclusion about whether the author writes code. The work is real
   * and it is under NDA, which is a better answer than silence — but
   * only if it arrives BEFORE the click, which is why it sits here and
   * not anywhere further down.
   */
  contactNote:
    'LinkedIn carries my full history, and a message there reaches me fastest. Client work lives in private repos, so GitHub shows less than I write.' as
      | string
      | null,
}
