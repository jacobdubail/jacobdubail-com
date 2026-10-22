import type { Redirect } from 'next/dist/lib/load-custom-routes'

/**
 * Permanent redirects from the old WordPress URLs so existing links and
 * search results keep working. Old posts lived at the site root
 * (/hello-again-world/), projects under /work/.
 */
export const legacyRedirects: Redirect[] = [
  { source: '/work', destination: '/projects', permanent: true },
  { source: '/work/:slug', destination: '/projects/:slug', permanent: true },
  { source: '/wordpress-services', destination: '/about', permanent: true },
  { source: '/contact', destination: '/about', permanent: true },
  { source: '/blog', destination: '/writing', permanent: true },
  { source: '/code', destination: '/writing', permanent: true },
  { source: '/category/:path*', destination: '/writing', permanent: true },
  { source: '/tag/:path*', destination: '/writing', permanent: true },
  { source: '/feed', destination: '/feed.xml', permanent: true },
  { source: '/hello-again-world', destination: '/writing/hello-again-world', permanent: true },
  {
    source: '/box-shadow-color-hack',
    destination: '/writing/box-shadow-color-hack',
    permanent: true,
  },
  { source: '/wp-admin', destination: '/admin', permanent: false },
]
