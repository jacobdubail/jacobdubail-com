/**
 * Seeds the database. Safe to re-run: documents are upserted by slug.
 *
 *   pnpm seed        real content: settings, About draft, archived posts + projects, admin user
 *   pnpm seed:demo   also adds published placeholder posts/projects so the lists look full
 */
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { about, archivedPosts, archivedProjects, demoPosts, demoProjects, settings } from './data'

const context = { disableRevalidate: true }

async function upsert<T extends 'posts' | 'projects'>(
  payload: Payload,
  collection: T,
  data: Record<string, unknown> & { slug: string },
) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: data.slug } },
    limit: 1,
    draft: true,
    context,
  })
  const body = { ...data, generateSlug: false, _status: 'published' } as never
  if (existing.docs[0]) {
    await payload.update({ collection, id: existing.docs[0].id, data: body, context })
    return 'updated'
  }
  await payload.create({ collection, data: body, context })
  return 'created'
}

async function run() {
  const payload = await getPayload({ config })
  const demo = process.env.SEED_DEMO === 'true'

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (email && password) {
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (!users.docs.length) {
      await payload.create({ collection: 'users', data: { email, password, name: 'Jacob Dubail' } })
      payload.logger.info(`Created admin user ${email}`)
    }
  }

  await payload.updateGlobal({ slug: 'site-settings', data: settings, context })
  await payload.updateGlobal({ slug: 'about', data: about as never, context })
  payload.logger.info('Updated site settings + About')

  for (const post of archivedPosts) {
    const r = await upsert(payload, 'posts', { ...post, archived: true })
    payload.logger.info(`post ${post.slug}: ${r}`)
  }
  for (const project of archivedProjects) {
    const r = await upsert(payload, 'projects', { ...project, archived: true })
    payload.logger.info(`project ${project.slug}: ${r}`)
  }

  if (demo) {
    for (const post of demoPosts) await upsert(payload, 'posts', { ...post, archived: false })
    for (const project of demoProjects)
      await upsert(payload, 'projects', { ...project, archived: false })
    payload.logger.info(
      `Added ${demoPosts.length} demo posts and ${demoProjects.length} demo projects`,
    )
  }

  payload.logger.info('Seed complete')
  process.exit(0)
}

// Top-level await: `payload run` exits as soon as the module finishes evaluating.
try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
