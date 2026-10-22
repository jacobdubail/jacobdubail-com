'use client'

import { useMemo, useState } from 'react'

import { EntryRow } from '@/components/EntryRow'
import { IndexSection } from '@/components/IndexSection'
import { listDate, year } from '@/lib/format'
import type { PostListItem } from '@/lib/queries'

/**
 * Filtering happens on the client so the page stays fully static
 * (no searchParams read on the server).
 */
export function WritingIndex({ posts }: { posts: PostListItem[] }) {
  const [tag, setTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const counts = new Map<string, number>()
    posts.forEach((p) => p.tags?.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
  }, [posts])

  const groups = useMemo(() => {
    const visible = tag ? posts.filter((p) => p.tags?.includes(tag)) : posts
    const byYear = new Map<number, PostListItem[]>()
    visible.forEach((p) => {
      const y = year(p.publishedAt) ?? 0
      byYear.set(y, [...(byYear.get(y) ?? []), p])
    })
    return [...byYear.entries()].sort((a, b) => b[0] - a[0])
  }, [posts, tag])

  return (
    <>
      {allTags.length ? (
        <div
          className="index-offset mt-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by tag"
        >
          {[null, ...allTags].map((t) => (
            <button
              key={t ?? 'all'}
              type="button"
              onClick={() => setTag(t)}
              aria-pressed={tag === t}
              className="cursor-pointer rounded-full border border-line px-3 py-1 text-xs text-mute hover:border-faint aria-pressed:border-fg aria-pressed:bg-fg aria-pressed:text-bg"
            >
              {t ?? 'All'}
            </button>
          ))}
        </div>
      ) : null}

      {groups.map(([y, items], i) => (
        <IndexSection key={y} label={String(y)} className={i === 0 ? 'mt-16' : 'mt-12'}>
          {items.map((p) => (
            <EntryRow
              key={p.id}
              href={`/writing/${p.slug}`}
              vtKey={`posts-${p.slug}`}
              title={p.title}
              date={listDate(p.publishedAt, p.archived)}
              description={p.excerpt}
              archived={p.archived}
            />
          ))}
        </IndexSection>
      ))}

      {groups.length === 0 ? (
        <p className="index-offset mt-16 text-mute">Nothing here yet.</p>
      ) : null}
    </>
  )
}
