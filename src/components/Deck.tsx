/**
 * The sentence under the headline.
 *
 * --text-lg at full foreground, with the bio below it at --text-base
 * and --c-ink2. Two tiers, bigger and darker on top. For one round the
 * deck was the lighter of the two and the paragraph under it was both
 * smaller and darker, and all three reviewers read that as an inverted
 * hierarchy, which it was. One component, so no page can quietly set
 * its own: /about used to run this element in --c-mute at 1.6.
 */
export function Deck({ children }: { children?: string | null }) {
  if (!children) return null

  /* `pretty`, not `balance`. Balance pulled the deck in to 72% of the
     measure and set it in three near-equal lines directly above a body
     paragraph filling 94% — a short, even-edged block of lighter text
     over a ragged full-measure one is the shape of an epigraph, which
     is exactly what this deck kept being mistaken for. Measured at
     760px: 396/345/367 of 552 became 513/479/116. Above 1100px the two
     modes break identically, so this costs nothing where the deck
     already behaved. */
  return <p className="text-lg leading-normal text-pretty text-fg">{children}</p>
}
