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
