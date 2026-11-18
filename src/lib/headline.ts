/**
 * Splits the headline into plain runs and the two accent words.
 *
 * This lives apart from Headline.tsx because two renderers need the
 * same answer and neither can use the other's markup. The page wraps
 * each accent in a class and lets the stylesheet pick the hue, which
 * is how the accents stay bound to --c-act and --c-sys and flip with
 * the theme. The Open Graph card has no stylesheet, no theme and no
 * cascade: Satori reads inline styles and renders one fixed image. A
 * shared component would have to take a render prop to serve both,
 * and the split is not a component — it is a string operation with an
 * opinion about line breaks.
 *
 * THE OPINION: each accent word is bound to the word before it with a
 * non-breaking space. Left alone at 390px the breaks land both accent
 * words at the start of a line, which reads as reflowed text rather
 * than as a set headline, and no value of `text-wrap` fixes it —
 * the phrase is simply longer than the column. Binding the pair moves
 * the break off the accent so each coloured word closes a line
 * instead of opening one.
 *
 * Only the first occurrence of each word is marked, and a word that
 * does not appear in the text verbatim is ignored without a word. Both
 * are deliberate: the accents are display colour on a known sentence,
 * not a search-and-highlight, and a silent miss is better than a
 * headline that paints every "systems" in a sentence that has two.
 */

const NBSP = ' '

export type HeadlineRun = {
  text: string
  /** 'a' is the first word (azure, --c-sys), 'b' the second
      (tangerine, --c-act). null is ordinary text. */
  accent: 'a' | 'b' | null
}

export function splitHeadline(
  text: string,
  blue?: string | null,
  orange?: string | null,
): HeadlineRun[] {
  const words = [blue, orange].filter(Boolean) as string[]
  if (!words.length) return [{ text, accent: null }]

  const pattern = new RegExp(
    `(\\S+\\s)?(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  )
  const runs: HeadlineRun[] = []
  let rest = text
  for (;;) {
    const m = rest.match(pattern)
    if (!m || m.index === undefined) {
      runs.push({ text: rest, accent: null })
      break
    }
    const [whole, lead = '', word] = m
    runs.push({ text: rest.slice(0, m.index), accent: null })
    if (lead) runs.push({ text: lead.replace(/\s$/, NBSP), accent: null })
    runs.push({ text: word, accent: word === blue ? 'a' : 'b' })
    rest = rest.slice(m.index + whole.length)
  }
  return runs
}
