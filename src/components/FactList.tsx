export type Fact = {
  term: string
  /** A list sets one item per line. See card.ts. */
  value: string | string[]
}

/**
 * The facts rail: the lines under the portrait.
 *
 * This is the screening decision delivered in a glance — role, scale,
 * location, availability are what a recruiter filters on, and a
 * 20-second scan of headline, paragraphs and titles never produced
 * them.
 *
 * A fact with no value is a row nobody filled in, not a blank line, so
 * it does not render. An empty list renders nothing at all rather than
 * an empty <dl>.
 */
export function FactList({ facts }: { facts: readonly Fact[] }) {
  const filled = facts.filter((f) => f.value)
  if (!filled.length) return null

  return (
    <dl className="facts">
      {filled.map((f) => (
        <div key={f.term}>
          <dt>{f.term}</dt>
          {/* One line per item: a middot can only break after itself,
              so a wrapped value leaves the separator hanging off the
              line end in a 208px rail. */}
          {(Array.isArray(f.value) ? f.value : [f.value]).map((v) => (
            <dd key={v}>{v}</dd>
          ))}
        </div>
      ))}
    </dl>
  )
}
