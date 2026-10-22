import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import {
  type JSXConvertersFunction,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

import type { CodeBlock, Media } from '@/payload-types'

import { siteUrl } from '@/lib/site'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const doc = linkNode.fields.doc
  const value = doc?.value
  const slug = typeof value === 'object' ? (value?.slug as string | undefined) : undefined
  if (!slug) return '#'
  return doc?.relationTo === 'projects' ? `/projects/${slug}` : `/writing/${slug}`
}

const isExternal = (url?: string) => {
  if (!url || url.startsWith('/') || url.startsWith('#') || url.startsWith('mailto:')) return false
  try {
    return new URL(url).host !== new URL(siteUrl).host
  } catch {
    return false
  }
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  link: ({ node, nodesToJSX }) => {
    const internal = node.fields.linkType === 'internal'
    const href = internal ? internalDocToHref({ linkNode: node }) : (node.fields.url ?? '#')
    const newTab = node.fields.newTab
    return (
      <a
        href={href}
        className={!internal && isExternal(href) ? 'ext' : undefined}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
      >
        {nodesToJSX({ nodes: node.children })}
      </a>
    )
  },
  upload: ({ node }) => {
    const media = node.value as Media
    if (typeof media !== 'object' || !media?.url) return null
    return (
      <figure>
        <Image
          src={media.url}
          alt={media.alt ?? ''}
          width={media.width ?? 1600}
          height={media.height ?? 1000}
          sizes="(max-width: 720px) 100vw, 640px"
        />
        {media.caption ? <figcaption>{media.caption}</figcaption> : null}
      </figure>
    )
  },
  blocks: {
    code: ({ node }: { node: { fields: CodeBlock } }) => (
      <figure>
        <pre data-language={node.fields.language ?? undefined}>
          <code>{node.fields.code}</code>
        </pre>
        {node.fields.caption ? <figcaption>{node.fields.caption}</figcaption> : null}
      </figure>
    ),
  },
})

export function RichText({
  data,
  className,
}: {
  data?: SerializedEditorState | Record<string, unknown> | null
  className?: string
}) {
  if (!data) return null
  return (
    <PayloadRichText
      data={data as SerializedEditorState}
      converters={converters}
      className={`prose ${className ?? ''}`}
      disableIndent
      disableTextAlign
    />
  )
}
