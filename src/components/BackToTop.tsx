import { GappedArrow } from './icons'

/**
 * Two mark shapes, two rules, so neither has an exception:
 *   the arrow (GappedArrow) is navigation and always carries tangerine —
 *     "All writing", "Previous", "Next", "Top"
 *   the split chevron is a mark and is neutral at rest, taking an accent
 *     only when it signals state — section labels, bullets, separators
 * Top was a chevron doing an arrow's job, which is why its colour kept
 * looking wrong next to one set or the other.
 *
 * It takes the same bordered shape as the theme switch beside it. Two
 * adjacent controls at two levels of affordance — one a pill, one a
 * bare word — is a difference with nothing behind it.
 */
export function BackToTop() {
  return (
    <a href="#top" className="toggle group">
      Top
      <GappedArrow className="mark-act w-3.5 -rotate-90 transition-transform group-hover:-translate-y-0.5" />
    </a>
  )
}
