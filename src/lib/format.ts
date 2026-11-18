const monthYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const fullDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "Oct 2026" for recent posts, "2013" for archived ones (matches the design). */
export function listDate(iso?: string | null, archived?: boolean | null) {
  if (!iso) return ''
  const d = new Date(iso)
  return archived ? String(d.getUTCFullYear()) : monthYear.format(d)
}

export function longDate(iso?: string | null, archived?: boolean | null) {
  if (!iso) return ''
  const d = new Date(iso)
  return archived ? fullDate.format(d) : monthYear.format(d)
}

export function year(iso?: string | null) {
  return iso ? new Date(iso).getUTCFullYear() : undefined
}

type LexicalNode = { text?: string; children?: LexicalNode[] }

/** Rough reading time from Lexical JSON (~230 wpm). */
export function readingTime(content: unknown): number {
  let words = 0
  const walk = (n?: LexicalNode) => {
    if (!n) return
    if (typeof n.text === 'string') words += n.text.trim().split(/\s+/).filter(Boolean).length
    n.children?.forEach(walk)
  }
  walk((content as { root?: LexicalNode })?.root)
  return Math.max(1, Math.round(words / 230))
}

/**
 * Copy with its typography taken back out, for readers that do not
 * render it.
 *
 * The visible page sets "hands‑on" with a non-breaking hyphen and
 * binds the headline's accent words with non-breaking spaces, because
 * both control where a line may break in a 390px column. A meta
 * description has no column. Neither does a JSON-LD string or a
 * Markdown file, and in all three the character stops being invisible
 * and starts being a mismatch: U+2011 is not the hyphen anyone types,
 * so "hands-on" no longer matches the page that claims it.
 *
 * So the rule is the boundary, not the string — card.ts keeps the
 * typography and every machine-readable surface strips it on the way
 * out.
 */
export function plainText(s: string) {
  /* Written as escapes on purpose. A literal non-breaking space
     inside a character class is invisible in a diff and in a code
     review, and the next person to touch this line cannot see what
     it matches. */
  return s.replace(/\u2011/g, '-').replace(/[\u00a0\u202f]/g, ' ')
}
