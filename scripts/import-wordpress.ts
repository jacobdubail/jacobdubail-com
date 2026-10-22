/**
 * Import posts and projects from a WordPress export (WXR) file.
 *
 *   1. In the old WP admin: Tools → Export → All content → Download Export File
 *   2. Save it as ./wordpress-export.xml (or pass a path)
 *   3. pnpm import:wordpress [path/to/export.xml]
 *
 * - Posts (post_type "post") → Writing, marked archived, slug kept so the
 *   redirects in redirects.ts line up.
 * - Projects (post_type "work" / "portfolio" / "project") → Projects, archived.
 * - Existing docs with the same slug are updated (re-runnable).
 * - Images inside post bodies are NOT downloaded yet (see ASSUMPTIONS.md).
 */
import config from '@payload-config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { XMLParser } from 'fast-xml-parser'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import path from 'path'
import { getPayload } from 'payload'

const file = path.resolve(process.argv.find((a) => a.endsWith('.xml')) ?? 'wordpress-export.xml')
if (!fs.existsSync(file)) {
  console.error(`WordPress export not found at ${file}`)
  process.exit(1)
}

type WPItem = {
  title?: string | number
  link?: string
  'content:encoded'?: string
  'excerpt:encoded'?: string
  'wp:post_name'?: string | number
  'wp:post_type'?: string
  'wp:status'?: string
  'wp:post_date_gmt'?: string
  category?:
    | { '#text'?: string; '@_domain'?: string; '@_nicename'?: string }[]
    | { '#text'?: string; '@_domain'?: string; '@_nicename'?: string }
}

const parser = new XMLParser({
  ignoreAttributes: false,
  cdataPropName: false,
  isArray: (name) => name === 'item',
})
const xml = parser.parse(fs.readFileSync(file, 'utf8'))
const items: WPItem[] = xml?.rss?.channel?.item ?? []

/** WordPress stores paragraphs as blank-line separated text; wrap them like wpautop does. */
function autop(html: string) {
  if (/<p[\s>]/i.test(html)) return html
  return html
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) =>
      /^<(h\d|ul|ol|pre|blockquote|div|figure|table|hr)/i.test(block)
        ? block
        : `<p>${block.replace(/\n/g, '<br>')}</p>`,
    )
    .join('\n')
}

const stripTags = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: payload.config })

let posts = 0
let projects = 0
for (const item of items) {
  const type = item['wp:post_type']
  if (item['wp:status'] !== 'publish') continue
  const isPost = type === 'post'
  const isProject = type === 'work' || type === 'portfolio' || type === 'project'
  if (!isPost && !isProject) continue

  const slug = String(item['wp:post_name'] ?? '').trim()
  const title = String(item.title ?? slug)
  if (!slug) continue

  const html = autop(String(item['content:encoded'] ?? ''))
  const content = convertHTMLToLexical({ editorConfig, html, JSDOM })
  const publishedAt = item['wp:post_date_gmt']
    ? new Date(item['wp:post_date_gmt'].replace(' ', 'T') + 'Z').toISOString()
    : undefined
  const cats = [item.category ?? []].flat()
  const tags = cats
    .filter((c) => c['@_domain'] === 'post_tag')
    .map((c) => String(c['@_nicename'] ?? c['#text'] ?? '').toLowerCase())
    .filter(Boolean)
  const excerpt = stripTags(String(item['excerpt:encoded'] ?? '')) || undefined

  const collection = isPost ? 'posts' : 'projects'
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    draft: true,
  })

  const data = isPost
    ? {
        title,
        slug,
        content,
        publishedAt,
        tags,
        archived: true,
        originalUrl: item.link,
        generateSlug: false,
        _status: 'published',
        ...(excerpt ? { excerpt } : {}),
      }
    : {
        title,
        slug,
        content,
        archived: true,
        generateSlug: false,
        _status: 'published',
        ...(publishedAt ? { year: new Date(publishedAt).getUTCFullYear() } : {}),
      }

  if (existing.docs[0]) {
    await payload.update({ collection, id: existing.docs[0].id, data: data as never })
  } else {
    if (!isPost && !('year' in data)) continue
    await payload.create({ collection, data: data as never })
  }
  if (isPost) posts++
  else projects++
  payload.logger.info(`${collection}: ${slug}`)
}

payload.logger.info(`Imported ${posts} posts and ${projects} projects from ${path.basename(file)}`)
process.exit(0)
