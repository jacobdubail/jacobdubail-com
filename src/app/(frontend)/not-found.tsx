import Link from 'next/link'

import { GappedArrow } from '@/components/icons'

export default function NotFound() {
  return (
    <div className="index-offset">
      <p className="mb-3 text-sm text-faint">404</p>
      <h1 className="mb-4 font-serif text-display font-normal tracking-[-0.02em]">
        Nothing at this address.
      </h1>
      <p className="mb-8 text-ink2">
        The writing and project archives are off the air while this site is one page. Everything
        that is here is on the front page.
      </p>
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm text-mute hover:text-fg"
      >
        <GappedArrow className="w-3.5 -scale-x-100 text-orange" /> Home
      </Link>
    </div>
  )
}
