import { cacheLife, cacheTag } from 'next/cache'

import { getPosts } from '@/lib/queries'
import { siteName, siteUrl } from '@/lib/site'
import { tags } from '@/lib/tags'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function buildFeed() {
  'use cache'
  cacheLife('max')
  cacheTag(tags.collection('posts'))
  const posts = await getPosts()
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${siteUrl}/writing/${p.slug}</link>
      <guid>${siteUrl}/writing/${p.slug}</guid>
      ${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''}
      ${p.excerpt ? `<description>${esc(p.excerpt)}</description>` : ''}
    </item>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteName)}</title>
    <link>${siteUrl}</link>
    <description>Writing on hiring, team process, and tooling.</description>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`
}

export async function GET() {
  return new Response(await buildFeed(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
