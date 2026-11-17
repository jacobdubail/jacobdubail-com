/**
 * Save a Markdown file as an UNPUBLISHED post (draft) in Payload.
 *
 *   pnpm draft drafts/my-post.md
 *
 * The file needs front matter:
 *
 *   ---
 *   title: The standup that ate my afternoon
 *   excerpt: One line for lists and the post intro.
 *   tags: [management, process]
 *   slug: standup-that-ate-my-afternoon   # optional, generated from the title
 *   ---
 *
 *   Body in Markdown...
 *
 * Re-running with the same slug updates the existing draft instead of creating a new one.
 * Nothing is ever published by this script; publish from the admin after review.
 * Targets whatever DATABASE_URL points at (local by default).
 */
import config from '@payload-config'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

const file = process.argv.find((a) => a.endsWith('.md'))
if (!file || !fs.existsSync(file)) {
  console.error('Usage: pnpm draft path/to/post.md')
  process.exit(1)
}

const raw = fs.readFileSync(file, 'utf8')
const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
if (!match) {
  console.error('Missing front matter (--- title: ... ---) at the top of the file')
  process.exit(1)
}

const meta: Record<string, string | string[]> = {}
for (const line of match[1].split('\n')) {
  const m = line.match(/^(\w+):\s*(.*?)\s*(#.*)?$/)
  if (!m) continue
  const [, key, value] = m
  meta[key] = value.startsWith('[')
    ? value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    : value.replace(/^['"]|['"]$/g, '')
}

const title = String(meta.title ?? '').trim()
if (!title) {
  console.error('Front matter needs a title')
  process.exit(1)
}
const slug =
  String(meta.slug ?? '').trim() ||
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
// Drop a leading "# Title" if the body repeats it
const body = match[2].replace(/^\s*#\s+.+\n+/, '')

const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: payload.config })
const content = convertMarkdownToLexical({ editorConfig, markdown: body })

const data = {
  title,
  slug,
  generateSlug: false,
  excerpt: meta.excerpt ? String(meta.excerpt) : undefined,
  tags: Array.isArray(meta.tags) ? meta.tags.map((t) => t.toLowerCase()) : undefined,
  content,
  archived: false,
  _status: 'draft' as const,
}

const existing = await payload.find({
  collection: 'posts',
  where: { slug: { equals: slug } },
  limit: 1,
  draft: true,
})

let id: number | string
if (existing.docs[0]) {
  if (existing.docs[0]._status === 'published') {
    console.error(`"${slug}" is already published. Change the slug or edit it in the admin.`)
    process.exit(1)
  }
  id = existing.docs[0].id
  await payload.update({ collection: 'posts', id, data: data as never, draft: true })
  payload.logger.info(`Updated draft "${title}"`)
} else {
  const doc = await payload.create({ collection: 'posts', data: data as never, draft: true })
  id = doc.id
  payload.logger.info(`Created draft "${title}"`)
}

const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3005'
console.log(`\nReview it: ${base}/admin/collections/posts/${id}  (from ${path.basename(file)})`)
process.exit(0)
