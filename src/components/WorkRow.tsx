import type { ReactNode } from 'react'

/**
 * One row of selected work.
 *
 * Deliberately NOT the .entry row the writing and project indexes used.
 * An entry row sets a title and a date on one baseline because a date is
 * an index key there and the title is a link; here the date is context,
 * the description is doing real work, and nothing links anywhere. So the
 * date sits on the page's meta rail, level with the title's x-height,
 * where the section label above it also sits. Below 720px there is no
 * rail, so it becomes an eyebrow above the title — which is what .entry
 * already did below 600px, and the only part of that shape that was ever
 * right for this content.
 *
 * .entry and its styles are left in globals.css untouched, because
 * restoring /writing is meant to be a matter of restoring routes.
 *
 * `href` is still honoured: a row with a destination is an <a>, a row
 * without one is a <div>. An affordance that promises somewhere to go
 * and has nowhere is worse than no affordance, which is also why the
 * hover colour is gated on the element being a link.
 */
export function WorkRow({
  title,
  meta,
  description,
  emphasis,
  href,
}: {
  title: string
  /** The eyebrow: a year, a range, "Ongoing". */
  meta: string
  description?: string
  /** Phrases already inside `description`. See mark() and card.ts. */
  emphasis?: readonly string[]
  href?: string
}) {
  const body = (
    <>
      <span className="work-date">{meta}</span>
      <span className="work-body">
        <span className="work-title">{title}</span>
        {description ? <span className="work-desc">{mark(description, emphasis)}</span> : null}
      </span>
    </>
  )

  if (!href) return <div className="work">{body}</div>
  return (
    <a className="work work-link" href={href}>
      {body}
    </a>
  )
}

/**
 * Wraps each `emphasis` phrase where it occurs in `text`, and leaves the
 * text otherwise exactly as written.
 *
 * A phrase that is not in the sentence is dropped in silence rather than
 * appended, inserted or warned about. That is the contract that makes
 * this safe to use on biographical copy: the emphasis list can only ever
 * change how a sentence is set, never what it says. The same rule
 * Headline.tsx keeps for the two accent words.
 *
 * First occurrence only, and the phrases are applied longest-first so a
 * phrase contained inside another cannot steal its match.
 */
function mark(text: string, emphasis?: readonly string[]): ReactNode {
  if (!emphasis?.length) return text
  const phrases = [...emphasis].sort((a, b) => b.length - a.length)

  let nodes: ReactNode[] = [text]
  for (const phrase of phrases) {
    const next: ReactNode[] = []
    let done = false
    for (const node of nodes) {
      if (done || typeof node !== 'string') {
        next.push(node)
        continue
      }
      const at = node.indexOf(phrase)
      if (at === -1) {
        next.push(node)
        continue
      }
      next.push(
        node.slice(0, at),
        /* The spaces inside the phrase become non-breaking. A marked
           phrase is one object to the eye, and "WCAG 2.1 / AA" or
           "React / Server Components" broken across two lines is two —
           which defeats the only reason the phrase is marked. The text
           is unchanged; U+00A0 renders identically to a space. */
        <strong key={phrase} className="work-em">
          {phrase.replace(/ /g, '\u00a0')}
        </strong>,
        node.slice(at + phrase.length),
      )
      done = true
    }
    nodes = next
  }
  return nodes.filter((n) => n !== '')
}
