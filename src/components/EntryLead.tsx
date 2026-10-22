'use client'

import { useLinkStatus } from 'next/link'

import { GappedArrow, ScissorLoader } from './icons'

/**
 * Hover arrow that turns into the scissor loader while the link's navigation
 * is pending. Pages are prefetched, so most navigations are instant and the
 * loader only shows on slow connections or cold routes.
 */
export function EntryLead() {
  const { pending } = useLinkStatus()
  return (
    <span className="entry-lead" data-pending={pending || undefined} aria-hidden>
      {pending ? <ScissorLoader className="size-full" /> : <GappedArrow className="size-full" />}
    </span>
  )
}
