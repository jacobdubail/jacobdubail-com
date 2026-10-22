import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { getPosts, getSettings } from '@/lib/queries'

import { WritingIndex } from './WritingIndex'

export const metadata: Metadata = { title: 'Writing' }

export default async function WritingPage() {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()])
  return (
    <>
      <PageHeader title="Writing" intro={settings.writingIntro} />
      <WritingIndex posts={posts} />
    </>
  )
}
