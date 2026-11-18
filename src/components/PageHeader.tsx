import type { ReactNode } from 'react'

/**
 * The card's opening block: headline, then the rail and the measure.
 *
 * The headline spans both columns and has nothing beside it. Under it
 * the page splits into the grid it keeps all the way down — portrait
 * and facts on the 208px rail, deck and bio in the 608px measure.
 *
 * One component, so a page cannot quietly invent its own deck
 * treatment. About used to set its intro in --c-mute at 1.6, two steps
 * lighter and looser than the identical element on the home page, which
 * made it read as a detached epigraph rather than the page's opening
 * sentence.
 *
 * The deck is --text-lg at full foreground, and the bio below it is
 * --text-base at --c-ink2. Two tiers, bigger and darker on top. For one
 * round the deck was the lighter of the two and the paragraph under it
 * was both smaller and darker, and all three reviewers read that as an
 * inverted hierarchy — which it was.
 */
export function PageHeader({
  title,
  intro,
  portrait,
  facts,
  children,
}: {
  title: ReactNode
  intro?: string | null
  /** Top of the rail, beside the deck. */
  portrait?: ReactNode
  /** Under the portrait on the rail; after the bio on a phone. */
  facts?: ReactNode
  /** The bio, in the measure, under the deck. */
  children?: ReactNode
}) {
  return (
    <div className="page-header">
      <h1 className="font-serif text-display font-normal tracking-[-0.022em] text-balance">
        {title}
      </h1>
      {/* Three cells, two columns. The portrait takes row one of the
          rail and the facts take row two, while the text spans both —
          so the facts begin under the portrait rather than under a
          400px paragraph. Below 720px the rail dissolves (display:
          contents) and the portrait floats into the text it was beside,
          with the facts falling after the bio. That order is why this
          is three cells and not two: stacked, a role line sitting
          directly above a deck that opens with the same two words reads
          as a stutter. */}
      <div className="rail-row hero-row mt-8">
        <div className="hero-rail">{portrait}</div>
        <div className="hero-main">
          {/* `pretty`, not `balance`. Balance pulled the deck in to 72%
              of the measure and set it in three near-equal lines
              directly above a body paragraph filling 94% — a short,
              even-edged block of lighter text over a ragged full-measure
              one is the shape of an epigraph, which is exactly what this
              deck kept being mistaken for. Measured at 760px:
              396/345/367 of 552 became 513/479/116. Above 1100px the two
              modes break identically, so this costs nothing where the
              deck already behaved. */}
          {intro ? <p className="text-lg leading-[1.5] text-pretty text-fg">{intro}</p> : null}
          {children}
        </div>
        <div className="hero-facts">{facts}</div>
      </div>
    </div>
  )
}
