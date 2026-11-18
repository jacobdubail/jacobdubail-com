import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site'

/**
 * This file sits in the root of `app/` and not beside sitemap.ts in
 * `(frontend)/`, where it lived for its first eight months and served a
 * 404 the whole time.
 *
 * Next matches metadata files by path, and the two patterns do not
 * agree. `[\\/]sitemap(\.xml)$` is unanchored, so it finds a sitemap at
 * any depth, route group or not. `^[\\/]robots(\.txt)$` is anchored to
 * the app root, so `(frontend)/robots.ts` matches nothing. Both lines
 * are in node_modules/next/dist/lib/metadata/is-metadata-route.js.
 * Nothing warns: the file type-checks, lints, exports the right shape,
 * and never compiles into a route. The only symptom is a 404, and only
 * if someone asks for it.
 *
 * So: robots.ts and manifest stay at the root of `app/`. sitemap.ts may
 * live wherever it reads best, and does.
 *
 * Moving it out of the route group also means it no longer inherits
 * `(frontend)/layout.tsx`, which is correct and costs nothing — a route
 * handler never rendered that layout anyway.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    /* One rule for everybody, including the AI crawlers. Naming
       GPTBot, ClaudeBot and the rest in their own blocks would change
       nothing about what they are allowed to fetch, and it would date:
       a per-agent allowlist silently excludes whichever crawler ships
       next. The whole public site is one page and it wants reading.

       /admin is Payload's UI and /api is its REST and GraphQL surface.
       Neither returns anything a crawler can use, both cost a database
       round trip to answer, and /admin under an authenticated session
       is the one place on this origin where a URL is not public. */
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
