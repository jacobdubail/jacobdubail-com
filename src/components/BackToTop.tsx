import { GappedArrow } from './icons'

/**
 * Two mark shapes, two rules, so neither has an exception:
 *   the arrow (GappedArrow) is navigation and always carries tangerine —
 *     "All writing", "Previous", "Next", "Top"
 *   the split chevron is a mark and is neutral at rest, taking an accent
 *     only when it signals state — section labels, bullets, separators
 * Top was a chevron doing an arrow's job, which is why its colour kept
 * looking wrong next to one set or the other.
 */
export function BackToTop() {
  return (
    <a href="#top" className="tap group inline-flex items-center gap-1.5 hover:text-fg">
      Top
      <GappedArrow className="w-3.5 -rotate-90 text-orange transition-transform group-hover:-translate-y-0.5" />
    </a>
  )
}
