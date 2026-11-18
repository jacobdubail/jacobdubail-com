import { EmphasizedText } from './EmphasizedText'

/**
 * One row of selected work.
 *
 * Deliberately NOT the .entry row the writing and project indexes
 * used. An entry row sets a title and a date on one baseline because a
 * date is an index key there and the title is a link; here the date is
 * context, the description is doing real work, and nothing links
 * anywhere. So the date sits on the page's meta rail, level with the
 * title's x-height, where the section label above it also sits. Below
 * 720px there is no rail, so it becomes an eyebrow above the title,
 * which is what .entry already did below 600px and the only part of
 * that shape that was ever right for this content.
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
  /** Phrases already inside `description`. See EmphasizedText. */
  emphasis?: readonly string[]
  href?: string
}) {
  /* A value, not a render function: it is the same markup in both
     branches of one component, and pulling it into its own component
     would mean a second props type restating this one. */
  const body = (
    <>
      <span className="work-date">{meta}</span>
      <span className="work-body">
        <span className="work-title">{title}</span>
        {description ? (
          <span className="work-desc">
            <EmphasizedText text={description} phrases={emphasis} />
          </span>
        ) : null}
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
