import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, publishedOrAuthenticated } from '@/access'
import { revalidateCollection } from '@/hooks/revalidate'

const hooks = revalidateCollection('projects')

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'archived', '_status'],
    group: 'Content',
    preview: (doc) => `/projects/${doc.slug}`,
  },
  defaultSort: ['-year', 'title'],
  access: {
    create: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 25 },
  hooks: {
    afterChange: [hooks.afterChange],
    afterDelete: [hooks.afterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'summary', type: 'textarea', admin: { description: 'One line, shown in lists.' } },
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text', admin: { width: '50%' } },
        { name: 'stack', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'industry', type: 'text', admin: { width: '50%' } },
        { name: 'siteUrl', type: 'text', label: 'Site URL', admin: { width: '50%' } },
      ],
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText' },
    slugField({ position: 'sidebar' }),
    { name: 'year', type: 'number', required: true, index: true, admin: { position: 'sidebar' } },
    {
      name: 'ongoing',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Shows "Ongoing" instead of an industry.' },
    },
    {
      name: 'archived',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Client work from the consulting years.' },
    },
  ],
}
