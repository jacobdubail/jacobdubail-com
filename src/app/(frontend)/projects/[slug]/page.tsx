import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'

import { GappedArrow } from '@/components/icons'
import { RichText } from '@/components/RichText'
import { getProject, getProjects } from '@/lib/queries'

/**
 * Blocking on purpose: every published slug is prerendered, and rendering the
 * header in the same commit as the navigation is what lets the title and date
 * morph from the list (React <ViewTransition>). A Suspense boundary around
 * params would give an instant shell but break the shared-element morph.
 */
export const instant = false

export async function generateStaticParams() {
  const projects = await getProjects()
  // Cache Components requires at least one param; an empty DB (first deploy) would fail the build.
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: '_' }]
}

export async function generateMetadata({
  params,
}: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}
  return {
    title: project.meta?.title?.replace(/ · Jacob Dubail$/, '') || project.title,
    description: project.meta?.description || project.summary || undefined,
    alternates: { canonical: `/projects/${project.slug}` },
  }
}

const href = (url: string) => (/^https?:\/\//.test(url) ? url : `https://${url}`)

export default function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
  return (
    <article className="index-offset">
      <Link
        href="/projects"
        className="group mb-12 inline-flex items-center gap-2 text-sm text-mute hover:text-fg"
      >
        <GappedArrow className="w-3.5 -scale-x-100 text-orange transition-transform group-hover:-translate-x-[3px]" />
        All projects
      </Link>
      <Project params={params} />
    </article>
  )
}

async function Project({ params }: Pick<PageProps<'/projects/[slug]'>, 'params'>) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const vtKey = `projects-${project.slug}`
  const cover = typeof project.cover === 'object' ? project.cover : null
  const facts = [
    { label: 'Role', value: project.role },
    { label: 'Stack', value: project.stack },
    project.ongoing
      ? { label: 'Status', value: 'Ongoing' }
      : { label: 'Industry', value: project.industry },
    {
      label: 'Site',
      value: project.siteUrl ? (
        <a href={href(project.siteUrl)} className="ext break-all text-orange-text">
          {project.siteUrl.replace(/^https?:\/\//, '')}
        </a>
      ) : null,
    },
  ].filter((f) => f.value)

  return (
    <>
      <ViewTransition name={`date-${vtKey}`} share="morph" default="none">
        <p className="mb-3 w-fit text-sm text-faint tabular-nums">{project.year}</p>
      </ViewTransition>
      <ViewTransition name={`title-${vtKey}`} share="morph" default="none">
        <h1 className="mb-4 w-fit font-serif text-display font-normal tracking-[-0.02em]">
          {project.title}
        </h1>
      </ViewTransition>
      {project.summary ? (
        <p className="mb-7 max-w-[36em] text-md leading-[1.55] text-mute">{project.summary}</p>
      ) : null}

      {project.archived ? (
        <aside className="mb-8 border-l-2 border-blue bg-soft px-4 py-3 text-sm leading-[1.55] text-mute">
          <b className="font-medium text-fg">Archive project.</b> Client work from my consulting
          years. The live site may have changed since launch.
        </aside>
      ) : null}

      {cover?.url ? (
        <Image
          src={cover.url}
          alt={cover.alt ?? ''}
          width={cover.width ?? 1600}
          height={cover.height ?? 1000}
          sizes="(max-width: 720px) 100vw, 640px"
          className="mb-8 rounded-md border border-line"
          priority
        />
      ) : null}

      {facts.length ? (
        <dl className="mb-8 grid grid-cols-4 gap-4 border-y border-line py-4 max-sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="mb-1 text-xs text-faint">{f.label}</dt>
              <dd className="text-sm leading-normal">{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <RichText data={project.content} />
    </>
  )
}
