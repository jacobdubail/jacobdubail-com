import type { Metadata } from 'next'

import { EntryRow } from '@/components/EntryRow'
import { IndexSection } from '@/components/IndexSection'
import { PageHeader } from '@/components/PageHeader'
import { getProjects, getSettings } from '@/lib/queries'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()])
  const current = projects.filter((p) => !p.archived)
  const archive = projects.filter((p) => p.archived)
  const years = archive.map((p) => p.year)
  const range = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : ''

  const rows = (list: typeof projects) =>
    list.map((p) => (
      <EntryRow
        key={p.id}
        href={`/projects/${p.slug}`}
        vtKey={`projects-${p.slug}`}
        title={p.title}
        date={String(p.year)}
        description={p.summary}
        archived={p.archived}
      />
    ))

  return (
    <>
      <PageHeader title="Projects" intro={settings.projectsIntro} />
      {current.length ? <IndexSection label="Now">{rows(current)}</IndexSection> : null}
      {archive.length ? (
        <IndexSection label="Archive" aside={range} className={current.length ? 'mt-12' : 'mt-16'}>
          {rows(archive)}
        </IndexSection>
      ) : null}
    </>
  )
}
