import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Site' },
  access: { read: anyone, update: authenticated },
  hooks: { afterChange: [revalidateGlobal('site-settings')] },
  fields: [
    {
      type: 'collapsible',
      label: 'Home hero',
      fields: [
        {
          name: 'headline',
          type: 'text',
          required: true,
          defaultValue: 'I build engineering teams and the systems they run on.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'highlightBlue',
              type: 'text',
              admin: { width: '50%', description: 'Word in the headline set in azure' },
              defaultValue: 'teams',
            },
            {
              name: 'highlightOrange',
              type: 'text',
              admin: { width: '50%', description: 'Word in the headline set in tangerine' },
              defaultValue: 'systems',
            },
          ],
        },
        { name: 'intro', type: 'textarea' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'writingIntro', type: 'text', admin: { width: '50%' } },
        { name: 'projectsIntro', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'homeListLength',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 20,
      admin: { description: 'How many posts and projects to show on the home page' },
    },
    {
      name: 'social',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, admin: { width: '30%' } },
            { name: 'url', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
        {
          name: 'inFooter',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
