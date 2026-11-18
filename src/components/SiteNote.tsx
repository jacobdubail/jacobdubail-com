import type { ReactNode } from 'react'

/**
 * The note about this page, on the standard rail row.
 *
 * It sits above Contact and at body size. It spent the first round in
 * the smallest, faintest type on the page, last, under the contact
 * block, and all three reviewers of that round independently called it
 * the most distinctive thing here for an engineering reader. Burying
 * your only differentiator in the fine print is a hierarchy decision,
 * and it was the wrong one.
 */
export function SiteNote({ children }: { children: ReactNode }) {
  return <div className="rail-row pt-5">{children}</div>
}

/**
 * The rail cell beside the note. Every other band of the page puts
 * something in the 208px column — a portrait, a date, a platform — and
 * this was the one section that left it empty for its full height,
 * which all three reviewers of the third pass read as unfinished
 * rather than as restraint.
 */
SiteNote.Meta = function SiteNoteMeta({ term, value }: { term: string; value: string }) {
  return (
    <dl className="facts facts-flush">
      <div>
        <dt>{term}</dt>
        <dd>{value}</dd>
      </div>
    </dl>
  )
}

SiteNote.Text = function SiteNoteText({ children }: { children?: string | null }) {
  if (!children) return null
  return <p className="site-note">{children}</p>
}
