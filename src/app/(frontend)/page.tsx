import Link from 'next/link'

import { EntryRow } from '@/components/EntryRow'
import { Headline } from '@/components/Headline'
import { IndexSection } from '@/components/IndexSection'
import { PageHeader } from '@/components/PageHeader'
import { listDate } from '@/lib/format'
import { getPosts, getProjects, getSettings } from '@/lib/queries'

export default async function HomePage() {
  const [settings, posts, projects] = await Promise.all([getSettings(), getPosts(), getProjects()])
  const n = settings.homeListLength ?? 6

  return (
    <>
      <PageHeader
        title={
          <Headline
            text={settings.headline}
            blue={settings.highlightBlue}
            orange={settings.highlightOrange}
          />
        }
        intro={settings.intro}
      />

      {posts.length ? (
        <IndexSection
          label="Writing"
          aside={
            <Link href="/writing" className="index-aside">
              All {posts.length} posts
            </Link>
          }
        >
          {posts.slice(0, n).map((p) => (
            <EntryRow
              key={p.id}
              href={`/writing/${p.slug}`}
              vtKey={`posts-${p.slug}`}
              title={p.title}
              date={listDate(p.publishedAt, p.archived)}
              archived={p.archived}
            />
          ))}
        </IndexSection>
      ) : null}

      {projects.length ? (
        <IndexSection
          label="Projects"
          aside={
            <Link href="/projects" className="index-aside">
              All {projects.length} projects
            </Link>
          }
        >
          {projects.slice(0, n).map((p) => (
            <EntryRow
              key={p.id}
              href={`/projects/${p.slug}`}
              vtKey={`projects-${p.slug}`}
              title={p.title}
              date={String(p.year)}
              archived={p.archived}
            />
          ))}
        </IndexSection>
      ) : null}
    </>
  )
}
