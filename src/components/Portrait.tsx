/* eslint-disable @next/next/no-img-element -- Plain <img>, not
   next/image: the source is a static file of a known size, the page
   prerenders with no loader, and an optimiser endpoint is a server
   round trip on a route whose entire claim is that it needs none. */
import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * The portrait on the rail, or nothing.
 *
 * The file is checked on disk at build rather than trusted. A path in
 * content that no file answers renders a broken image on the one page
 * a stranger judges you by, and nothing warns about it: next/image
 * would throw at request time, a bare <img> would show the alt text in
 * a 208px box. Checking here means the rail holds either a portrait or
 * nothing, and dropping a file into /public is the whole of adding one.
 *
 * The check lives in this component rather than in the page because it
 * is this element's precondition, and because it is a filesystem call:
 * a page that imports it is a page that cannot be a client component by
 * accident.
 */
export function Portrait({ src, alt }: { src?: string | null; alt: string }) {
  if (!src || !existsSync(join(process.cwd(), 'public', src))) return null

  /* width/height are set so nothing reflows while it decodes. */
  return <img className="portrait" src={src} alt={alt} width={208} height={208} decoding="async" />
}
