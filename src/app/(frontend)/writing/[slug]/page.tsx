import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'

import { GappedArrow } from '@/components/icons'
import { RichText } from '@/components/RichText'
import { longDate, readingTime } from '@/lib/format'
import { getPost, getPosts } from '@/lib/queries'

/**
 * Blocking on purpose: every published slug is prerendered, and rendering the
 * header in the same commit as the navigation is what lets the title and date
 * morph from the list (React <ViewTransition>). A Suspense boundary around
 * params would give an instant shell but break the shared-element morph.
 */
export const instant = false

export async function generateStaticParams() {
  const posts = await getPosts()
  // Cache Components requires at least one param; an empty DB (first deploy) would fail the build.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: '_' }]
}

export async function generateMetadata({
  params,
}: PageProps<'/writing/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  const ogImage = typeof post.meta?.image === 'object' ? post.meta?.image?.url : undefined
  return {
    title: post.meta?.title?.replace(/ · Jacob Dubail$/, '') || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default function PostPage({ params }: PageProps<'/writing/[slug]'>) {
  return (
    <article className="article">
      <Link
        href="/writing"
        className="tap group mb-12 inline-flex items-center gap-2 text-sm text-mute hover:text-fg"
      >
        <GappedArrow className="w-3.5 -scale-x-100 text-orange transition-transform group-hover:-translate-x-[3px]" />
        All writing
      </Link>
      <Post params={params} />
    </article>
  )
}

async function Post({ params }: Pick<PageProps<'/writing/[slug]'>, 'params'>) {
  const { slug } = await params
  const [post, posts] = await Promise.all([getPost(slug), getPosts()])
  if (!post) notFound()

  const i = posts.findIndex((p) => p.slug === post.slug)
  const newer = i > 0 ? posts[i - 1] : undefined
  const older = i >= 0 ? posts[i + 1] : undefined
  const vtKey = `posts-${post.slug}`

  return (
    <>
      <ViewTransition name={`date-${vtKey}`} share="morph" default="none">
        <p className="article-meta text-xs leading-[1.5] text-faint tabular-nums">
          <time dateTime={post.publishedAt ?? undefined}>
            {longDate(post.publishedAt, post.archived)}
          </time>
          <span className="max-md:before:content-['_·_'] md:block">
            {readingTime(post.content)} min read
          </span>
        </p>
      </ViewTransition>
      <ViewTransition name={`title-${vtKey}`} share="morph" default="none">
        <h1 className="w-fit font-serif text-display font-normal tracking-[-0.02em]">
          {post.title}
        </h1>
      </ViewTransition>

      {post.tags?.length ? (
        <ul className="mt-5 mb-8 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mb-8" />
      )}

      {post.archived ? (
        <aside className="mb-8 rounded-r-[var(--r-sm)] border-l-2 border-blue bg-soft px-4 py-3.5 text-sm leading-[1.55] text-mute">
          <b className="font-medium text-fg">From the archive.</b> Originally published{' '}
          {longDate(post.publishedAt, true)} on the previous version of this site. Some details may
          be dated.
        </aside>
      ) : null}

      {post.excerpt ? (
        <p className="mb-12 text-md leading-[1.55] text-ink2">{post.excerpt}</p>
      ) : null}
      <RichText data={post.content} />

      {newer || older ? (
        <nav
          aria-label="More writing"
          className={`spans mt-16 grid gap-4 border-t border-line pt-7 max-sm:grid-cols-1 max-sm:gap-6 ${
            newer && older ? 'grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {older ? (
            <Link
              href={`/writing/${older.slug}`}
              className="group flex flex-col gap-1 hover:text-orange-text"
            >
              <small className="inline-flex items-center gap-1.5 text-xs text-faint">
                <GappedArrow className="w-[11px] -scale-x-100 text-orange" /> Previous
              </small>
              <span className="font-serif text-md leading-[1.35] tracking-[-0.01em] text-balance">
                {older.title}
              </span>
            </Link>
          ) : null}
          {newer ? (
            <Link
              href={`/writing/${newer.slug}`}
              className="flex flex-col items-end gap-1 text-right hover:text-orange-text max-sm:items-start max-sm:text-left"
            >
              <small className="inline-flex items-center gap-1.5 text-xs text-faint">
                Next <GappedArrow className="w-[11px] text-orange" />
              </small>
              <span className="font-serif text-md leading-[1.35] tracking-[-0.01em] text-balance">
                {newer.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  )
}
