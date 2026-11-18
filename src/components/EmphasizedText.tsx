import type { ReactNode } from 'react'

/**
 * Renders `text` with each phrase in `phrases` wrapped, and the text
 * otherwise exactly as written.
 *
 * A phrase that is not in the sentence is dropped in silence rather
 * than appended, inserted or warned about. That is the contract that
 * makes this safe to point at biographical copy: the list can only
 * ever change how a sentence is set, never what it says. Headline.tsx
 * keeps the same rule for the two accent words.
 *
 * First occurrence only, and phrases apply longest-first so a phrase
 * contained inside another cannot steal its match.
 *
 * This was a `mark()` helper inside WorkRow that returned JSX. A
 * function returning JSX is a component with the tooling taken away:
 * it cannot be rendered on its own, tested on its own, or reused
 * without importing the file that happens to host it.
 */
export function EmphasizedText({
  text,
  phrases,
}: {
  text: string
  /** Phrases already present in `text`. See card.ts. */
  phrases?: readonly string[]
}) {
  if (!phrases?.length) return <>{text}</>

  const longestFirst = [...phrases].sort((a, b) => b.length - a.length)
  let nodes: ReactNode[] = [text]

  for (const phrase of longestFirst) {
    const next: ReactNode[] = []
    let done = false
    for (const node of nodes) {
      if (done || typeof node !== 'string') {
        next.push(node)
        continue
      }
      const at = node.indexOf(phrase)
      if (at === -1) {
        next.push(node)
        continue
      }
      next.push(
        node.slice(0, at),
        /* The spaces inside the phrase become non-breaking. A marked
           phrase is one object to the eye, and "WCAG 2.1 / AA" or
           "React / Server Components" broken across two lines is two,
           which defeats the only reason the phrase is marked. The text
           is unchanged; U+00A0 renders identically to a space. */
        <strong key={phrase} className="work-em">
          {phrase.replace(/ /g, ' ')}
        </strong>,
        node.slice(at + phrase.length),
      )
      done = true
    }
    nodes = next
  }

  return <>{nodes.filter((n) => n !== '')}</>
}
