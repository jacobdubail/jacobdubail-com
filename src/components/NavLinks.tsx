'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links: { href: Route; label: string }[] = [
  { href: '/writing', label: 'Writing' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
]

function List({ current }: { current?: string }) {
  return (
    <ul className="flex items-center gap-7 text-mute max-sm:gap-5">
      {links.map(({ href, label }) => {
        const active = current === href || current?.startsWith(`${href}/`)
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className="tap inline-flex items-center gap-1.5 hover:text-fg aria-[current=page]:font-medium aria-[current=page]:text-fg"
            >
              {active ? <span className="chev text-orange" aria-hidden /> : null}
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function NavLinks() {
  return <List current={usePathname()} />
}

/** Rendered in the static shell before the pathname is known. */
export function NavLinksStatic() {
  return <List />
}
