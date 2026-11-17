import type { ReactNode } from 'react'

const NBSP = ' '

/**
 * Renders the hero headline with one word in azure and one in tangerine.
 *
 * The two hues come straight from the palette. The headline is display use
 * of the brand's colours rather than a third meaning, and the pair is tuned
 * to equal OKLab lightness AND chroma so neither word out-shouts the other.
 *
 * Each accent word is bound to the word before it with a non-breaking
 * space. Left to itself at 390px the line breaks land both accent words at
 * the start of a line, which reads as reflowed text rather than a set
 * headline, and no value of `text-wrap` fixes it — the phrase is simply
 * longer than the column. Binding the pair moves the break off the accent
 * so each coloured word closes a line instead of opening one.
 */
export function Headline({
  text,
  blue,
  orange,
}: {
  text: string
  blue?: string | null
  orange?: string | null
}) {
  const words = [blue, orange].filter(Boolean) as string[]
  if (!words.length) return <>{text}</>

  const pattern = new RegExp(
    `(\\S+\\s)?(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  )
  const parts: ReactNode[] = []
  let rest = text
  let key = 0
  for (;;) {
    const m = rest.match(pattern)
    if (!m || m.index === undefined) {
      parts.push(rest)
      break
    }
    const [whole, lead = '', word] = m
    parts.push(rest.slice(0, m.index))
    if (lead) parts.push(lead.replace(/\s$/, NBSP))
    parts.push(
      <span key={key++} className={word === blue ? 'headline-a' : 'headline-b'}>
        {word}
      </span>,
    )
    rest = rest.slice(m.index + whole.length)
  }
  return <>{parts}</>
}
