import type { ReactNode } from 'react'

import { GappedArrow } from './icons'

/**
 * One line of selected work. The same .entry row the writing and project
 * indexes used, minus the parts that only made sense for an internal
 * link: no <Link>, no view-transition pairing, and no useLinkStatus —
 * so the hanging arrow is a static SVG that CSS reveals on hover rather
 * than a client component. The page ships no JS for this.
 *
 * A row without an href is a <div>, not a link with nothing behind it.
 * The arrow goes with it, because an affordance that promises a
 * destination and has none is worse than no affordance.
 */
export function WorkRow({
  title,
  meta,
  description,
  href,
}: {
  title: string
  /** Right-hand column: a year, a range, "Ongoing". */
  meta: string
  description?: string
  href?: string
}) {
  const body: ReactNode = (
    <>
      {href ? (
        <span className="entry-lead" aria-hidden>
          <GappedArrow className="size-full" />
        </span>
      ) : null}
      <span className="flex min-w-0 flex-col gap-1">
        <span className="entry-title">{title}</span>
        {description ? (
          <span className="text-sm leading-normal text-mute">{description}</span>
        ) : null}
      </span>
      <span className="entry-date w-fit whitespace-nowrap text-faint tabular-nums">{meta}</span>
    </>
  )

  if (!href) return <div className="entry">{body}</div>
  return (
    <a className="entry group" href={href}>
      {body}
    </a>
  )
}
