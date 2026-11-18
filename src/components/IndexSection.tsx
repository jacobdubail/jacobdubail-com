import type { ReactNode } from 'react'

/**
 * Margin-index section: a sticky label in the left column, content on the right.
 * Below 720px the label becomes a slim sticky header above the list.
 *
 * Spacing is not passed in as a class. The stylesheet owns the rhythm so two
 * sibling sections can never end up spaced by two different mechanisms:
 *   default      two unlike lists, the largest break on the page
 *   group        sibling lists of the same kind (year groups, Now/Archive)
 *   lead         first section in a stack that does not follow a page header
 *
 * `flush` drops the rule that opens the list. It is for a section whose
 * content draws its own boundary — the contact card has a border, and a
 * hairline 4px above a bordered object is a second edge for one idea.
 */
export function IndexSection({
  label,
  aside,
  children,
  group,
  lead,
  flush,
}: {
  label: string
  aside?: ReactNode
  children: ReactNode
  group?: boolean
  lead?: boolean
  flush?: boolean
}) {
  const cls = ['index-section', group && 'is-group', lead && 'is-lead', flush && 'is-flush']
    .filter(Boolean)
    .join(' ')
  return (
    <section className={cls}>
      <h2 className="index-label">
        <span className="name">
          {label}
          <span className="chev" aria-hidden />
        </span>
        {aside}
      </h2>
      <div className="index-rows">{children}</div>
    </section>
  )
}
