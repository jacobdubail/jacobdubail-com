import { cacheLife } from 'next/cache'
import { Fragment } from 'react'

import { getSettings } from '@/lib/queries'

import { BackToTop } from './BackToTop'
import { ThemeToggle } from './ThemeToggle'

export async function SiteFooter() {
  'use cache'
  cacheLife('weeks') // keeps the copyright year current without a redeploy
  const settings = await getSettings()
  const links = (settings.social ?? []).filter((l) => l.inFooter !== false)

  return (
    /* One row on desktop. Below 600px it becomes an explicit two-row grid —
       links, then copyright and Top — rather than letting flex-wrap decide,
       which used to strand "Top" alone on a line of its own. */
    <footer className="mt-[var(--gap-footer)] flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-line pt-7 text-sm text-faint [view-transition-name:site-footer] max-sm:grid max-sm:grid-cols-2 max-sm:gap-y-5">
      <span className="mr-auto max-sm:order-2 max-sm:mr-0">
        © {new Date().getFullYear()} Jacob Dubail
      </span>
      <span className="flex items-center gap-x-7 max-sm:order-1 max-sm:col-span-2 max-sm:justify-between max-sm:gap-x-4">
        {links.length ? (
          <span className="inline-flex items-center">
            {links.map((l, i) => (
              <Fragment key={l.id ?? l.url}>
                {i > 0 ? (
                  <span className="chev mx-2.5 h-[9px] w-[5px] text-line-strong" aria-hidden />
                ) : null}
                <a href={l.url} className="tap hover:text-orange-text" rel="me">
                  {l.label}
                </a>
              </Fragment>
            ))}
          </span>
        ) : null}
        <ThemeToggle />
      </span>
      <span className="max-sm:order-3 max-sm:justify-self-end">
        <BackToTop />
      </span>
    </footer>
  )
}
