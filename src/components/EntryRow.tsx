import type { Route } from 'next'
import Link from 'next/link'
import { ViewTransition } from 'react'

import { EntryLead } from './EntryLead'

type Props = {
  href: `/writing/${string}` | `/projects/${string}`
  /** Unique key for the shared-element morph, e.g. "posts-hello-again-world" */
  vtKey: string
  title: string
  date: string
  description?: string | null
  archived?: boolean | null
}

/**
 * One line in a Writing/Projects list. The title and date carry view-transition
 * names that match the detail page header, so they morph into place on navigation.
 */
export function EntryRow({ href, vtKey, title, date, description, archived }: Props) {
  return (
    <Link href={href as Route} className="entry group">
      <EntryLead />
      <span className="flex min-w-0 flex-col gap-0.5">
        <ViewTransition name={`title-${vtKey}`} share="morph" default="none">
          <span className="entry-title">
            {title}
            {archived ? <span className="archive-tag">Archive</span> : null}
          </span>
        </ViewTransition>
        {description ? (
          <span className="text-sm leading-normal text-mute">{description}</span>
        ) : null}
      </span>
      <ViewTransition name={`date-${vtKey}`} share="morph" default="none">
        <span className="entry-date w-fit text-sm whitespace-nowrap text-faint tabular-nums">
          {date}
        </span>
      </ViewTransition>
    </Link>
  )
}
