import type { MetadataRoute } from 'next'

import { getPosts, getProjects } from '@/lib/queries'
import { siteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()])
  return [
    { url: siteUrl },
    { url: `${siteUrl}/writing` },
    { url: `${siteUrl}/projects` },
    { url: `${siteUrl}/about` },
    ...posts.map((p) => ({
      url: `${siteUrl}/writing/${p.slug}`,
      lastModified: p.publishedAt ?? undefined,
    })),
    ...projects.map((p) => ({ url: `${siteUrl}/projects/${p.slug}` })),
  ]
}
