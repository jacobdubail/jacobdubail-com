import 'server-only'

import config from '@payload-config'
import { cacheLife, cacheTag } from 'next/cache'
import { getPayload } from 'payload'

import type { About, Post, Project, SiteSetting } from '@/payload-types'

import { tags } from './tags'

/**
 * All reads go through 'use cache' functions tagged by collection/doc.
 * Payload's afterChange hooks (src/hooks/revalidate.ts) call revalidateTag()
 * with the same tags, so pages stay fully static until content changes.
 *
 * overrideAccess: false + no user means only published documents are returned.
 */
const payload = () => getPayload({ config })

export type PostListItem = Pick<
  Post,
  'id' | 'title' | 'slug' | 'excerpt' | 'publishedAt' | 'archived' | 'tags'
>
export type ProjectListItem = Pick<
  Project,
  'id' | 'title' | 'slug' | 'summary' | 'year' | 'archived' | 'ongoing'
>

export async function getSettings(): Promise<SiteSetting> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.global('site-settings'))
  return (await payload()).findGlobal({ slug: 'site-settings', depth: 0 })
}

export async function getAbout(): Promise<About> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.global('about'))
  return (await payload()).findGlobal({ slug: 'about', depth: 1 })
}

export async function getPosts(): Promise<PostListItem[]> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.collection('posts'))
  const { docs } = await (
    await payload()
  ).find({
    collection: 'posts',
    overrideAccess: false,
    draft: false,
    limit: 500,
    pagination: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      archived: true,
      tags: true,
    },
  })
  return docs as PostListItem[]
}

export async function getPost(slug: string): Promise<Post | null> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.collection('posts'), tags.doc('posts', slug))
  const { docs } = await (
    await payload()
  ).find({
    collection: 'posts',
    overrideAccess: false,
    draft: false,
    limit: 1,
    pagination: false,
    depth: 2,
    where: { slug: { equals: slug } },
  })
  return docs[0] ?? null
}

export async function getProjects(): Promise<ProjectListItem[]> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.collection('projects'))
  const { docs } = await (
    await payload()
  ).find({
    collection: 'projects',
    overrideAccess: false,
    draft: false,
    limit: 500,
    pagination: false,
    sort: ['-year', 'title'],
    select: { title: true, slug: true, summary: true, year: true, archived: true, ongoing: true },
  })
  return docs as ProjectListItem[]
}

export async function getProject(slug: string): Promise<Project | null> {
  'use cache'
  cacheLife('max')
  cacheTag(tags.collection('projects'), tags.doc('projects', slug))
  const { docs } = await (
    await payload()
  ).find({
    collection: 'projects',
    overrideAccess: false,
    draft: false,
    limit: 1,
    pagination: false,
    depth: 2,
    where: { slug: { equals: slug } },
  })
  return docs[0] ?? null
}
