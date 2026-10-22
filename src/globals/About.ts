import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const About: GlobalConfig = {
  slug: 'about',
  admin: { group: 'Site' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal('about')] },
  fields: [
    { name: 'intro', type: 'textarea', admin: { description: 'Larger opening paragraph' } },
    { name: 'content', type: 'richText' },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    {
      name: 'now',
      type: 'array',
      labels: { singular: 'Now item', plural: 'Now' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '30%' } },
            { name: 'value', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
      ],
    },
  ],
}
