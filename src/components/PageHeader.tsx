import type { ReactNode } from 'react'

/**
 * The card's opening block: headline, then the rail and the measure.
 *
 * Structure only. Every part below owns exactly one element and its
 * classes, and none of them takes a `className`, so a caller can place
 * content in the grid without being able to restyle it. That was the
 * job the old slot props were doing — `title`, `intro`, `portrait` and
 * `facts` arrived as ReactNode and this component positioned them —
 * and it cost the page a contract it could not read: `intro` was data
 * the component rendered, while `portrait` was finished JSX it only
 * placed. One signature, two meanings, and no way to tell which from
 * the prop name.
 *
 * The parts are plain children now. The grid cells are still private.
 */
export function PageHeader({ children }: { children: ReactNode }) {
  return <div className="page-header">{children}</div>
}

PageHeader.Title = function PageHeaderTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-serif text-display font-normal tracking-[-0.022em] text-balance">
      {children}
    </h1>
  )
}

/**
 * Three cells, two columns. The portrait takes row one of the rail and
 * the facts take row two, while the text spans both — so the facts
 * begin under the portrait rather than under a 400px paragraph. Below
 * 720px the rail dissolves (display: contents) and the portrait floats
 * into the text it was beside, with the facts falling after the bio.
 * That order is why this is three cells and not two: stacked, a role
 * line sitting directly above a deck that opens with the same two
 * words reads as a stutter.
 */
PageHeader.Grid = function PageHeaderGrid({ children }: { children: ReactNode }) {
  return <div className="rail-row hero-row mt-8">{children}</div>
}

/** Top of the rail, beside the deck. */
PageHeader.Rail = function PageHeaderRail({ children }: { children?: ReactNode }) {
  return <div className="hero-rail">{children}</div>
}

PageHeader.Main = function PageHeaderMain({ children }: { children: ReactNode }) {
  return <div className="hero-main">{children}</div>
}

/** Under the portrait on the rail; after the bio on a phone. */
PageHeader.Facts = function PageHeaderFacts({ children }: { children?: ReactNode }) {
  return <div className="hero-facts">{children}</div>
}
