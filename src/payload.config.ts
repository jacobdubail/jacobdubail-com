import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { CodeBlock } from './blocks/Code'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { About } from './globals/About'
import { SiteSettings } from './globals/SiteSettings'
import { siteUrl } from './lib/site'
import { tags } from './lib/tags'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  serverURL: siteUrl,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · jacobdubail.com' },
  },
  collections: [Posts, Projects, Media, Users],
  globals: [SiteSettings, About],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: [CodeBlock] })],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  endpoints: [
    {
      // POST /api/revalidate (logged in): flush every content cache tag. Use after
      // running `pnpm seed` or `pnpm import:wordpress` against the production DB,
      // since scripts run outside Next.js and can't invalidate its cache.
      path: '/revalidate',
      method: 'post',
      handler: async (req) => {
        if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        const { revalidateTag } = await import('next/cache')
        const all = [
          tags.collection('posts'),
          tags.collection('projects'),
          tags.global('site-settings'),
          tags.global('about'),
        ]
        all.forEach((t) => revalidateTag(t, { expire: 0 }))
        return Response.json({ revalidated: all })
      },
    },
  ],
  plugins: [
    seoPlugin({
      collections: ['posts', 'projects'],
      uploadsCollection: 'media',
      tabbedUI: false,
      generateTitle: ({ doc }) => `${doc?.title ?? ''} · Jacob Dubail`,
      generateDescription: ({ doc }) => doc?.excerpt ?? doc?.summary ?? '',
      generateURL: ({ doc, collectionSlug }) =>
        `${siteUrl}/${collectionSlug === 'posts' ? 'writing' : 'projects'}/${doc?.slug ?? ''}`,
    }),
    vercelBlobStorage({
      // Only active when a token is present; locally uploads go to /media on disk.
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
