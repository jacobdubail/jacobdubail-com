import Link from 'next/link'

import { card } from '@/content/card'

import { LogoSalvo } from './LogoSalvo'

/**
 * Letterhead, and now one link.
 *
 * It was letterhead only. Three independent reviewers of the first
 * design round opened with the same finding: on a 1440x900 laptop the
 * fold lands on the first section rule, so the whole visible page was a
 * headline, a deck and three paragraphs — and the only thing a reader
 * could act on in it was the theme toggle. The contact block sat about
 * 1450px down. For a page whose entire job is to get a message sent,
 * that is the fault, not a nuance.
 *
 * So the one route the copy itself calls the quickest is up here, in
 * tangerine, at every viewport. One link and not three: a letterhead
 * with a navigation bar in it is a different kind of page, and the
 * other two profiles are forty words from anywhere a reader stops.
 *
 * It is a bordered control rather than an underlined word, in the same
 * shape the theme switch uses. At 13.5px underlined it was the smallest
 * element on the page carrying its largest job, and every reviewer said
 * so. Bordered, not filled: a filled tangerine button would be the
 * loudest thing on a page whose argument is restraint.
 *
 * The href is read off the contact list rather than written twice, so a
 * change in card.ts cannot leave this pointing somewhere stale. If the
 * row is renamed or removed the link simply does not render.
 */
const primary = card.contact.find((r) => r.label === 'LinkedIn')

export function SiteNav() {
  return (
    <header className="mb-[var(--gap-chrome)] flex items-center gap-4 text-sm [view-transition-name:site-nav]">
      <Link
        href="/"
        className="tap -mx-2 inline-flex items-center gap-3 px-2 font-medium tracking-[-0.005em]"
      >
        <LogoSalvo className="w-[26px] max-sm:w-7" />
        <span>Jacob Dubail</span>
      </Link>
      {primary ? (
        <a href={primary.href} rel="me" className="toggle is-action ext ml-auto">
          {primary.label}
        </a>
      ) : null}
    </header>
  )
}
