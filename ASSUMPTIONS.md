# Assumptions and open questions

I built this overnight without being able to ask you, so wherever I had to choose, the choice and the reasoning are below. Roughly most to least important. Each one is easy to change.

## Needs you

1. **No GitHub repo yet.** My cloud workspace has no working GitHub login, so I couldn't create the private repo. Run `./scripts/bootstrap-repo.sh` (uses your `gh` login) to `git init`, create the private repo `jacobdubail/jacobdubail.com`, and push.
2. **Old post bodies aren't imported.** I couldn't reach jacobdubail.com from the sandbox. The two 2013 posts are seeded with their real titles, dates and slugs, plus a placeholder body. Export from WordPress and run `pnpm import:wordpress` (see README).
3. **Placeholder content.** `pnpm seed:demo` adds 7 made-up posts and 4 made-up projects (titles from the mockups) so the design reads properly. `pnpm seed` doesn't include them. The About page is a draft I wrote from what I know, and it says so at the bottom.
4. **Social links.** Seeded with GitHub and X (`@jacobdubail`, from the old site). LinkedIn and email are left out because I don't know which you want public. Add them in Admin → Site settings.
5. **Admin login.** `pnpm seed` creates the admin user from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`. Change the password after first login.

## Stack decisions

6. **Payload 3.91 (latest stable) with Next 16.4 and `cacheComponents: true`.** Official Cache Components support was merged into Payload's main branch on Oct 16 for **Payload 4.0** (beta). On 3.91 it works in production; I built, ran, logged in and edited content. In dev, the admin's "instant navigation" checks threw warnings, so `src/app/(payload)/layout.tsx` and the admin page set `export const instant = false`. These files are otherwise Payload-generated. Revisit both when moving to Payload 4.
7. **React 19.3.1** (stable `<ViewTransition>`), which is newer than Payload's template (19.2). Payload's peer range allows it.
8. **Detail pages block navigation on purpose** (`instant = false`) so the title/date morph works. The trade-off: a post published after the last build renders on its first request instead of serving an instant shell.
9. **TypeScript 5.9, not 7.** TS 7 (the Go port) is out, but Payload's tooling hasn't been validated against it.
10. **ESLint 9**, because eslint-config-next 16 targets it.
11. **Fonts are self-hosted** from `src/fonts` with `next/font/local`. `next/font/google` would also work on Vercel, but the files are tiny and this removes the build-time network dependency.
12. **Postgres everywhere.** Local uses Docker (`pnpm db:up`), production uses Neon from the Vercel marketplace. Migrations live in `src/migrations` and run in `vercel-build`.
13. **Media.** Vercel Blob in production (enabled only when `BLOB_READ_WRITE_TOKEN` is set), local disk (`/media`) in dev.

## Content model

14. **About is a global, not a Pages collection.** It's the only free-form page. If more pages come later, a `pages` collection with blocks would be the next step.
15. **Tags are free-text** on posts rather than a separate collection. Simple to start; easy to promote later.
16. **Project dates are years only.** "Ongoing" projects show _Ongoing_ instead of an industry.
17. **Drafts + autosave + scheduled publish** are on for posts, drafts + autosave for projects. Only published content is ever queried by the site.
18. **No live preview / draft-mode preview yet.** The admin "Preview" button goes to the public URL, which only shows published content.
19. **SEO plugin** adds meta title/description/image fields. Pages fall back to the title and excerpt.

## Design translations (prototype → code)

20. **Small grey text got slightly darker** (`faint` #9A958D → #7A756D light, #666D78 → #7D8490 dark) to pass WCAG AA at 13.5px. Dates and counts look a touch stronger than the mockup.
21. **Tangerine has two shades:** #E05C1F for marks, the band and large type, and #C5511B for small text and links on white (AA). Dark mode uses #E3672E for both.
22. **Light/dark toggle in the footer.** The mockup had it in the toolbar only. The site follows the OS setting until you click, then remembers the choice per browser.
23. **Footer** keeps the chevron separators and the "Top" link and drops the center logo, as in the final motif mockup.
24. **Archived posts show the year only** in lists ("2013") and the full date on the post, matching the mockups.
25. **Writing tag filter is client-side**, so the page stays static (no `searchParams`). Filter state isn't in the URL.
26. **Favicon** is the full mark, switching to light on dark tabs. We talked about a chevron-only favicon; it's a one-file swap (`src/app/icon.svg`).
27. **Body copy is still black/tangerine-led.** You mentioned bringing more azure into the body. That's not done yet, but the tokens make it a small change (e.g. links or section labels in `--c-blue`).

## Not done yet (next steps)

- Download images referenced inside imported WordPress posts and attach them as Media
- Open Graph images (a generated `opengraph-image.tsx` per post would fit the design)
- Code syntax highlighting (blocks render as plain monospace for now; Shiki at build time would work)
- Draft preview / live preview in the admin
- Tests (a Playwright smoke test for the main routes and the admin login is the obvious first one)
- An email adapter for Payload (password resets currently log to the console)
