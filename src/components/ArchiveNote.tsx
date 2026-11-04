import type { ReactNode } from 'react'

/**
 * The azure left rule is the one place a content element uses the system
 * accent: this is the site talking about the content rather than the
 * content itself. Both detail routes render it from here so the two cannot
 * drift apart in radius, padding or rhythm.
 */
export function ArchiveNote({ children }: { children: ReactNode }) {
  return (
    <aside className="mb-[var(--gap-art-block)] rounded-r-[var(--r-sm)] border-l-2 border-blue bg-soft px-4 py-3.5 text-sm leading-[1.55] text-pretty text-mute">
      {children}
    </aside>
  )
}
