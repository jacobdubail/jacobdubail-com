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
    <footer className="mt-24 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 text-sm text-faint [view-transition-name:site-footer]">
      <span className="mr-auto">© {new Date().getFullYear()} Jacob Dubail</span>
      {links.length ? (
        <span className="inline-flex items-center">
          {links.map((l, i) => (
            <Fragment key={l.id ?? l.url}>
              {i > 0 ? (
                <span className="chev mx-2.5 h-[9px] w-[5px] opacity-60" aria-hidden />
              ) : null}
              <a href={l.url} className="hover:text-orange-text" rel="me">
                {l.label}
              </a>
            </Fragment>
          ))}
        </span>
      ) : null}
      <ThemeToggle />
      <BackToTop />
    </footer>
  )
}
