import Link from 'next/link'
import { Suspense } from 'react'

import { Logo } from './icons'
import { NavLinks, NavLinksStatic } from './NavLinks'

export function SiteNav() {
  return (
    <header className="mb-24 flex items-center justify-between text-sm [view-transition-name:site-nav] max-sm:mb-16">
      <Link href="/" className="flex items-center gap-3 font-medium tracking-[-0.005em]">
        <Logo className="w-[26px] max-sm:w-7" title="Jacob Dubail" />
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
