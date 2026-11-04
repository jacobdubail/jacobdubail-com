import type { ReactNode } from 'react'

/**
 * Every page's title block. One component, so a page cannot quietly
 * invent its own deck treatment — About used to set its intro in
 * --c-mute at 1.6, two steps lighter and looser than the identical
 * element on the home page, which made it read as a detached epigraph
 * rather than the page's opening sentence.
 *
 * `mark` is an optional image for the gutter — the same column an index
 * label and an article's date occupy. It hangs there rather than
 * sitting beside the title, because a 96px portrait in the flow would
 * push the h1 a hundred pixels right of every other h1 on the site and
 * break the one left edge the layout is built on.
 */
export function PageHeader({
  title,
  intro,
  mark,
}: {
  title: ReactNode
  intro?: string | null
  mark?: ReactNode
}) {
  const body = (
    <>
      <h1 className="w-fit font-serif text-display font-normal tracking-[-0.02em]">{title}</h1>
      {/* `pretty`, not `balance`. Balance pulled the deck in to 72% of
          the measure and set it in three near-equal lines directly above
          a body paragraph filling 94% — a short, even-edged block of
          lighter text over a ragged full-measure one is the shape of an
          epigraph, which is exactly what this deck kept being mistaken
          for. Measured at 760px: 396/345/367 of 552 became 513/479/116.
          Above 1100px the two modes break identically, so this costs
          nothing where the deck already behaved. */}
      {intro ? <p className="mt-4 text-md leading-[1.55] text-pretty text-ink2">{intro}</p> : null}
    </>
  )
  if (!mark) return <div className="page-header index-offset">{body}</div>
  return (
    <div className="page-header page-header-marked">
      <div className="page-mark">{mark}</div>
      <div>{body}</div>
    </div>
  )
}
