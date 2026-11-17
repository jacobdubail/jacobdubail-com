import { cacheLife } from 'next/cache'

import { BackToTop } from './BackToTop'
import { ThemeToggle } from './ThemeToggle'

/**
 * Three items, one row, at every width. The explicit two-row grid this
 * used to carry below 600px existed because the social links shared the
 * line; they live in the contact block now, and what is left measures
 * about 270px at 13.5px — inside a 390px viewport's 350px of column, so
 * flex-wrap has nothing to decide and no breakpoint is needed.
 *
 * Still 'use cache': the copyright year is read at render, and a
 * prerendered route may not read the clock outside a cache boundary.
 * A weekly life keeps the year current without a redeploy.
 */
export async function SiteFooter() {
  'use cache'
  cacheLife('weeks')

  return (
    <footer className="mt-[var(--gap-footer)] flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-line pt-7 text-sm text-faint [view-transition-name:site-footer]">
      <span className="mr-auto">© {new Date().getFullYear()} Jacob Dubail</span>
      <ThemeToggle />
      <BackToTop />
    </footer>
  )
}
