import Link from 'next/link'
import { Suspense } from 'react'

import { LogoSalvo } from './LogoSalvo'
import { NavLinks, NavLinksStatic } from './NavLinks'

export function SiteNav() {
  return (
    <header className="mb-[var(--gap-chrome)] flex items-center justify-between text-sm [view-transition-name:site-nav]">
      <Link
        href="/"
        className="tap -mx-2 inline-flex items-center gap-3 px-2 font-medium tracking-[-0.005em]"
      >
        <LogoSalvo className="w-[26px] max-sm:w-7" />
        <span className="max-sm:sr-only">Jacob Dubail</span>
      </Link>
      <nav aria-label="Main">
        <Suspense fallback={<NavLinksStatic />}>
          <NavLinks />
        </Suspense>
      </nav>
    </header>
  )
}
