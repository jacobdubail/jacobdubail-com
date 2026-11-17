import type { Redirect } from 'next/dist/lib/load-custom-routes'

/**
 * Everything that is not the card points at the card.
 *
 * All of these are TEMPORARY (307) on purpose, including the WordPress
 * ones that used to be permanent. A 308 is cached by the browser
 * indefinitely and is not re-checked, so a permanent redirect written
 * during a temporary pivot would still be sending readers to the home
 * page months after /writing comes back, with no request reaching the
 * server to correct it. The cost of 307 is one extra round trip on a URL
 * almost nobody visits.
 *
 * The redirects this file shipped BEFORE this pivot were permanent, so a
 * browser that already followed /work/:slug has 308 cached and will go
 * straight to /projects/:slug without asking — that one lands on the 404
 * page until the project routes come back. Nothing can be done about an
 * already-cached 308 from here; it is the reason these are 307.
 */
export const legacyRedirects: Redirect[] = [
  // Routes that existed on this site until the pivot.
  { source: '/writing', destination: '/', permanent: false },
  { source: '/writing/:path*', destination: '/', permanent: false },
  { source: '/projects', destination: '/', permanent: false },
  { source: '/projects/:path*', destination: '/', permanent: false },
  { source: '/about', destination: '/', permanent: false },
  { source: '/feed.xml', destination: '/', permanent: false },

  // Old WordPress URLs. Posts lived at the site root, projects under /work/.
  { source: '/work', destination: '/', permanent: false },
  { source: '/work/:slug', destination: '/', permanent: false },
  { source: '/wordpress-services', destination: '/', permanent: false },
  { source: '/contact', destination: '/', permanent: false },
  { source: '/blog', destination: '/', permanent: false },
  { source: '/code', destination: '/', permanent: false },
  { source: '/category/:path*', destination: '/', permanent: false },
  { source: '/tag/:path*', destination: '/', permanent: false },
  { source: '/feed', destination: '/', permanent: false },
  { source: '/hello-again-world', destination: '/', permanent: false },
  { source: '/box-shadow-color-hack', destination: '/', permanent: false },

  { source: '/wp-admin', destination: '/admin', permanent: false },
]
