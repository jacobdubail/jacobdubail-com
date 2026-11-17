import Link from 'next/link'

import { LogoSalvo } from './LogoSalvo'

/**
 * Letterhead, not navigation. With one page there is nothing to link to,
 * so the nav links are gone and the name is no longer hidden on phones —
 * it was only ever sr-only below 600px because three links and a wordmark
 * would not fit on one line, and that pressure is gone with them.
 *
 * The home link stays. It is a no-op from here, but it is the logo, and
 * the logo is the thing that fires a volley on three taps of Shift.
 */
export function SiteNav() {
  return (
    <header className="mb-[var(--gap-chrome)] flex items-center text-sm [view-transition-name:site-nav]">
      <Link
        href="/"
        className="tap -mx-2 inline-flex items-center gap-3 px-2 font-medium tracking-[-0.005em]"
      >
        <LogoSalvo className="w-[26px] max-sm:w-7" />
        <span>Jacob Dubail</span>
      </Link>
    </header>
  )
}
