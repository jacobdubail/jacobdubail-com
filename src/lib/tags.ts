/** Cache tag names shared by 'use cache' readers and Payload revalidation hooks. */
export const tags = {
  collection: (c: 'posts' | 'projects') => c,
  doc: (c: 'posts' | 'projects', slug?: string | null) => `${c}:${slug ?? ''}`,
  global: (g: 'site-settings' | 'about') => `global:${g}`,
}
