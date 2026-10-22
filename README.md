# jacobdubail.com

Personal site for Jacob Dubail. Next.js 16 (App Router, Cache Components) with Payload 3 as the CMS, running in the same app. Postgres for data, Vercel Blob for uploads, Tailwind v4 for styles.

Open decisions and the calls made while building are in [ASSUMPTIONS.md](./ASSUMPTIONS.md).

## Quick start

Requires Node 22.12+, pnpm 10, and Postgres 16+ (Docker or a local install).

```bash
cp .env.example .env            # then set PAYLOAD_SECRET (openssl rand -hex 32) and the seed admin login
pnpm install
pnpm db:up                      # Postgres in Docker (or point DATABASE_URL at your own)
pnpm seed:demo                  # real content + placeholder posts so the lists look full
pnpm dev                        # http://localhost:3000, admin at /admin
```

`pnpm seed` loads only the real content (site settings, About draft, the 2 archived posts, the 5 archived projects, and your admin user). `pnpm seed:demo` adds 7 placeholder posts and 4 placeholder projects. Delete those in the admin when real posts arrive.

In development Payload "pushes" schema changes straight to the database, so you don't need migrations locally.

## Scripts

| Command                            | What it does                                                 |
| ---------------------------------- | ------------------------------------------------------------ |
| `pnpm dev`                         | Dev server (Turbopack)                                       |
| `pnpm build` / `pnpm start`        | Production build / serve                                     |
| `pnpm vercel-build`                | `payload migrate` then build. Vercel runs this automatically |
| `pnpm typecheck`                   | Route types + `tsc`                                          |
| `pnpm lint` / `pnpm format`        | ESLint (flat config) / Prettier with the Tailwind plugin     |
| `pnpm seed` / `pnpm seed:demo`     | Seed content (idempotent, upserts by slug)                   |
| `pnpm import:wordpress [file.xml]` | Import posts + projects from a WordPress export              |
| `pnpm migrate:create <name>`       | Create a migration after changing collections                |
| `pnpm generate:types`              | Regenerate `src/payload-types.ts`                            |

## How it's put together

```
src/
  app/(frontend)/        public site: home, writing, projects, about, feed.xml, sitemap
  app/(payload)/         Payload admin + REST/GraphQL API (generated, lightly edited)
  collections/           Posts, Projects, Media, Users
  globals/               SiteSettings (hero, intros, social links), About
  components/            EntryRow, IndexSection (margin index), nav/footer, icons, RichText
  lib/queries.ts         every read: 'use cache' + cacheTag
  hooks/revalidate.ts    Payload afterChange → revalidateTag
  seed/                  seed data + Lexical JSON helpers
scripts/import-wordpress.ts
redirects.ts             old WordPress URLs → new routes
```

**Caching.** `cacheComponents` and `partialPrefetching` are on. Every Payload read lives in `src/lib/queries.ts` as a `'use cache'` function with `cacheLife('max')` and a tag (`posts`, `posts:<slug>`, `global:about`, …). When you save in the admin, the collection's `afterChange` hook calls `revalidateTag(tag, 'max')`. The next visitor gets the old page while it regenerates, and everyone after that gets the new one. Every page builds as static HTML.

Scripts (`seed`, `import:wordpress`) run outside Next.js, so they can't clear its cache. After running one against production, either redeploy or, while logged in, `POST /api/revalidate`.

**View transitions.** React 19.3's `<ViewTransition>` is wired into `EntryRow` and the post/project headers with matching `title-*` / `date-*` names, so titles and dates morph from the list into the article. The rest of the page crossfades. Detail pages set `export const instant = false` on purpose: the morph only pairs when the header renders in the same commit as the navigation. See the comment in `writing/[slug]/page.tsx`.

**Loader.** `EntryLead` uses `useLinkStatus()`: while a link's navigation is pending, the hover arrow becomes the scissor loader. Pages are prefetched, so you'll mostly see it on slow connections.

**Design tokens.** All colors, type sizes and the 4px spacing grid are in `src/app/(frontend)/globals.css` (`@theme`). Light mode: tangerine `#E05C1F` band, azure `#1F6FD1` + tangerine highlights. Dark mode: azure band. The split-chevron motif is one CSS mask (`--chev`) reused for nav, labels, bullets, quotes, section breaks and external links.

**Fonts.** Inter, Fraunces and JetBrains Mono (variable, latin subset) are self-hosted from `src/fonts` with `next/font/local`. All three are SIL Open Font License.

## Deploying to Vercel

1. Push to GitHub (`./scripts/bootstrap-repo.sh` creates a private repo with `gh` and pushes).
2. Import the repo in Vercel. Framework: Next.js. Vercel uses `pnpm vercel-build` automatically.
3. In the project's **Storage** tab, add **Neon Postgres** (sets `DATABASE_URL`, possibly as `POSTGRES_URL`; see note) and **Blob** (sets `BLOB_READ_WRITE_TOKEN`).
4. Add env vars: `PAYLOAD_SECRET` (new random value) and `NEXT_PUBLIC_SERVER_URL=https://jacobdubail.com`.
5. Deploy. The first build runs the migrations against the empty database and builds an empty site.
6. Seed production once from your machine: `DATABASE_URL=<neon url> pnpm seed`, then `POST /api/revalidate` (or redeploy).
7. Add `jacobdubail.com` and `www.jacobdubail.com` under Domains. Move DNS off the WordPress host when you're happy.

> Neon via the Vercel marketplace names the variable `DATABASE_URL` in most setups. If yours shows `POSTGRES_URL` instead, add `DATABASE_URL` pointing at the same value (use the pooled connection string).

## Importing the old WordPress content

The seed only has titles, dates and one-line summaries for the two 2013 posts. To bring over the full text:

1. WordPress admin → Tools → Export → All content → Download.
2. Save it as `wordpress-export.xml` in the project root (it's gitignored).
3. `pnpm import:wordpress`

Posts become archived Writing entries with their original slugs, and the custom "work" post type becomes archived Projects. Re-running updates in place. Images inside posts aren't downloaded yet (see ASSUMPTIONS.md).
