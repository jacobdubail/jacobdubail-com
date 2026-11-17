import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site'

/** One page, one entry. The lists come back here when they come back. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl }]
}
