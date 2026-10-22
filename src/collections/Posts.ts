import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'

const hooks = revalidateCollection('posts')

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Writing' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'archived', '_status'],
    group: 'Content',
    preview: (doc) => `/writing/${doc.slug}`,
  },
  defaultSort: '-publishedAt',
  access: {
    create: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: { autosave: { interval: 800 }, schedulePublish: true },
    maxPerDoc: 25,
  },
  hooks: {
    afterChange: [hooks.afterChange],
    afterDelete: [hooks.afterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description:
          'One line. Shown under the title on the Writing page and as the intro of the post.',
      },
    },
    { name: 'content', type: 'richText' },
    slugField({ position: 'sidebar' }),
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'MMM d, yyyy' },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) =>
            !value && siblingData._status === 'published' ? new Date().toISOString() : value,
        ],
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { position: 'sidebar', description: 'Lowercase, e.g. hiring, ai, css' },
    },
    {
      name: 'archived',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Imported from the old WordPress site. Shows the "From the archive" note.',
      },
    },
    {
      name: 'originalUrl',
      type: 'text',
      admin: { position: 'sidebar', condition: (data) => Boolean(data?.archived) },
    },
  ],
}
