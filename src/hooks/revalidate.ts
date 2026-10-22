import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

import { tags } from '@/lib/tags'

/**
 * Payload runs inside the Next.js server, so collection hooks can invalidate
 * 'use cache' entries directly. Outside Next (e.g. `pnpm seed` via `payload run`)
 * there is no cache to revalidate, so failures are swallowed.
 */
async function revalidate(tagList: string[], context: Record<string, unknown>) {
  if (context?.disableRevalidate) return
  try {
    const { revalidateTag } = await import('next/cache')
    for (const tag of tagList) revalidateTag(tag, 'max')
  } catch {
    // not running inside Next.js
  }
}

type Doc = { slug?: string | null }

export const revalidateCollection = (
  collection: 'posts' | 'projects',
): { afterChange: CollectionAfterChangeHook; afterDelete: CollectionAfterDeleteHook } => ({
  afterChange: async ({ doc, previousDoc, req }) => {
    const list = [tags.collection(collection), tags.doc(collection, (doc as Doc).slug)]
    if ((previousDoc as Doc)?.slug && (previousDoc as Doc).slug !== (doc as Doc).slug) {
      list.push(tags.doc(collection, (previousDoc as Doc).slug))
    }
    await revalidate(list, req.context)
    return doc
  },
  afterDelete: async ({ doc, req }) => {
    await revalidate(
      [tags.collection(collection), tags.doc(collection, (doc as Doc).slug)],
      req.context,
    )
    return doc
  },
})

export const revalidateGlobal =
  (slug: 'site-settings' | 'about'): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    await revalidate([tags.global(slug)], req.context)
    return doc
  }
