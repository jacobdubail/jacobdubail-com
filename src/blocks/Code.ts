import type { Block } from 'payload'

export const CodeBlock: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  labels: { singular: 'Code', plural: 'Code blocks' },
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'ts',
      options: ['ts', 'tsx', 'js', 'css', 'scss', 'html', 'php', 'bash', 'json', 'text'].map(
        (v) => ({
          label: v,
          value: v,
        }),
      ),
    },
    { name: 'code', type: 'code', required: true, admin: { language: 'typescript' } },
    { name: 'caption', type: 'text' },
  ],
}
