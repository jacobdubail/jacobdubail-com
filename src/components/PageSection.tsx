import type { ReactNode } from 'react'

/**
 * A section of the card: a label on the rail, a rule across both
 * columns, then the rows.
 *
 * This is NOT IndexSection. The index pages hang their label in a 176px
 * margin and that component stays exactly as it was, because restoring
 * /writing is meant to be a matter of restoring routes.
 *
 * Every section takes a label and therefore a rule. The variant that
 * dropped the rule is gone: a page where some sections open with a line
 * and others do not is not a system, it is three decisions.
 *
 * The rule spans both columns on purpose — see the .section-rule
 * comment. A rule that runs past the text it belongs to is an editorial
 * device only while something lives in the overhang; for one round
 * nothing did, and 256px of every rule on the page had nothing
 * underneath it.
 *
 * Spacing is still the stylesheet's, not a prop. `lead` is the first
 * section after the page header; everything after it takes the group
 * step.
 */
export function PageSection({
  label,
  id,
  children,
  lead,
}: {
  label: string
  /** Anchor target, so the letterhead can link to it. */
  id?: string
  children: ReactNode
  lead?: boolean
}) {
  return (
    <section
      id={id}
      /* Joined, not interpolated. prettier-plugin-tailwindcss sorts the
         classes inside a template literal and ate the leading space off
         ` is-lead`, which shipped `page-sectionis-lead` — a class that
         matches nothing, in a file that formats on every commit. */
      className={['rail-row', 'page-section', lead && 'is-lead'].filter(Boolean).join(' ')}
    >
      <h2 className="section-label">
        {label}
        <span className="chev" aria-hidden />
      </h2>
      <div className="section-rule" />
      {/* Column 2, under the rule. The rows inside set their own rail
          cells, so a work row's date and this label share one edge. */}
      <div className="section-body">{children}</div>
    </section>
  )
}
