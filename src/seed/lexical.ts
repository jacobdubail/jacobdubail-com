/**
 * Tiny helpers for writing Lexical (Payload rich text) JSON by hand in seed data.
 */
type Node = Record<string, unknown>

const base = { direction: 'ltr', format: '', indent: 0, version: 1 }

export const text = (t: string, format = 0): Node => ({
  type: 'text',
  text: t,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

export const link = (label: string, url: string): Node => ({
  ...base,
  type: 'link',
  version: 3,
  fields: { linkType: 'custom', url, newTab: false },
  children: [text(label)],
})

type Inline = string | Node
const inline = (parts: Inline[]) => parts.map((p) => (typeof p === 'string' ? text(p) : p))

export const p = (...parts: Inline[]): Node => ({
  ...base,
  type: 'paragraph',
  textFormat: 0,
  textStyle: '',
  children: inline(parts),
})

export const h = (tag: 'h2' | 'h3' | 'h4', t: string): Node => ({
  ...base,
  type: 'heading',
  tag,
  children: [text(t)],
})

export const ul = (...items: string[]): Node => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((t, i) => ({ ...base, type: 'listitem', value: i + 1, children: [text(t)] })),
})

export const quote = (t: string): Node => ({ ...base, type: 'quote', children: [text(t)] })

export const hr = (): Node => ({ type: 'horizontalrule', version: 1 })

export const code = (language: string, source: string, caption?: string): Node => ({
  type: 'block',
  format: '',
  version: 2,
  fields: {
    id: Math.random().toString(36).slice(2, 12),
    blockName: '',
    blockType: 'code',
    language,
    code: source,
    caption,
  },
})

export const doc = (...children: Node[]) => ({
  root: { ...base, type: 'root', children },
})
